/* eslint-disable @next/next/no-img-element */
'use client';
import Loading from '@/components/loading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import Routes from '@/ultils/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import MDEditor from '@uiw/react-md-editor';
import { AxiosError } from 'axios';
import { Link2, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import rehypeSanitize from 'rehype-sanitize';
import { z } from 'zod';

export interface IDetailPostProps {
    params: Promise<{ _id: string }>;
}

const postSchema = z.object({
    title: z.string().min(1, 'Slug is required'),
    thumbnail: z.string().url('Thumbnail must be a valid URL'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    preview_content: z.string().min(1, 'Preview content is required'),
    category_id: z.string().min(1, 'Category ID must be a valid UUID'),
    ttr: z.coerce.number().positive('TTR must be a positive number'),
});

export default function DetailPost({ params }: IDetailPostProps) {
    const { _id } = use(params);

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [post, setPost] = useState<IPost | null>(null);

    const [loading, setLoading] = useState(false);

    const routes = useRouter();

    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
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

    const getPost = useCallback(async () => {
        const { data } = await axios({
            url: 'admin/posts/' + _id,
        });

        if (data) {
            setPost(data);
        }
    }, [_id]);

    const update = useCallback(
        async (values: FieldValues) => {
            try {
                setLoading(true);
                await axios({
                    url: 'admin/posts/' + _id,
                    method: 'POST',
                    data: values,
                });

                toast({
                    title: 'Oops',
                    description: 'Update success',
                    duration: 2000,
                });
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
        [_id, toast],
    );

    const handleDelete = async (category: IPost) => {
        try {
            setLoading(true);
            const { data } = await axios({
                url: 'admin/posts/' + category._id,
                method: 'DELETE',
                data: {
                    id: category._id,
                },
            });

            toast({
                title: 'Oops!',
                duration: 1000,
                description: data.message || '',
            });

            routes.push(Routes.ADMIN_POSTS);
        } catch (error) {
            toast({
                title: 'Oops!',
                duration: 1000,
                description: ((error as AxiosError).response?.data as Record<string, string>).message || 'Something Error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    useEffect(() => {
        getPost();
    }, [getPost]);

    useEffect(() => {
        if (!post) return;

        reset({ ...post, category_id: post.category._id });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                event.preventDefault();
                handleSubmit(async (values) => {
                    await update(values);
                })();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSubmit, update]);
    return (
        <>
            <form
                onSubmit={handleSubmit(async (values) => {
                    await update(values);
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
                            onChange={(val) => setValue('content', val || '')}
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

            <div className="fixed bottom-5 right-5 flex items-center flex-col gap-4">
                <Link target="_blank" href={post ? Routes.GENERATE_POST_URL(post) : Routes.ADMIN_POSTS}>
                    <Button size={'icon'}>
                        <Link2 />
                    </Button>
                </Link>
                <AlertDialog>
                    <AlertDialogTrigger className="w-full">
                        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 w-9">
                            <Trash />
                        </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure delete: {post && post.title}?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={post ? () => handleDelete(post) : undefined}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}
