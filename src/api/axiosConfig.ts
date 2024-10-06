import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'https://6702a106bd7c8c1ccd3f67c2.mockapi.io/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
