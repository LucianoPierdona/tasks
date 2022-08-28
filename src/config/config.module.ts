import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: () => {
        return new ConfigService(
          `${process.env.NODE_ENV || 'development'}.env`,
        );
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
