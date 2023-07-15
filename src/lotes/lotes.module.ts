import { Module } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LotesRepository } from './repositories/lotes.repository';

@Module({
  controllers: [LotesController],
  providers: [LotesService, PrismaService, LotesRepository],
  exports: [LotesService],
})
export class LotesModule {}
