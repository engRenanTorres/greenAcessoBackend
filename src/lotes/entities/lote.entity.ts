import { Lotes } from '@prisma/client';

export class LoteEntity implements Lotes {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: Date;
}
