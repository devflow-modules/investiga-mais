@echo off
title 🔧 Setup Inicial - Investiga Mais

echo ============================================
echo     🛠️  SETUP DO BACKEND - INVESTIGA MAIS
echo ============================================

echo.
echo 📦 Instalando dependências do projeto...
npm install

echo.
echo 🔁 Gerando Prisma Client...
npx prisma generate

echo.
echo 🔃 Aplicando migrations existentes...
npx prisma migrate deploy

echo.
echo 🚀 Iniciando o servidor em modo desenvolvimento...
npm run dev

pause
