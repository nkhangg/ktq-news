import ax from 'axios';

const axios = ax.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
});

// axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             redirect(Routes.LOGIN);
//         }
//         return Promise.reject(error);
//     },
// );

export default axios;
