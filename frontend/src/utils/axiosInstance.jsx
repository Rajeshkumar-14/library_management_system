import axios from "axios";
import { jwtDecode } from "jwt-decode"; // corrected import statement
import dayjs from 'dayjs';
import { UpdateTokenAPI } from "../Services/Authentication/API-Request";

const baseURL = "http://localhost:8000/";

const axiosInstance = axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')).access : ''}`
    }
});

axiosInstance.interceptors.request.use(async (req) => {
    let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    if (!authTokens) {
        return req;
    }

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
    }

    try {
        const response = await UpdateTokenAPI();
        if (response.status === 200) {
            const data = response.data;
            localStorage.setItem('authTokens', JSON.stringify(data));
            req.headers.Authorization = `Bearer ${data.access}`;
            console.log('Token refreshed');
        } else {
            console.error('Token refresh request failed:', response);
            throw new Error('Token refresh request failed');
        }
    } catch (error) {
        console.error('Token refresh error', error);
        throw error;
    }

    return req;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;