import { API_HOSTNAME, API_PORT } from "../config.ts";

const createRequest = (route: string, body: BodyInit) => {
  return new Request(`http://${API_HOSTNAME}:${API_PORT}${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
};

export default createRequest;