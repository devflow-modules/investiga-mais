-- CreateTable
CREATE TABLE "ConsultaRisco" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "parametro" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "resultado" JSONB NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConsultaRisco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ConsultaRisco_usuarioId_idx" ON "ConsultaRisco"("usuarioId");

-- CreateIndex
CREATE INDEX "ConsultaRisco_tipo_idx" ON "ConsultaRisco"("tipo");

-- CreateIndex
CREATE INDEX "ConsultaRisco_status_idx" ON "ConsultaRisco"("status");
