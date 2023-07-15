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
  HttpStatus,
} from '@nestjs/common';
import { BoletoService } from './boleto.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
//import { UpdateBoletoDto } from './dto/update-boleto.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetBoletoQuery } from './dto/get-query';
import { CustomParsers } from '../helpers/custom-parser.helper';
import {
  CsvsBadRequestResponseSwagger,
  FindAllRelarioResponseSwagger,
  GeneratePdfsResponseSwagger,
  PdfsBadRequestResponseSwagger,
  RelatorioBadRequestResponseSwagger,
  SaveCsvResponseSwagger,
} from './swagger/resposes.swagger';

@Controller('api/boleto')
@ApiTags('Boletos')
export class BoletoController {
  constructor(private readonly boletoService: BoletoService) {}

  @Post('csv')
  @ApiOperation({
    description:
      'Faz o upload do arquivo csv do Financeiro e salva no bd lincando com o id da Portaria',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Csv salvo com sucesso no banco de dados.',
    type: SaveCsvResponseSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro no formato, ou padrão do arquivo.',
    type: CsvsBadRequestResponseSwagger,
  })
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
  @ApiOperation({
    description:
      'Faz o upload do arquivo de boletos na ordem do síndico e salva na pasta uploads/boletos',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pdf salvo e arquivos das páginas geradas com sucesso.',
    type: GeneratePdfsResponseSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro no formato, ou padrão do arquivo.',
    type: PdfsBadRequestResponseSwagger,
  })
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
  @ApiOperation({
    description:
      'Retorna os boletos desejados com base nas buscas, ou retorna um pdf(bse64) se for inserido a query relatorio=1',
  })
  @ApiQuery({
    name: 'nome',
    description: 'Opcional, para buscar pelo lote. Só aceita string',
    required: false,
  })
  @ApiQuery({
    name: 'valor',
    description: 'Opcional, para buscar pelo lote. Só aceita número',
    required: false,
  })
  @ApiQuery({
    name: 'id_lote',
    description: 'Opcional, para buscar pelo lote. Só aceita números',
    required: false,
  })
  @ApiQuery({
    name: 'relatorio',
    description: 'Opcional. Mas se for usada só aceita o valor 1',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista ou Relatório retornado com sucesso.',
    type: FindAllRelarioResponseSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro no formato, ou padrão dos parâmetros.',
    type: RelatorioBadRequestResponseSwagger,
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

  @Post()
  create(@Body() createBoletoDto: CreateBoletoDto) {
    return this.boletoService.create(createBoletoDto);
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
