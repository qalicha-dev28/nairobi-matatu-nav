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

// Test database connection on startup
const pool = require('./config/database');
fastify.addHook('onReady', async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    fastify.log.info(`Database connected: ${result.rows[0].now}`);
    client.release();
  } catch (err) {
    fastify.log.error('Database connection failed:', err);
  }
});

module.exports = fastify;
