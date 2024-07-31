import { check, sleep } from 'k6';
import http from 'k6/http';

// Test configuration
export const options = {
  thresholds: {
    // Assert that 99% of requests finish within 20ms.
    http_req_duration: ['p(99) < 100'],
  },
  // Ramp the number of virtual users up and down
  stages: [
    { duration: '30s', target: 15 },
    { duration: '1m', target: 15 },
    { duration: '20s', target: 0 },
  ],
};

const rawEnv = open('../.env.test');

const env = rawEnv
  .trim()
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    acc[key] = value.replace(/"/g, '');
    return acc;
  }, {});

export function setup() {
  return http
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_API_KEY}`,
      {
        email: env.FIREBASE_DEMO_USER_EMAIL,
        password: env.FIREBASE_DEMO_USER_PASSWORD,
        returnSecureToken: 'true',
      },
    )
    .json()['idToken'];
}

export default function (data) {
  const res = http.get('http://localhost:3000/users/me/profile', {
    headers: {
      Authorization: `Bearer ${data}`,
    },
  });
  // Validate response status
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
