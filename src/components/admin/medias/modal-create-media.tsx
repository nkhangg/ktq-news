import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import Dropzone from './dropzone';
import Loading from '@/components/loading';

const mediasSchema = z
    .object({
        file: z.instanceof(File).optional(),
        link: z.string().url('Invalid URL format').optional(),
    })
    .refine((data) => data.file || data.link, {
        message: 'Either file or link is required',
    });

export interface IModalCreateMediaProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onCreated: () => void;
}

export default function ModalCreateMedia({ setOpen, onCreated, open, ...props }: IModalCreateMediaProps) {
    const { toast } = useToast();

    const [type, setType] = useState('link');

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(mediasSchema),
    });

    const create = async (values: FieldValues) => {
        try {
            setLoading(true);
            const { data } = await axios({
                url: 'admin/medias',
                data: values,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast({
                title: 'Oops!',
                description: data.message || '',
            });

            setOpen(false);

            onCreated();
        } catch (error) {
            toast({
                title: 'Oops!',
                description: ((error as AxiosError).response?.data as Record<string, string>).message || 'Something Error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog {...props} onOpenChange={setOpen} open={open}>
            <DialogContent>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.2)]">
                        <Loading className="min-h-0" />
                    </div>
                )}
                <DialogHeader>
                    <DialogTitle>{'Media'}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(async (values) => {
                        await create(values);
                    })}
                    className="flex flex-col gap-4"
                >
                    <Select value={type} onValueChange={setType} defaultValue="link">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="local">Local</SelectItem>
                        </SelectContent>
                    </Select>

                    {type === 'link' && (
                        <div className="flex flex-col gap-2">
                            <Label>Link</Label>
                            <Input {...register('link')} />
                            {errors.link && <p className="text-red-500 text-sm">{errors.link.message as string}</p>}
                        </div>
                    )}

                    {type === 'local' && (
                        <Dropzone
                            onChangeFile={(file) => {
                                reset({ file: file[0] || undefined });
                            }}
                        />
                    )}
                    {errors.file && <p className="text-red-500 text-sm">{errors.file.message as string}</p>}

                    <Button type="submit" className="mt-4">
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
