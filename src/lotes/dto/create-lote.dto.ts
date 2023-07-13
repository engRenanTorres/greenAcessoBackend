import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateLoteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
  @IsBoolean()
  ativo: boolean;
}
