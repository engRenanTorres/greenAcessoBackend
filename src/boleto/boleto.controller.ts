import {
  Controller,
  Get,
  Post,
  Body,
  //Patch,
  Param,
  //Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { BoletoService } from './boleto.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
//import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetBoletoQuery } from './dto/get-query';
import { CustomParsers } from '../helpers/custom-parser.helper';

@Controller('api/boleto')
@ApiTags('Boletos')
export class BoletoController {
  constructor(private readonly boletoService: BoletoService) {}

  @Post()
  create(@Body() createBoletoDto: CreateBoletoDto) {
    return this.boletoService.create(createBoletoDto);
  }
  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  insertFromCSV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.boletoService.insertManyFromCsv(file.buffer.toString());
  }

  @Post('upload-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.boletoService.uploadBoletosPdf(file.buffer);
  }

  @Get()
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'valor', required: false })
  @ApiQuery({ name: 'id_lote', required: false })
  @ApiQuery({
    name: 'relatorio',
    description: 'Opcional. Mas se for usada só aceita o valor 1',
    required: false,
  })
  async findAll(@Query() query: GetBoletoQuery) {
    const boletos = await this.boletoService.findAll(query);
    if (+query.relatorio !== 1) return boletos;
    return CustomParsers.boletosEntityToBase64(boletos);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.boletoService.findOne(+id);
  }

  /*@Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoletoDto: UpdateBoletoDto,
  ) {
    return this.boletoService.update(+id, updateBoletoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.boletoService.remove(+id);
  } */
}
