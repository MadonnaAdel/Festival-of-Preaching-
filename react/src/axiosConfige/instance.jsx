import axios from "axios";

const token = localStorage.getItem('tOkeen#1b3Jx&2024');
const headers = token ? { 
    'Authorization': `Bearer ${token}`, 
    'Content-Type': 'application/json' 
} : { 
    'Content-Type': 'application/json' 
};

const axiosInstance = axios.create({
    // baseURL: "http://localhost:5001",
    baseURL: "https://festival-of-preaching-2024.vercel.app",
    headers: headers
});

export default axiosInstance;
