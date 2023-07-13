import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';
import { LoteEntity } from '../entities/lote.entity';

@Injectable()
export class LotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoteDto: CreateLoteDto): Promise<LoteEntity> {
    return await this.prisma.lotes.create({ data: createLoteDto });
  }

  async findAll(): Promise<LoteEntity[]> {
    return await this.prisma.lotes.findMany();
  }

  async findOne(id: number): Promise<LoteEntity> {
    return await this.prisma.lotes.findUnique({ where: { id: id } });
  }

  async update(id: number, updateLoteDto: UpdateLoteDto): Promise<LoteEntity> {
    return await this.prisma.lotes.update({
      where: { id: id },
      data: updateLoteDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.lotes.delete({ where: { id: id } });
  }
}
