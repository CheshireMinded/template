import http from "k6/http";
import { sleep, check } from "k6";

const BASE_URL = __ENV.FRONTEND_BASE_URL || "http://localhost:5173";

export const options = {
  vus: 5,
  duration: "30s"
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    "status is 200": (r) => r.status === 200
  });
  sleep(1);
}

