import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { BoletoEntity } from '../boleto/entities/boleto.entity';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
  static async boletosEntityToBase64(boletos: BoletoEntity[]) {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const tableRows = boletos.map(boleto => [
      boleto.id.toString(),
      boleto.nome_sacado,
      boleto.id_lote.toString(),
      boleto.valor.toString(),
      boleto.linha_digitavel,
      boleto.ativo.toString(),
      boleto.criado_em.toString(),
    ]);

    const table = [
      [
        'ID',
        'Nome Sacado',
        'ID Lote',
        'Valor',
        'Linha Digitável',
        'Ativo',
        'Criado em',
      ],
      ...tableRows,
    ];
    const tableWidths = [70, 100, 70, 70, 140, 50, 100];

    const page = pdfDoc.addPage();
    const { height } = page.getSize();

    const tableTopMargin = 50;
    const tableLeftMargin = 50;
    const cellPadding = 10;

    let y = height - tableTopMargin;

    for (const row of table) {
      let x = tableLeftMargin;

      for (let i = 0; i < row.length; i++) {
        const cellValue = row[i];

        const cellWidth = tableWidths[i];
        const cellHeight = 20;

        page.drawText(cellValue, {
          x: x + cellPadding,
          y: y - cellPadding,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          maxWidth: cellWidth - cellPadding * 2,
          lineHeight: 14,
          opacity: 1,
        });

        page.drawRectangle({
          x,
          y: y - cellHeight,
          width: cellWidth,
          height: cellHeight,
          color: rgb(0, 0, 0),
          borderWidth: 0.5,
        });

        x += cellWidth;
      }

      y -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    return { base64: pdfBase64 };
  }
}
