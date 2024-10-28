import axios from 'axios';
import { refreshAccesToken } from '../utils/authUtils';

const axiosInstance = axios.create({
  baseURL:'http://localhost:10000/api',
  withCredentials: true,  
});


axiosInstance.interceptors.response.use(
  (response)=> response,
  async(error)=>{
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshSuccess = await refreshAccesToken();
      if (refreshSuccess) {
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;

