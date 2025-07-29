#!/bin/bash

echo "🚀 Iniciando deploy do frontend Investiga+..."

# Caminho do projeto
cd /var/www/investiga-mais/frontend || {
  echo "❌ Diretório /frontend não encontrado."
  exit 1
}

# Atualiza o repositório
echo "📦 Fazendo pull do repositório..."
git pull origin main || {
  echo "❌ Falha ao executar git pull"
  exit 1
}

# Instala dependências
echo "📦 Instalando dependências..."
npm install || {
  echo "❌ Falha ao executar npm install"
  exit 1
}

# Gera build do frontend
echo "🛠️ Gerando build de produção..."
npm run build || {
  echo "❌ Falha ao executar npm run build"
  exit 1
}

# Reinicia o processo via PM2
echo "🔁 Reiniciando processo PM2..."
pm2 restart ecosystem.config.js --only investiga-mais-frontend || {
  echo "❌ Falha ao reiniciar PM2"
  exit 1
}

echo "✅ Deploy do frontend concluído com sucesso!"
