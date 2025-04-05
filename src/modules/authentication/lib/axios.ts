import ax from 'axios';

const axios = ax.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    withCredentials: true,
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            window.location.href = process.env.NEXT_PUBLIC_REDIRECT_UNAUTH_URL || '/login';
        }
        return Promise.reject(error);
    },
);

export default axios;
