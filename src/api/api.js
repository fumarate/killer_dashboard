import { request } from "./request";

export default async function api(target, method = "GET", data = {}) {
  let resp_data = await request(target, method, data).then((resp) => {
    return resp.data
  });
  return resp_data;
}