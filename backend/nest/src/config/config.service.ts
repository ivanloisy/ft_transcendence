import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error('config error - missing env.${key}');
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', false) || '3000';
  }

  public getFrontendUrl() {
    return this.getValue('FRONTEND_URL', false) || 'http://localhost:8080';
  }

  // public isProduction(): boolean {
  //   const mode = this.getValue('MODE', false);
  //   const nodeEnv = this.getValue('NODE_ENV', false);
  //   return (
  //     mode === 'production' ||
  //     nodeEnv === 'production' ||
  //     (mode !== 'DEV' && nodeEnv !== 'development')
  //   );
  // }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DB'),
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'API_CLIENT_ID',
  'API_CLIENT_SECRET',
  'API_CALLBACK_URL',
  'JWT_SECRET_KEY',
  'JWT_EXPIRATION',
  'TWO_FA_APP_NAME',
]);

export { configService };
