import { BoletoController } from './boleto.controller';
import { BoletoService } from './boleto.service';
import { CreateBoletoDto } from '../boleto/dto/create-boleto.dto';
import { BoletoEntity } from '../boleto/entities/boleto.entity';
import { BoletosRepository } from '../boleto/repositories/boletos.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { LotesService } from '../lotes/lotes.service';
import { LotesRepository } from '../lotes/repositories/lotes.repository';
import { GetBoletoQuery } from './dto/get-query';
import { CustomParsers } from '../helpers/custom-parser.helper';

jest.mock('../helpers/custom-parser.helper');

describe('BoletoController', () => {
  let controller: BoletoController;
  let prisma: PrismaService;
  let repository: BoletosRepository;
  let lotesRepository: LotesRepository;
  let service: BoletoService;
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
    controller = new BoletoController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of lotes when queries are empty', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([expectOutputBoleto]));

      CustomParsers.boletosEntityToBase64 = jest
        .fn()
        .mockReturnValue({ base64: 'iFe#cSW@' });
      const queries: GetBoletoQuery = {};

      expect(await controller.findAll(queries)).toStrictEqual([
        expectOutputBoleto,
      ]);
      expect(CustomParsers.boletosEntityToBase64).not.toHaveBeenCalled();
    });

    it('should return an relatorio in a object with base64', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([expectOutputBoleto]));
      CustomParsers.boletosEntityToBase64 = jest
        .fn()
        .mockReturnValue({ base64: 'iFe#cSW@' });
      const queries: GetBoletoQuery = { relatorio: '1' };

      expect(await controller.findAll(queries)).toStrictEqual({
        base64: 'iFe#cSW@',
      });
      expect(CustomParsers.boletosEntityToBase64).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an array of lotes when queries are empty', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(expectOutputBoleto));

      expect(await controller.findOne('1')).toStrictEqual(expectOutputBoleto);
    });
  });

  describe('uploadPDF', () => {
    it('should call uploadBoletosPdf service  when uploadPDF has been called', async () => {
      jest
        .spyOn(service, 'uploadBoletosPdf')
        .mockImplementation(() => Promise.resolve({ message: 'salvo' }));
      const file = Buffer.from(
        '...',
        'binary',
      ) as unknown as Express.Multer.File;

      expect(await controller.uploadPDF(file)).toStrictEqual({
        message: 'salvo',
      });
      expect(service.uploadBoletosPdf).toHaveBeenCalled();
    });
  });

  describe('insertFromCSV', () => {
    it('should call insertManyFromCsv service  when insertFromCSV has been called', async () => {
      jest
        .spyOn(service, 'insertManyFromCsv')
        .mockImplementation(() => Promise.resolve({ count: 3 }));
      const file = Buffer.from(
        '...',
        'binary',
      ) as unknown as Express.Multer.File;

      expect(await controller.insertFromCSV(file)).toStrictEqual({ count: 3 });
      expect(service.insertManyFromCsv).toHaveBeenCalled();
    });
  });
  describe('create', () => {
    it('should call create service  when create controller has been called', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(expectOutputBoleto));

      expect(await controller.create(createBoletoDTO)).toStrictEqual(
        expectOutputBoleto,
      );
    });
  });
});
