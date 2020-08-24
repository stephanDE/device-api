import { Injectable, HttpService, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Device } from './device.schema';
import { CreateDeviceDto } from './dto/createDevice.dto';
import { FraunhoferDevice } from './fraunhofer.device.schema';
import { ConfigService } from 'src/config/config.service';
import { map } from 'rxjs/operators';
import { map as lodashMap, uniqBy } from 'lodash';
import { of } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { Config } from 'src/config/config.interface';
import { v4 as uuid } from 'uuid';

const FRAUNHOFER_FLATS = [
  'SD0',
  'SD1',
  'SD2',
  'SD3',
  'SD4',
  'SD5',
  'SD6',
  'SD7',
  /*  'SD8',
  'SD9',
  'SD10',
  'SD11',
  'SD12',
  'SD13',
  'SD14',
  'SD15',
  'SD16',
  'SD17',
  'SD18',
  'SD19',*/
];

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel('Device') private deviceModel: Model<Device>,
    @InjectModel('FraunhoferDevice')
    private fraunhoferDeviceModel: Model<FraunhoferDevice>,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @Inject('CONFIG') private config: Config,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async findAll(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }

  async findOne(id: string): Promise<Device> {
    return this.deviceModel.findOne({ roomId: id }).exec();
  }

  async findAllFraunhofer(): Promise<FraunhoferDevice[]> {
    return this.fraunhoferDeviceModel.find().exec();
  }

  async findOneFraunhofer(id: string): Promise<FraunhoferDevice> {
    return this.fraunhoferDeviceModel.findOne({ deviceId: id }).exec();
  }

  async createOne(dto: CreateDeviceDto): Promise<Device> {
    const device = await this.deviceModel.create(dto);

    const updated = await this.fraunhoferDeviceModel
      .findOneAndUpdate(
        { roomId: null },
        { roomId: device.roomId, deviceId: device._id },
      )
      .exec();

    const event = {
      id: uuid(),
      type: 'event',
      action: 'FraunhoferDeviceUpdated',
      timestamp: Date.now(),
      data: updated,
    };

    console.log('fraunhofer is jetzt', JSON.stringify(updated));

    this.kafkaClient.emit(`${this.config.kafka.prefix}-device-event`, event);

    return of(device).toPromise();
  }

  async getDeviceDataByRoom(roomId) {
    return this.fraunhoferDeviceModel.findOne({ roomId }).exec();
  }

  async fetchFraunhoferData() {
    const { username, password } = this.configService.getConfig().deviceService;

    lodashMap(FRAUNHOFER_FLATS, async flat => {
      const result = await this.httpService
        .get(
          `https://applik-d18.iee.fraunhofer.de:8443/flat/${flat}/measurements/`,
          {
            auth: {
              username,
              password,
            },
          },
        )
        .pipe(
          map(res => {
            return res.data.rooms;
          }),
        )
        .toPromise();

      lodashMap(result, async device => {
        const exist = await this.fraunhoferDeviceModel.exists({
          fraunhoferFlatId: flat,
          fraunhoferRoomNr: device.roomNr,
        });

        if (exist) {
          console.log('UPDATING DEVICE', device.roomNr, flat);

          const deviceInDB = await this.fraunhoferDeviceModel.findOne({
            fraunhoferFlatId: flat,
            fraunhoferRoomNr: device.roomNr,
          });

          const updated = await this.fraunhoferDeviceModel
            .findOneAndUpdate(
              {
                fraunhoferRoomNr: device.roomNr,
                fraunhoferFlatId: flat,
              },
              {
                meterValue: uniqBy(
                  [device.meterValue, ...deviceInDB.meterValue],
                  'timestamp',
                ),
                temperature: device.temperature,
              },
            )
            .exec();

          const event = {
            id: uuid(),
            type: 'event',
            action: 'FraunhoferDeviceUpdated',
            timestamp: Date.now(),
            data: updated,
          };

          this.kafkaClient.emit(
            `${this.config.kafka.prefix}-device-event`,
            event,
          );
        } else {
          console.log('CREATING DEVICE', device.roomNr, flat);

          const createdDevice = await this.fraunhoferDeviceModel.create({
            fraunhoferRoomNr: device.roomNr,
            fraunhoferFlatId: flat,
            meterValue: [device.meterValue],
            temperature: device.temperature,
            roomId: null,
            deviceId: null,
          });

          const event = {
            id: uuid(),
            type: 'event',
            action: 'FraunhoferDeviceCreated',
            timestamp: Date.now(),
            data: createdDevice,
          };

          this.kafkaClient.emit(
            `${this.config.kafka.prefix}-device-event`,
            event,
          );
        }
      });
    });
  }
}
