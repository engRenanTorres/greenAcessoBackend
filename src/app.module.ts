import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LotesModule } from './lotes/lotes.module';
import { BoletoModule } from './boleto/boleto.module';

@Module({
  imports: [ConfigModule.forRoot(), LotesModule, BoletoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
