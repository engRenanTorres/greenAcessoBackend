import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { LotesRepository } from './repositories/lotes.repository';

@Injectable()
export class LotesService {
  constructor(private readonly lotesRepository: LotesRepository) {}
  async create(createLoteDto: CreateLoteDto) {
    return await this.lotesRepository.create(createLoteDto);
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
