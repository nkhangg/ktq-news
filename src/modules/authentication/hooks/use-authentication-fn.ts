'use client';
import { authenticationService } from '../services/authentication.service';

export default function useAuthenticationFn() {
    const loginWithGoogle = (success?: () => void) => {
        const width = 600;
        const height = 400;

        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const left = (screenWidth - width) / 2;
        const top = (screenHeight - height) / 2;

        const popup = window.open(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/google`, '_blank', `width=${width},height=${height},left=${left},top=${top}`);

        if (!popup) return;

        popup.focus();

        const interval = setInterval(() => {
            try {
                if (!popup || popup.closed) {
                    clearInterval(interval); // Dừng kiểm tra
                    success?.(); // Gọi callback khi popup đóng
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }, 500);
    };

    const me = async () => {
        return await authenticationService.me();
    };

    const logout = async (success?: () => void) => {
        const result = await authenticationService.logout();

        if (result) {
            success?.();
        }

        return result;
    };

    return {
        loginWithGoogle,
        me,
        logout,
    };
}
