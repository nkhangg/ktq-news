/* eslint-disable @next/next/no-img-element */
'use client';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import { isValidJSONObject } from '@/ultils/app';
import Routes from '@/ultils/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import MDEditor from '@uiw/react-md-editor';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import rehypeSanitize from 'rehype-sanitize';
import { z } from 'zod';

const postSchema = z.object({
    title: z.string().min(1, 'Slug is required'),
    thumbnail: z.string().url('Thumbnail must be a valid URL'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    preview_content: z.string().min(1, 'Preview content is required'),
    category_id: z.string().min(1, 'Category ID must be a valid UUID'),
    ttr: z.coerce.number().positive('TTR must be a positive number'),
});

export default function CreatePost() {
    const LOCAL_KEY = 'create-post';
    const [categories, setCategories] = useState<ICategory[]>([]);

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const { toast } = useToast();

    const {
        reset,
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(postSchema),
    });

    const getCategories = useCallback(async () => {
        const { data } = await axios({
            url: 'admin/categories/select',
        });

        if (data) {
            setCategories(data);
        }
    }, []);

    const create = useCallback(
        async (values: FieldValues) => {
            try {
                setLoading(true);
                await axios({
                    url: 'admin/posts',
                    method: 'POST',
                    data: values,
                });

                toast({
                    title: 'Oops',
                    description: 'Create success',
                    duration: 2000,
                });
                localStorage.removeItem(LOCAL_KEY);
                reset({ thumbnail: '', slug: '', title: '', content: '', preview_content: '', category_id: '', ttr: '' });

                router.push(Routes.ADMIN_POSTS);
            } catch (error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const message = ((error as Record<string, any>).response?.data['message'] as string) || (error as AxiosError).message || '';
                toast({
                    title: 'Oops',
                    description: message,
                    duration: 2000,
                });
            } finally {
                setLoading(false);
            }
        },
        [reset, router, toast],
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                event.preventDefault();
                handleSubmit(async (values) => {
                    await create(values);
                })();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSubmit, create]);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    useEffect(() => {
        const prevPost = localStorage.getItem(LOCAL_KEY);

        if (prevPost && isValidJSONObject(prevPost)) {
            reset(JSON.parse(prevPost));
        }

        return () => {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(getValues()));
        };
    }, [getValues, reset]);

    useEffect(() => {
        const title = watch('title') || '';
        if (title) {
            setValue(
                'slug',
                title
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]+/g, ''),
                { shouldValidate: true },
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('title'), setValue]);

    return (
        <form
            onSubmit={handleSubmit(async (values) => {
                await create(values);
            })}
            className="flex flex-col gap-5 "
        >
            <div className="flex items-start gap-5">
                <div className="flex items-center gap-4 w-full flex-col">
                    <div className="flex flex-col gap-2 w-full">
                        <Label>Title</Label>
                        <Input {...register('title')} />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message as string}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Label>Slug</Label>
                        <Input {...register('slug')} />
                        {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message as string}</p>}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <Label>Category</Label>
                        <Select
                            {...register('category_id')}
                            onValueChange={(e) => {
                                setValue('category_id', e, { shouldValidate: true });
                            }}
                            value={watch('category_id') || ''}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((item) => {
                                    return (
                                        <SelectItem key={item._id} value={item._id}>
                                            {item.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message as string}</p>}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <Label>Preview content</Label>
                        <Textarea rows={6} {...register('preview_content')} />
                        {errors.preview_content && <p className="text-red-500 text-sm">{errors.preview_content.message as string}</p>}
                    </div>
                </div>
                <div className="flex flex-col items-start gap-4 w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <Label>Time to read</Label>
                        <Input {...register('ttr')} />
                        {errors.ttr && <p className="text-red-500 text-sm">{errors.ttr.message as string}</p>}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <Label>Thumbnail</Label>
                        <Input {...register('thumbnail')} />

                        {watch('thumbnail') && (
                            <div className="border-2 border-gray-400 h-[240px] rounded-lg p-3 w-fit">
                                <img className="w-full h-full" src={watch('thumbnail')} alt={watch('thumbnail')} />
                            </div>
                        )}
                        {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail.message as string}</p>}
                    </div>
                </div>
            </div>

            <div className="">
                <div className="flex flex-col gap-2 w-full">
                    <Label>Content</Label>

                    <MDEditor
                        height={800}
                        data-color-mode="light"
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                        }}
                        value={watch('content') || ''}
                        onChange={(val) => setValue('content', val || '', { shouldValidate: true })}
                    />

                    {errors.content && <p className="text-red-500 text-sm">{errors.content.message as string}</p>}
                </div>
            </div>

            <Button type="submit">Save</Button>

            {loading && (
                <div className="fixed bg-[rgba(0,0,0,.4)] inset-0">
                    <Loading />
                </div>
            )}
        </form>
    );
}
