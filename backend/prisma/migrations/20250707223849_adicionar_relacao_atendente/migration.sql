-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conversa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "nome" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "ultimaMensagemEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaMensagemCliente" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "atendenteId" INTEGER,
    "foiPago" BOOLEAN NOT NULL DEFAULT false,
    "tagQuente" BOOLEAN NOT NULL DEFAULT false,
    "naoLido" BOOLEAN NOT NULL DEFAULT false,
    "atendidaPorAutomacao" BOOLEAN NOT NULL DEFAULT true,
    "ultimaMensagemFoiDoCliente" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Conversa_atendenteId_fkey" FOREIGN KEY ("atendenteId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Conversa" ("atualizadoEm", "criadoEm", "id", "nome", "numero", "ultimaMensagemEm") SELECT "atualizadoEm", "criadoEm", "id", "nome", "numero", "ultimaMensagemEm" FROM "Conversa";
DROP TABLE "Conversa";
ALTER TABLE "new_Conversa" RENAME TO "Conversa";
CREATE UNIQUE INDEX "Conversa_numero_key" ON "Conversa"("numero");
CREATE INDEX "Conversa_numero_idx" ON "Conversa"("numero");
CREATE INDEX "Conversa_status_idx" ON "Conversa"("status");
CREATE INDEX "Conversa_atendenteId_idx" ON "Conversa"("atendenteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
