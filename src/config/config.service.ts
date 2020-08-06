import {
  Config,
  MongoConfig,
  KafkaConfig,
  AuthConfig,
} from './config.interface';

export class ConfigService {
  private readonly config: Config;

  public getConfig(): Config {
    return this.config;
  }

  constructor() {
    const auth: AuthConfig = {};
    auth.algorithms = ['RS256'];
    auth.issuer =
      process.env.AUTH_ISSUER || 'http://keycloak.auth:8080/auth/realms/edu';

    auth.realm = process.env.AUTH_REALM || 'edu';

    auth.host = process.env.AUTH_HOST || 'localhost';
    auth.clientSecret = '7847ddd2-9707-46ed-bec5-75014c094a76';

    auth.resource = process.env.AUTH_RESOURCE || 'tenant-service';
    auth.publicKey =
      process.env.AUTH_PUBLIC_KEY ||
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjVphni5jrwLiOXhzSSse7cprTmxSwL/J/FepX1MpkROiVVIEbkHg8v+oeuNGGVG6BAP131BQzvPrpBvtLIfvARzzfn83/tMF1k2hUlDP6PCr2mohg02grSaQJ+nl1gtl5p1P84mz6yzM8dAGGWLJ29F6ryx0I1GDQ7w9WquarWbdkUr1pePTz3NDqiUgqh7RtEQpvsrhA6PyeB76QZt/oq/xTTPL7cgKwBiEQckWdRjydXKcN880qbf5+q69Wz5LN5vKMfRv3OloJ3dai7m+Qq2BiZQFq1uRw9XCaLJuxuY2M4o8rL8wnMmDtnOAd07g/lbS713zRhVWY+/UWgbxJwIDAQAB\n-----END PUBLIC KEY-----';

    const mongo: MongoConfig = {};
    const user = process.env.MONGO_USER || '';
    const password = process.env.MONGO_PASSWORD || '';
    const credentials = user && password ? `${user}:${password}@` : '';
    const mongoHost = process.env.MONGO_HOST || 'localhost';
    const mongoPort = process.env.MONGO_PORT || '27017';
    const database = process.env.MONGO_DATABASE || 'tenant';

    mongo.uri =
      process.env.MONGO_URI ||
      `mongodb://${credentials}${mongoHost}:${mongoPort}/${database}`;

    const kafka: KafkaConfig = {};

    kafka.clientId = 'tenant';
    kafka.prefix = process.env.KAFKA_PREFIX || 'local';
    const kafkaHost = process.env.KAFKA_HOST || 'localhost';
    const kafkaPort = process.env.KAFKA_PORT || '9093';
    kafka.brokerUris = [`${kafkaHost}:${kafkaPort}`];

    this.config = {
      port: +process.env.PORT || 3000,
      prefix: process.env.PREFIX || 'api',
      mongo,
      auth,
      kafka,
    };
  }
}
