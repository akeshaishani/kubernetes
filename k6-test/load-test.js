import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 30 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 80 },
    { duration: '15s', target: 100 }
  ],

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const response = http.get('http://othm-alb-prod-1487296622.us-east-1.elb.amazonaws.com/');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'content type is HTML': (r) =>
      r.headers['Content-Type']?.includes('text/html'),
    'response contains HTML': (r) =>
      typeof r.body === 'string' && r.body.includes('<!DOCTYPE html>'),
    'response contains Next.js markup': (r) =>
      typeof r.body === 'string' && r.body.includes('_next/'),
  });

  sleep(1);
}