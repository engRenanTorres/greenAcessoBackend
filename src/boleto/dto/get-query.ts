import { IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export class GetBoletoQuery {
  @IsString()
  @IsOptional()
  nome?: string;
  @IsNumberString()
  @IsOptional()
  valor?: string;
  @IsNumberString()
  @IsOptional()
  id_lote?: number;
  @Matches(/1/, { message: 'O campo relatório só aceita valor 1 ou nulo' })
  @IsOptional()
  relatorio?: string;
}
