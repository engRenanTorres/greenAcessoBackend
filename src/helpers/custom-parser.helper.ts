import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

export class BoletoRaw {
  nome_sacado: string;
  nome_lote: string;
  valor: Decimal;
  linha_digitavel: string;
  ativo: boolean;
}

export class CustomParsers {
  static csvToBoleto(csvString: string): BoletoRaw[] {
    const lines = csvString.split('\n');
    const headers = lines[0].split(';');

    const objects = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';');
      if (values.length === headers.length) {
        const obj: BoletoRaw = {
          nome_sacado: values[0] ?? '',
          nome_lote: values[1] ?? '',
          valor: new Prisma.Decimal(values[2] ?? 0),
          linha_digitavel: values[3] ?? '',
          ativo: true,
        };
        objects.push(obj);
      }
    }
    return objects;
  }
}
