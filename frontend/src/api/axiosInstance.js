import axios from 'axios';
import config from '../config'; 


const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL, 
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;