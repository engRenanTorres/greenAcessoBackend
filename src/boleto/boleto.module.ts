import { Module } from '@nestjs/common';
import { BoletoService } from './boleto.service';
import { BoletoController } from './boleto.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoletosRepository } from './repositories/boletos.repository';
import { LotesModule } from '../lotes/lotes.module';

@Module({
  imports: [LotesModule],
  controllers: [BoletoController],
  providers: [BoletoService, PrismaService, BoletosRepository],
})
export class BoletoModule {}
