import { BoletoService } from './boleto.service';
import { PrismaService } from '../prisma/prisma.service';
import { BoletosRepository } from './repositories/boletos.repository';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { BoletoEntity } from './entities/boleto.entity';
import { Prisma } from '@prisma/client';
import { LotesService } from '../lotes/lotes.service';
import { LotesRepository } from '../lotes/repositories/lotes.repository';
import { CustomParsers } from '../helpers/custom-parser.helper';
import { NotFoundException } from '@nestjs/common';

jest.mock('../helpers/custom-parser.helper');

describe('BoletoService', () => {
  let service: BoletoService;
  let prisma: PrismaService;
  let repository: BoletosRepository;
  let lotesRepository: LotesRepository;
  let lotesService: LotesService;
  let id: number;
  let expectOutputBoleto: BoletoEntity;
  let createBoletoDTO: CreateBoletoDto;

  beforeAll(() => {
    id = 1;
    expectOutputBoleto = {
      id: id,
      nome_sacado: 'Boleto Teste',
      id_lote: 1,
      valor: new Prisma.Decimal(12.0),
      linha_digitavel: '83878439',
      ativo: true,
      criado_em: new Date(),
    };

    createBoletoDTO = { ...expectOutputBoleto };
  });

  beforeEach(async () => {
    prisma = new PrismaService();
    repository = new BoletosRepository(prisma);
    lotesRepository = new LotesRepository(prisma);
    lotesService = new LotesService(lotesRepository);
    service = new BoletoService(repository, lotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertManyFromCsv method', () => {
    it('should throw NotFoundExeption when don`t find data in csv', async () => {
      CustomParsers.csvToBoleto = jest.fn().mockReturnValue(null);

      async function callCsv() {
        await service.insertManyFromCsv('strange csv file');
      }

      await expect(callCsv()).rejects.toThrow(NotFoundException);
      expect(CustomParsers.csvToBoleto).toHaveBeenCalled();
    });
    it('should return  a list of createBoletosDto', async () => {
      CustomParsers.csvToBoleto = jest.fn().mockReturnValue([createBoletoDTO]);
      jest
        .spyOn(service, 'boletoRawToBoletosPortaria')
        .mockImplementation(() => Promise.resolve([expectOutputBoleto]));
      jest
        .spyOn(repository, 'createMany')
        .mockImplementation(() => Promise.resolve({ count: 3 }));

      const boletos = await service.insertManyFromCsv('csv text');

      expect(boletos).toStrictEqual({ count: 3 });
      expect(CustomParsers.csvToBoleto).toHaveBeenCalled();
      expect(service.boletoRawToBoletosPortaria).toHaveBeenCalled();
    });
  });
});
