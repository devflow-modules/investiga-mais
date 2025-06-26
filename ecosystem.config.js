module.exports = {
  apps: [
    // BACKEND
    {
      name: 'investiga-mais-backend',
      cwd: './backend',
      script: 'node',
      args: 'src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      error_file: '/var/www/investiga-mais/backend/logs/err.log',
      out_file: '/var/www/investiga-mais/backend/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'development',
        WHATSAPP_MODO_DEV: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
        WHATSAPP_TOKEN: 'SEU_TOKEN_AQUI',
        WHATSAPP_PHONE_NUMBER_ID: 'SEU_PHONE_NUMBER_ID_AQUI',
        JWT_SECRET: '***REMOVED-HISTORICAL-SECRET***',
        DATABASE_URL: 'file:./dev.db',
        RESEND_API_KEY: '***REMOVED-HISTORICAL-SECRET***',
        RESEND_FROM: 'Investiga+ <onboarding@resend.dev>',
        IPQS_API_KEY: '***REMOVED-HISTORICAL-SECRET***',
        ABSTRACT_API_KEY: '***REMOVED-HISTORICAL-SECRET***',
        SAFE_BROWSING_API_KEY: '***REMOVED-HISTORICAL-SECRET***',
      },
    },

    // FRONTEND
    {
      name: 'investiga-mais-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/var/www/investiga-mais/frontend/logs/err.log',
      out_file: '/var/www/investiga-mais/frontend/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
}
