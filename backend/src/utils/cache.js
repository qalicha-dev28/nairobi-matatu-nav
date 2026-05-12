const redis = require('../config/redis');

const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS) || 3600;

class Cache {
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache get error:', err);
      return null;
    }
  }

  async set(key, value, ttl = CACHE_TTL) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Cache set error:', err);
      return false;
    }
  }

  async delete(key) {
    try {
      await redis.del(key);
      return true;
    } catch (err) {
      console.error('Cache delete error:', err);
      return false;
    }
  }

  generateSearchKey(origin, destination) {
    const normalizedOrigin = origin.toLowerCase().trim().replace(/\s+/g, '_');
    const normalizedDest = destination.toLowerCase().trim().replace(/\s+/g, '_');
    return `search:${normalizedOrigin}:${normalizedDest}`;
  }
}

module.exports = new Cache();
