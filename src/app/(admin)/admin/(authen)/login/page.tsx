'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import Routes from '@/ultils/routes';
import { Label } from '@radix-ui/react-label';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';

type LoginFormInputs = {
    username: string;
    password: string;
};

export default function Login() {
    const { toast } = useToast();

    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const login = async (formData: LoginFormInputs) => {
        try {
            const { data } = await axios({
                method: 'POST',
                url: 'admin/login',
                data: formData,
            });

            if (data && data.data) {
                router.push(Routes.DASHBOARD);
            }

            toast({
                title: 'Oops!',
                description: data.message || "Some thing wen't wrong",
                duration: 2000,
            });
        } catch (error) {
            const { response } = error as AxiosError;
            toast({
                title: 'Oops!',
                description: response?.data ? response?.data['message'] : "Some thing wen't wrong",
                duration: 2000,
            });
        } finally {
        }
    };

    const onSubmit = (data: LoginFormInputs) => {
        login(data);
    };

    return (
        <Suspense>
            <div className="flex items-center justify-center h-screen">
                <form onSubmit={handleSubmit(onSubmit)} className="w-[400px] border-2 border-gray-400 p-5 rounded-lg flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label className="font-medium text-sm">Username</Label>
                        <Input {...register('username', { required: 'Username is required' })} placeholder="Enter your username" />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label className="font-medium text-sm">Password</Label>
                        <Input type="password" {...register('password', { required: 'Password is required' })} placeholder="Enter your password" />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <Button type="submit">Login</Button>
                </form>
            </div>
        </Suspense>
    );
}
