/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import axios from 'axios';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL has not been exported');
}
export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL: `${API_ENDPOINT}/api/v1`,
  timeout: 100000,
  headers: {
    'Content-type': 'application/json',
  },
});

api.interceptors.request.use(function (config: any) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  function (response) {
    // You can process the response data here before returning it
    return { status: response.status, ...response.data }; // Return the response data
  },
  function (error) {
    // Handle any error that occurred during the request
    return Promise.reject(error);
  },
);

export default api;
if (global.window) {
  (window as any).api = api;
}
