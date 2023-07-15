import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { NotFoundException } from '@nestjs/common';
import { LoteEntity } from './entities/lote.entity';
import { LotesRepository } from './repositories/lotes.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('LotesService', () => {
  let prisma: PrismaService;
  let repository: LotesRepository;
  let service: LotesService;
  let id: number;
  let expectOutputLote: LoteEntity;
  let createLoteDTO: CreateLoteDto;

  beforeAll(() => {
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Create method', () => {
    it('should create a lote', async () => {
      jest
        .spyOn(repository, 'create')
        .mockImplementation(() => Promise.resolve(expectOutputLote));
      const newLote = await service.create(createLoteDTO);

      expect(newLote).toMatchObject(expectOutputLote);
      expect(newLote.nome).toStrictEqual(expectOutputLote.nome);
    });
  });

  describe('Finding lotes', () => {
    it('should list all lotes', async () => {
      const mockLoteRepository = {
        findAll: jest.fn().mockReturnValue(Promise.resolve([expectOutputLote])),
      };
      //@ts-expect-error defined part of methods
      service['lotesRepository'] = mockLoteRepository;
      const lotes = await service.findAll();
      expect(mockLoteRepository.findAll).toHaveBeenCalled();
      expect([expectOutputLote]).toStrictEqual(lotes);
    });
    it('should get one lote id when fetching by name', async () => {
      expectOutputLote = {
        id: 1,
        nome: 'Lote Teste',
        ativo: true,
        criado_em: new Date(),
      };
      const mockLoteRepository = {
        findOneByNameNumberString: jest
          .fn()
          .mockReturnValue(Promise.resolve([expectOutputLote])),
      };
      //@ts-expect-error defined part of methods
      service['lotesRepository'] = mockLoteRepository;
      const loteId = await service.findLoteIdByName(expectOutputLote.nome);
      expect(mockLoteRepository.findOneByNameNumberString).toHaveBeenCalled();
      expect(1).toStrictEqual(loteId);
    });
    it('should get one lote when fetching by id', async () => {
      const mockLoteRepository = {
        findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputLote)),
      };
      //@ts-expect-error defined part of methods
      service['lotesRepository'] = mockLoteRepository;
      const lote = await service.findOne(id);
      expect(mockLoteRepository.findOne).toHaveBeenCalled();
      expect(expectOutputLote).toStrictEqual(lote);
    });
    it('should throw a notFoundExeption when trying to find a id by name that not exists', async () => {
      const mockLoteRepository = {
        findOneByNameNumberString: jest
          .fn()
          .mockReturnValue(Promise.resolve(null)),
      };
      //@ts-expect-error defined part of methods
      service['lotesRepository'] = mockLoteRepository;

      async function findbyId() {
        await service.findLoteIdByName('strange name');
      }

      await expect(findbyId()).rejects.toThrow(NotFoundException);
      expect(mockLoteRepository.findOneByNameNumberString).toHaveBeenCalled();
    });
    it('should throw a notFoundExeption when trying to find a lote by id that not exists', async () => {
      const id = 1;

      const mockLoteRepository = {
        findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
      };
      //@ts-expect-error defined part of methods
      service['lotesRepository'] = mockLoteRepository;

      async function findbyId() {
        await service.findOne(id);
      }

      await expect(findbyId()).rejects.toThrow(NotFoundException);
      expect(mockLoteRepository.findOne).toHaveBeenCalled();
    });
  });
});
