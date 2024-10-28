
import axiosInstance from "../axios/axiosInstance";

export const refreshAccesToken  = async():Promise<boolean> =>{
    try {
        await axiosInstance.post('/auth/refresh-token',{})
        return true
    } catch (error) {
        console.log("Failed to refresh access token:", error);
        return false
    }
}