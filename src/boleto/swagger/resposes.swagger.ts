import { ApiProperty } from '@nestjs/swagger';
import { BoletoEntity } from '../entities/boleto.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class GeneratePdfsResponseSwagger {
  @ApiProperty({
    example: 'Arquivo PDF recebido e páginas salvas com sucesso!',
  })
  message: string;
}
export class SaveCsvResponseSwagger {
  @ApiProperty({
    example: 3,
  })
  count: number;
}
export class PdfsBadRequestResponseSwagger {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Validation failed (expected type is .pdf)',
  })
  message: string;
  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;
}
export class RelatorioBadRequestResponseSwagger {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;
  @ApiProperty({
    type: `array`,
    example: ['O campo relatório só aceita valor 1 ou nulo'],
  })
  message: string;
  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;
}

export class CsvsBadRequestResponseSwagger {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Validation failed (expected type is .csv)',
  })
  message: string;
  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;
}
export class BoletoSwagger implements BoletoEntity {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'JOSE DA SILVA',
  })
  nome_sacado: string;
  @ApiProperty({
    example: 3,
  })
  id_lote: number;
  @ApiProperty({
    example: '183.2',
  })
  valor: Decimal;
  @ApiProperty({
    example: '123456123456123456 ',
  })
  linha_digitavel: string;
  @ApiProperty({
    example: true,
  })
  ativo: boolean;
  @ApiProperty({
    example: '2023-07-14T23:35:15.000Z',
  })
  criado_em: Date;
}

export class FindAllResponseSwagger {
  @ApiProperty({ type: `array` })
  boletos: BoletoSwagger[];
}
export class FindAllRelarioResponseSwagger {
  @ApiProperty({
    example:
      'EgmriRRFSVDslsvcDSVLFRVRLERGLSDVdsvDSVLDSVELVSDVsdlvdsvlaxaLEWRWEGbl534blB5b%BL',
  })
  base64: BoletoSwagger[];
}
