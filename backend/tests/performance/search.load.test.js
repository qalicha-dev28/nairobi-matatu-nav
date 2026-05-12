import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '2m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2 seconds
    http_req_failed: ['rate<0.01'],    // Less than 1% errors
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    origin: {
      type: 'zone',
      value: 'CBD'
    },
    destination: {
      type: 'landmark',
      value: 'Westlands'
    }
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(`${BASE_URL}/api/v1/search`, payload, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'has results': (r) => {
      const body = JSON.parse(r.body);
      return body.results && body.results.length > 0;
    },
    'has matatus': (r) => {
      const body = JSON.parse(r.body);
      return body.results[0].matatus.length > 0;
    },
    'cache works': (r) => {
      const body = JSON.parse(r.body);
      return body.meta.cache_hit !== undefined;
    },
  });

  sleep(1);
}
