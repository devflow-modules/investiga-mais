/*
  Warnings:

  - You are about to drop the column `tipo` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `usuario` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `cnpj` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "TokenRecuperacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiracao" DATETIME NOT NULL,
    CONSTRAINT "TokenRecuperacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogRecuperacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LogRecuperacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consulta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Consulta" ("cpf", "criadoEm", "id", "nome", "status") SELECT "cpf", "criadoEm", "id", "nome", "status" FROM "Consulta";
DROP TABLE "Consulta";
ALTER TABLE "new_Consulta" RENAME TO "Consulta";
CREATE INDEX "Consulta_cpf_idx" ON "Consulta"("cpf");
CREATE INDEX "Consulta_cnpj_idx" ON "Consulta"("cnpj");
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Usuario" ("criadoEm", "id", "senha") SELECT "criadoEm", "id", "senha" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TokenRecuperacao_token_key" ON "TokenRecuperacao"("token");
