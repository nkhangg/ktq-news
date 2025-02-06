import Routes from '@/ultils/routes';
import ax from 'axios';
import { redirect } from 'next/navigation';

const axios = ax.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            redirect(Routes.LOGIN);
        }
        return Promise.reject(error);
    },
);

export default axios;
