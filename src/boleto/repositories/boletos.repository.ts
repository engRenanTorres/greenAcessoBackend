import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBoletoDto } from '../dto/create-boleto.dto';
import { UpdateBoletoDto } from '../dto/update-boleto.dto';
import { BoletoEntity } from '../entities/boleto.entity';
import { GetBoletoQuery } from '../dto/get-query';

class findAllFilter {
  nome_sacado?: { contains: string };
  valor?: number;
  id_lote?: number;
}

@Injectable()
export class BoletosRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createMany(createBoletoDto: CreateBoletoDto[]): Promise<unknown> {
    return await this.prisma.boletos.createMany({ data: createBoletoDto });
  }
  async create(createBoletoDto: CreateBoletoDto): Promise<BoletoEntity> {
    return await this.prisma.boletos.create({ data: createBoletoDto });
  }

  async findAll(): Promise<BoletoEntity[]> {
    return await this.prisma.boletos.findMany();
  }
  async findAllWithFilters({
    nome,
    valor,
    id_lote,
  }: GetBoletoQuery): Promise<BoletoEntity[]> {
    const query = new findAllFilter();
    if (nome !== undefined) query.nome_sacado = { contains: nome };
    if (valor !== undefined) query.valor = +valor;
    if (id_lote !== undefined) query.id_lote = +id_lote;
    return await this.prisma.boletos.findMany({
      where: {
        ...query,
      },
    });
  }

  async findOne(id: number): Promise<BoletoEntity> {
    const boleto = await this.prisma.boletos.findUnique({ where: { id: id } });
    return boleto;
  }

  async update(
    id: number,
    updateBoletoDto: UpdateBoletoDto,
  ): Promise<BoletoEntity> {
    return await this.prisma.boletos.update({
      where: { id: id },
      data: updateBoletoDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.boletos.delete({ where: { id: id } });
  }
}
