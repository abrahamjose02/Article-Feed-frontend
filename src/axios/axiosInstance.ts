import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:'http://localhost:10000/api',
  withCredentials: true,  
});

export default axiosInstance;

