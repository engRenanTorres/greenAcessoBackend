import { Decimal } from '@prisma/client/runtime/library';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateBoletoDto {
  @IsString()
  @IsNotEmpty()
  nome_sacado: string;
  @IsNumber()
  id_lote: number;
  @IsDecimal()
  valor: Decimal;
  @IsString()
  linha_digitavel: string;
  @IsBoolean()
  ativo: boolean;
}
