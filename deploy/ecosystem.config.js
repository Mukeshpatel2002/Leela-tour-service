// PM2 reads this file with require(), so it stays CommonJS on purpose:
// there is no package.json at the repo root, and backend/package.json sets
// "type": "module", which would break a .js config loaded from here.
const path = require("path");

const root = path.resolve(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "leela-api",
      cwd: path.join(root, "backend"),
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      // 2 GB VPS: cap the API so a runaway request spike cannot take nginx down.
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
      time: true,
      autorestart: true,
      restart_delay: 3000,
    },
  ],
};
