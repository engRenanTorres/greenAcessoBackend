import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { BoletosRepository } from './repositories/boletos.repository';
import { BoletoEntity } from './entities/boleto.entity';
import { BoletoRaw, CustomParsers } from '../helpers/custom-parser.helper';
import { LotesService } from '../lotes/lotes.service';

@Injectable()
export class BoletoService {
  constructor(
    private readonly boletoRepository: BoletosRepository,
    private readonly lotesService: LotesService,
  ) {}
  async insertManyFromCsv(csvRaw: string) {
    const boletosRaw = CustomParsers.csvToBoleto(csvRaw);
    if (!boletosRaw)
      throw new NotFoundException(
        'Boletos não encontrados. Verique o padrão do csv',
      );
    const createBoletosDto: Promise<CreateBoletoDto[]> = Promise.all(
      boletosRaw.map(async (boleto: BoletoRaw) => {
        const idLotePortaria = await this.lotesService.findLoteIdByName(
          boleto.nome_lote,
        );
        const newBoleto: CreateBoletoDto = {
          nome_sacado: boleto.nome_sacado,
          id_lote: idLotePortaria,
          valor: boleto.valor,
          linha_digitavel: boleto.linha_digitavel,
          ativo: true,
        };
        return newBoleto;
      }),
    );
    return await this.boletoRepository.createMany(await createBoletosDto);
  }
  async create(createBoletoDto: CreateBoletoDto) {
    return await this.boletoRepository.create(createBoletoDto);
  }

  async findAll(): Promise<BoletoEntity[]> {
    return await this.boletoRepository.findAll();
  }

  async findOne(id: number): Promise<BoletoEntity> {
    const boleto = await this.boletoRepository.findOne(id);
    if (!boleto)
      throw new NotFoundException(`Boleto com id ${id} não encontrado.`);
    return boleto;
  }

  async update(
    id: number,
    updateBoletoDto: UpdateBoletoDto,
  ): Promise<BoletoEntity> {
    const boleto = await this.boletoRepository.findOne(id);
    if (!boleto)
      throw new NotFoundException(`Boleto com id ${id} não encontrado.`);
    return await this.boletoRepository.update(id, updateBoletoDto);
  }

  async remove(id: number) {
    const boleto = await this.boletoRepository.findOne(id);
    if (!boleto)
      throw new NotFoundException(`Boleto com id ${id} não encontrado.`);
    return `Boleto #${id} removido com sucesso`;
  }
}
