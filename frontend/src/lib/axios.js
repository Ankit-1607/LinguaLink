import axios from 'axios';

const BASE_URL = import.meta.env.MODE === 'developement' ? "http://localhost:5001/api/v1" : "/api/v1"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with request
});

export default axiosInstance;