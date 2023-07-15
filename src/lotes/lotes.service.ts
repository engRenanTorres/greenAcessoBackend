import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { LotesRepository } from './repositories/lotes.repository';
import { listaLotes } from '../data/initial-lotes';

@Injectable()
export class LotesService implements OnModuleInit {
  private looger: Logger = new Logger('LotesService');
  constructor(private readonly lotesRepository: LotesRepository) {}
  async onModuleInit() {
    const lotes = await this.lotesRepository.findAll();
    if (lotes.length === 0) {
      this.looger.verbose('Criando três lotes default');
      try {
        this.lotesRepository.createManyFullEntity(listaLotes);
      } catch {
        this.looger.error('Não foi possível criar lotes default');
      }
    }
  }
  async create(createLoteDto: CreateLoteDto) {
    return await this.lotesRepository.create(createLoteDto);
  }

  async findLoteIdByName(name: string): Promise<number> {
    const log = await this.lotesRepository.findOneByNameNumberString(name);
    return log[0].id;
  }

  async findAll() {
    return await this.lotesRepository.findAll();
  }

  async findOne(id: number) {
    const lote = await this.lotesRepository.findOne(id);
    if (!lote) throw new NotFoundException('Lote not found!');
    return lote;
  }

  async update(id: number, updateLoteDto: UpdateLoteDto) {
    const lote = await this.lotesRepository.findOne(id);
    if (!lote) throw new NotFoundException('Lote not found!');
    return this.lotesRepository.update(id, updateLoteDto);
  }

  async remove(id: number) {
    return await this.lotesRepository.remove(id);
  }
}
