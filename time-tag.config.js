module.exports = {
  apps: [
    {
      env_dev: {
        NODE_ENV: 'dev'
      },
      env_prod: {
        NODE_ENV: 'prod'
      },
      name: 'Time Tag Bot',
      script: './index.js',
      watch: true
    },
    {
      autorestart: false,
      name: 'TTG Deploy',
      script: './deploy-check.js',
      watch: false
    }
  ]
};
