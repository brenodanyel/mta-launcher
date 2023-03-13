import axios from 'axios';

export const apiAxiosInstance = axios.create({
  baseURL: 'https://mtasa-api.com',
});

export const axiosInstance = axios.create({
  baseURL: 'https://backend-mta-launcher.vercel.app/',
});
