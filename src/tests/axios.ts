import axios from "axios";

const baseURL = "http://localhost:3000/api";

export const baseHttp = axios.create({
  baseURL,
  withCredentials: false,
});

export const withAuthHttp = (token: string) =>
  axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      common: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
