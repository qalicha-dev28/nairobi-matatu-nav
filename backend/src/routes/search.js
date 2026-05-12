const searchService = require('../services/searchService');

async function searchRoutes(fastify, options) {
  fastify.post('/', async (request, reply) => {
    try {
      const { origin, destination, preferences } = request.body;
      
      // Validate input
      if (!origin || !destination) {
        reply.code(400);
        return { error: 'Origin and destination are required' };
      }
      
      const originValue = origin.type === 'gps' ? 'Current Location' : origin.value;
      const destinationValue = destination.value;
      
      const results = await searchService.search(originValue, destinationValue, preferences);
      
      return results;
      
    } catch (err) {
      fastify.log.error(err);
      reply.code(500);
      return { error: 'Internal server error' };
    }
  });
}

module.exports = searchRoutes;
