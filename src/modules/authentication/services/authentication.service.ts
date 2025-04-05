import { handleError, handleSuccess } from '@/ultils/apis';
import axios from '../lib/axios';
import { ILoginDTO, IRegisterDTO } from '../types/auth-service.type';

const login = async (values: ILoginDTO) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'auth/login',
            data: values,
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        handleError(error);
    }
};

const register = async (values: IRegisterDTO) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'auth/register',
            data: values,
        });

        handleSuccess<boolean>(response);

        if (response.data && response.data.data) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        handleError<boolean>(error);
    }
};

const logout = async () => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'auth/logout',
        });

        handleSuccess<boolean>(response);

        if (response.data && response.data.data) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        handleError<boolean>(error);
    }
};

const me = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'auth/me',
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        handleError<IUser>(error);
    }
};

export const authenticationService = {
    register,
    login,
    logout,
    me,
};
