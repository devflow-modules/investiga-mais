module.exports = {
  apps: [
    // BACKEND
    {
      name: 'investiga-mais-backend',
      cwd: './backend',
      script: 'node',
      args: 'src/index.js',
      instances: 1, // 1 instance (pode ser "max" para auto-scale com cluster se quiser)
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/www/investiga-mais/backend/logs/err.log',
      out_file: '/var/www/investiga-mais/backend/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
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
        PORT: 3001, // porta fixa para garantir sem conflitos
      },
      error_file: '/var/www/investiga-mais/frontend/logs/err.log',
      out_file: '/var/www/investiga-mais/frontend/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
