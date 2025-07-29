#!/bin/bash

echo "🚀 Iniciando deploy do backend Investiga+"

cd /var/www/investiga-mais/backend || {
  echo "❌ Diretório do backend não encontrado"
  exit 1
}

echo "📥 Puxando últimas alterações do Git..."
git pull origin main

echo "📦 Instalando dependências..."
npm install

echo "🔄 Aplicando migrações (caso existam)..."
npx prisma migrate deploy

echo "🔁 Reiniciando PM2 (backend)..."
pm2 restart ecosystem.config.js --only investiga-mais-backend

echo "✅ Deploy do backend concluído com sucesso!"
