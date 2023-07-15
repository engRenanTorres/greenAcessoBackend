import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { BoletoService } from './boleto.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PDFDocument } from 'pdf-lib';
import { createWriteStream } from 'fs';

@Controller('boleto')
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
    //return this.boletoService.insertManyFromCsv(boletosCsv);
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
    const pdfDoc = await PDFDocument.load(file.buffer);

    const totalPages = pdfDoc.getPageCount();
    for (let i = 0; i < totalPages; i++) {
      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);

      const boletos = await this.boletoService.findAll();
      const outputFilePath = `uploads/boletos/${boletos[i].id}.pdf`;
      const pdfBytes = await newPdfDoc.save();

      const ws = createWriteStream(outputFilePath);
      ws.write(pdfBytes);

      //fs.writeFileSync(outputFilePath, pdfBytes);
    }

    return { message: 'Arquivo PDF recebido e páginas salvas com sucesso!' };
  }

  @Get()
  findAll() {
    return this.boletoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoletoDto: UpdateBoletoDto) {
    return this.boletoService.update(+id, updateBoletoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletoService.remove(+id);
  }
}
