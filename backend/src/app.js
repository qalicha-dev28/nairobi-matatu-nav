const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Register plugins
fastify.register(require('@fastify/cors'), {
  origin: true,
  credentials: true
});

// Register routes
fastify.register(require('./routes/search'), { prefix: '/api/v1/search' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

module.exports = fastify;