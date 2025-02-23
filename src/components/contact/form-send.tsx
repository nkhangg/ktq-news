'use client';
import { z } from 'zod';
import InputLabel from '../input-label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import { useState } from 'react';
import Loading from '../loading';

const formSchema = z.object({
    fullname: z.string().min(1, { message: 'Tên không được để trống' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    message: z.string().min(1, { message: 'Nội dung không được để trống' }),
});

export default function FormSend() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const { toast } = useToast();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = async (values: FieldValues) => {
        try {
            setIsLoading(true);
            const { data } = await axios({
                method: 'POST',
                data: values,
                url: 'feedbacks',
            });

            if (data?.data) {
                toast({
                    title: 'Thông báo',
                    description: 'Cảm ơn bạn đã quan tâm đến chúng tôi. Tâm ý của bạn sẽ được chúng tôi hòi âm trong thời gian sớm nhất ❤️',
                });

                reset({ fullname: '', email: '', message: '' });
                return;
            }

            toast({
                title: 'Oops',
                description: 'Chức năng đăng được bảo trì. Bạn có thể gửi mail trực tiếp cho chúng tôi. Rất xin lỗi vì sự bất tiện này.',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: 'Oops',
                description: 'Chức năng đăng được bảo trì. Bạn có thể gửi mail trực tiếp cho chúng tôi. Rất xin lỗi vì sự bất tiện này.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-4 " onSubmit={handleSubmit(onSubmit)}>
            <InputLabel label="Tên">
                <Input {...register('fullname')} placeholder="Chúng tôi có thể gọi bạn là..." />
                {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message as string}</p>}
            </InputLabel>

            <InputLabel label="Email">
                <Input {...register('email')} placeholder="Nhập email của bạn..." />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            </InputLabel>

            <InputLabel label="Nội dung">
                <Textarea {...register('message')} rows={6} className="resize-none" placeholder="Nhập nội dung của bạn..." />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message as string}</p>}
            </InputLabel>

            <Button disabled={isLoading} type="submit">
                <div className="flex items-center justify-center gap-4">
                    <span>Gửi</span>

                    {isLoading && <Loading />}
                </div>
            </Button>
        </form>
    );
}
