import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AIModule } from '@app/ai';
import config from './config';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: [path.resolve(__dirname, '../.env')],
    }),
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
