import { Boletos } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class BoletoEntity implements Boletos {
  id: number;
  nome_sacado: string;
  id_lote: number;
  valor: Decimal;
  linha_digitavel: string;
  ativo: boolean;
  criado_em: Date;
}
