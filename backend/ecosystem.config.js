module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
