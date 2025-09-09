module.exports = {
    apps: [
      {
        name: "100days",
        script: "./webserver/server.js",
        env: {
          PORT: 3002,
          NODE_ENV: "development"
        },
        env_production: {
          PORT: 3002,
          NODE_ENV: "production"
        }
      }
    ]
  };