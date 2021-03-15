import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import config from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { Intent, IntentSchema } from './schemas/Intent.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: [path.resolve(__dirname, '../.env')],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongoUrl'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Intent.name, schema: IntentSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
