import { PrismaService } from '../prisma/prisma.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { LoteEntity } from './entities/lote.entity';
import { LotesController } from './lotes.controller';
import { LotesService } from './lotes.service';
import { LotesRepository } from './repositories/lotes.repository';

describe('LotesController', () => {
  let controller: LotesController;
  let prisma: PrismaService;
  let repository: LotesRepository;
  let service: LotesService;
  let id: number;
  let expectOutputLote: LoteEntity;
  let createLoteDTO: CreateLoteDto;

  beforeAll(() => {
    id = 1;
    expectOutputLote = {
      id: id,
      nome: 'Lote Teste',
      ativo: true,
      criado_em: new Date(),
    };

    createLoteDTO = { ...expectOutputLote };
  });

  beforeEach(async () => {
    prisma = new PrismaService();
    repository = new LotesRepository(prisma);
    service = new LotesService(repository);
    controller = new LotesController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    it('should return an array of lotes', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([expectOutputLote]));

      expect(await controller.findAll()).toStrictEqual([expectOutputLote]);
    });
  });

  describe('findOne', () => {
    it('should return a lote', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(expectOutputLote));

      expect(await controller.findOne(expectOutputLote.id.toString())).toBe(
        expectOutputLote,
      );
    });
  });

  describe('create', () => {
    it('should return a lote', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(expectOutputLote));

      expect(await controller.create(createLoteDTO)).toBe(expectOutputLote);
    });
  });
});
