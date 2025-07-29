module.exports = {
  apps: [
    {
      name: 'investiga-mais-backend',
      cwd: '/var/www/investiga-mais/backend',
      script: 'src/index.js',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/backend.err.log',
      out_file: 'logs/backend.out.log',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'investiga-mais-frontend',
      cwd: '/var/www/investiga-mais/frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/frontend.err.log',
      out_file: 'logs/frontend.out.log',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
