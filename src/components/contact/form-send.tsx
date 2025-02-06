'use client';
import { z } from 'zod';
import InputLabel from '../input-label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(1, { message: 'Tên không được để trống' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    content: z.string().min(1, { message: 'Nội dung không được để trống' }),
});

export default function FormSend() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const { toast } = useToast();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = (data: FieldValues) => {
        toast({
            title: 'Oops',
            description: 'Chức năng đăng được bảo trì. Bạn có thể gửi mail trực tiếp cho chúng tôi. Rất xin lỗi vì sự bất tiện này.',
        });
    };

    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputLabel label="Tên">
                <Input {...register('name')} placeholder="Chúng tôi có thể gọi bạn là..." />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
            </InputLabel>

            <InputLabel label="Email">
                <Input {...register('email')} placeholder="Nhập email của bạn..." />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            </InputLabel>

            <InputLabel label="Nội dung">
                <Textarea {...register('content')} rows={6} className="resize-none" placeholder="Nhập nội dung của bạn..." />
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message as string}</p>}
            </InputLabel>

            <Button type="submit">Gửi</Button>
        </form>
    );
}
