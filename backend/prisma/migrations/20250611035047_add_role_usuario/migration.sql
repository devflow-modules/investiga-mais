-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT,
    "telefone" TEXT,
    "nascimento" DATETIME,
    "cidade" TEXT,
    "uf" TEXT,
    "genero" TEXT,
    "bonusConcedidoAt" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'cliente',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Usuario" ("bonusConcedidoAt", "cidade", "cpf", "criadoEm", "email", "genero", "id", "nascimento", "nome", "senha", "telefone", "uf") SELECT "bonusConcedidoAt", "cidade", "cpf", "criadoEm", "email", "genero", "id", "nascimento", "nome", "senha", "telefone", "uf" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
