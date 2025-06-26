/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `Conversa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversa_numero_key" ON "Conversa"("numero");
