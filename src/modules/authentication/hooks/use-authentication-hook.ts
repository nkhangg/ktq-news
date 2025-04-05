'use client';
import { authenticationService } from '../services/authentication.service';
import { useRouter } from 'next/navigation';

export default function useAuthenticationHook({ type, success }: { type: string; success?: (type: string) => void }) {
    const router = useRouter();

    const handleSubmit = async ({ password, email, name }: Record<string, string | boolean>) => {
        if (type === 'login') {
            const data = await authenticationService.login({ password: String(password), email: String(email) });

            if (data) {
                if (success) {
                    success(type);
                } else {
                    router.push('/');
                }
            }
        } else {
            const data = await authenticationService.register({ password: String(password), email: String(email), name: String(name) });

            if (data) {
                if (success) {
                    success(type);
                } else {
                    router.push('/login');
                }
            }
        }
    };

    return {
        handleSubmit,
    };
}
