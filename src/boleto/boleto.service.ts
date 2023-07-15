import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { BoletosRepository } from './repositories/boletos.repository';
import { BoletoEntity } from './entities/boleto.entity';
import { BoletoRaw, CustomParsers } from '../helpers/custom-parser.helper';
import { LotesService } from '../lotes/lotes.service';
import { PDFDocument } from 'pdf-lib';
import { createWriteStream } from 'fs';
import { GetBoletoQuery } from './dto/get-query';
import { ordemDosBoletos } from '../../downloads/sindico/boletos-ordem-pdf';

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

  async uploadBoletosPdf(pdf: Buffer) {
    try {
      const pdfDoc = await PDFDocument.load(pdf);
      if (!pdfDoc) {
        throw new NotFoundException('Conteúdo do pdf não foi encontrado');
      }

      const totalPages = pdfDoc.getPageCount();
      for (let i = 0; i < totalPages; i++) {
        const newPdfDoc = await PDFDocument.create();
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);

        const boletos = await this.boletoRepository.findAll();
        const boletoNaOrdemDoSindico = boletos[ordemDosBoletos[i]];
        const outputFilePath = `uploads/boletos/${boletoNaOrdemDoSindico.id}.pdf`;
        const pdfBytes = await newPdfDoc.save();

        const ws = createWriteStream(outputFilePath);
        ws.write(pdfBytes);
      }
    } catch (err) {
      throw new ConflictException('Erro ao abrir o pdf');
    }

    return { message: 'Arquivo PDF recebido e páginas salvas com sucesso!' };
  }

  async create(createBoletoDto: CreateBoletoDto) {
    return await this.boletoRepository.create(createBoletoDto);
  }

  async findAll(queries?: GetBoletoQuery): Promise<BoletoEntity[]> {
    const { nome, valor, id_lote } = queries;
    if (!nome && !valor && !id_lote)
      return await this.boletoRepository.findAll();
    return await this.boletoRepository.findAllWithFilters(queries);
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
