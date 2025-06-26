/*
  Warnings:

  - You are about to alter the column `status` on the `Mensagem` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mensagem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conversaId" INTEGER NOT NULL,
    "direcao" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" JSONB,
    "atendenteId" INTEGER,
    CONSTRAINT "Mensagem_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "Conversa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mensagem_atendenteId_fkey" FOREIGN KEY ("atendenteId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Mensagem" ("atendenteId", "conteudo", "conversaId", "direcao", "id", "status", "timestamp") SELECT "atendenteId", "conteudo", "conversaId", "direcao", "id", "status", "timestamp" FROM "Mensagem";
DROP TABLE "Mensagem";
ALTER TABLE "new_Mensagem" RENAME TO "Mensagem";
CREATE INDEX "Mensagem_conversaId_idx" ON "Mensagem"("conversaId");
CREATE INDEX "Mensagem_direcao_idx" ON "Mensagem"("direcao");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
