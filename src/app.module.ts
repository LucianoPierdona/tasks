import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule,
    TaskModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: configService.getString('DB_CONNECTION_NAME'),
        type: 'postgres',
        host: configService.getString('DB_CONNECTION_HOST'),
        port: configService.getNumber('DB_CONNECTION_PORT'),
        username: configService.getString('DB_CONNECTION_USERNAME'),
        password: configService.getString('DB_CONNECTION_PASSWORD'),
        database: configService.getString('DB_CONNECTION_DATABASE'),
        entities: [join(__dirname, '../') + '**/*.entity.js'],
        dropSchema: configService.getBoolean('DB_CONNECTION_DROP_SCHEMA'),
        synchronize: configService.getBoolean('DB_CONNECTION_SYNCHRONIZE'),
        logging: configService.getBoolean('DB_CONNECTION_LOGGING'),
        cache: configService.getBoolean('DB_CONNECTION_CACHE'),
        migrations: [
          join(__dirname, '../', 'database', 'migrations') + '**/*.js',
        ],
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
