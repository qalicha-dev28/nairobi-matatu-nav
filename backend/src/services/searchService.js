const pool = require('../config/database');
const cache = require('../utils/cache');

class SearchService {
  async search(origin, destination, preferences = {}) {
    const startTime = Date.now();
    
    // Generate cache key
    const cacheKey = cache.generateSearchKey(origin, destination);
    
    // Check cache first
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return {
        ...cachedResult,
        meta: {
          ...cachedResult.meta,
          cache_hit: true,
          response_time_ms: Date.now() - startTime,
        }
      };
    }
    
    // Query database
    const results = await this.queryDatabase(origin, destination, preferences);
    
    const response = {
      search_id: this.generateUUID(),
      results,
      meta: {
        total_results: results.length,
        cache_hit: false,
        response_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
    
    // Cache the result
    await cache.set(cacheKey, response);
    
    return response;
  }

  async queryDatabase(origin, destination, preferences) {
    const client = await pool.connect();
    
    try {
      // Find routes matching origin and destination zones
      const routeQuery = `
        SELECT 
          r.id as route_id,
          r.route_number,
          r.origin_zone,
          r.destination_zone,
          r.direction
        FROM routes r
        WHERE 
          (r.origin_zone ILIKE $1 AND r.destination_zone ILIKE $2)
          OR (r.origin_zone ILIKE $2 AND r.destination_zone ILIKE $1 AND r.direction = 'bidirectional')
        AND r.status = 'active'
        ORDER BY r.popularity_score DESC
      `;
      
      const routeResult = await client.query(routeQuery, [origin, destination]);
      
      if (routeResult.rows.length === 0) {
        return [];
      }
      
      // Get full details for each route
      const detailedResults = await Promise.all(
        routeResult.rows.map(route => this.getRouteDetails(client, route, preferences))
      );
      
      return detailedResults.filter(r => r !== null);
      
    } finally {
      client.release();
    }
  }

  async getRouteDetails(client, route, preferences) {
    try {
      // Get stages for this route
      const stagesQuery = `
        SELECT 
          s.id,
          s.name,
          s.zone,
          ST_X(s.location::geometry) as longitude,
          ST_Y(s.location::geometry) as latitude,
          rs.sequence_order,
          rs.is_origin,
          rs.is_destination
        FROM stages s
        JOIN route_stages rs ON s.id = rs.stage_id
        WHERE rs.route_id = $1
        ORDER BY rs.sequence_order
      `;
      
      const stagesResult = await client.query(stagesQuery, [route.route_id]);
      
      const originStages = stagesResult.rows.filter(s => s.is_origin);
      const destinationStages = stagesResult.rows.filter(s => s.is_destination);
      
      // Get matatus for this route
      const matatusQuery = `
        SELECT 
          m.id,
          m.matatu_number,
          m.capacity,
          m.vehicle_type,
          s.id as sacco_id,
          s.name as sacco_name,
          s.reliability_score
        FROM matatus m
        JOIN saccos s ON m.sacco_id = s.id
        WHERE m.route_id = $1 AND m.status = 'active'
      `;
      
      const matatusResult = await client.query(matatusQuery, [route.route_id]);
      
      // Get fares for this route
      const faresQuery = `
        SELECT 
          f.origin_stage_id,
          f.destination_stage_id,
          f.base_fare,
          f.peak_fare,
          f.currency
        FROM fares f
        WHERE f.route_id = $1
      `;
      
      const faresResult = await client.query(faresQuery, [route.route_id]);
      
      // Build response
      return {
        rank: 1,
        route: {
          id: route.route_id,
          number: route.route_number,
          name: `${route.origin_zone} to ${route.destination_zone}`
        },
        boarding: {
          stage: originStages[0] ? {
            id: originStages[0].id,
            name: originStages[0].name,
            location: {
              lat: parseFloat(originStages[0].latitude),
              lng: parseFloat(originStages[0].longitude)
            }
          } : null
        },
        alighting: {
          stage: destinationStages[0] ? {
            id: destinationStages[0].id,
            name: destinationStages[0].name,
            location: {
              lat: parseFloat(destinationStages[0].latitude),
              lng: parseFloat(destinationStages[0].longitude)
            }
          } : null
        },
        matatus: matatusResult.rows.map(m => ({
          id: m.id,
          matatu_number: m.matatu_number,
          sacco: {
            id: m.sacco_id,
            name: m.sacco_name,
            reliability_score: parseFloat(m.reliability_score)
          },
          vehicle_type: m.vehicle_type,
          capacity: m.capacity
        })),
        fare: faresResult.rows.length > 0 ? {
          min: Math.min(...faresResult.rows.map(f => parseFloat(f.base_fare))),
          max: Math.max(...faresResult.rows.map(f => parseFloat(f.peak_fare || f.base_fare))),
          currency: faresResult.rows[0].currency,
          peak_adjustment: 0,
          confidence: 'high'
        } : null,
        estimated_duration_minutes: {
          min: 25,
          max: 45
        },
        match_quality: 0.95
      };
      
    } catch (err) {
      console.error('Error getting route details:', err);
      return null;
    }
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

module.exports = new SearchService();
