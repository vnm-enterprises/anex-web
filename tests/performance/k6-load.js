import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function runLoadTest() {
  const target = __ENV.PERF_TARGET || "http://localhost:3000/api/health";
  const res = http.get(target);
  check(res, {
    "status is 200/503": (r) => r.status === 200 || r.status === 503,
  });
  sleep(0.1);
}
