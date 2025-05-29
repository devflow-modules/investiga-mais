-- CreateTable
CREATE TABLE "Consulta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Consulta_cpf_key" ON "Consulta"("cpf");
