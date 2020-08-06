export interface Config {
  port: number;
  prefix?: string;
  mongo?: MongoConfig;
  auth?: AuthConfig;
  kafka?: KafkaConfig;
  deviceService: DeviceService;
}

export interface AuthConfig {
  algorithms?: string[];
  issuer?: string;
  publicKey?: string;
  realm?: string;
  resource?: string;
  host?: string;
  clientSecret?: string;
}

export interface MongoConfig {
  uri?: string;
  database?: string;
}

export interface KafkaConfig {
  clientId?: string;
  prefix?: string;
  brokerUris?: string[];
}

export interface DeviceService {
  username?: string;
  password?: string;
}
