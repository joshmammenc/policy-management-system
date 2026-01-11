module.exports = {
  apps: [
    {
      name: 'policy-management-system',
      script: './src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
