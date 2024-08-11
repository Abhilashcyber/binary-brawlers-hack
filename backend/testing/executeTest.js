import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100, 
  duration: '10s', 
};

export default function () {
  const url = 'http://localhost:3000/execute';
  const payload = JSON.stringify({
    language: 'cpp',
    code: '#include <iostream>\nint main() { std::cout << "Hello, World!"; return 0; }',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
  sleep(1);
}
