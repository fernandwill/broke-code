const { defineConfig } = require("@prisma/client");

module.exports = defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
