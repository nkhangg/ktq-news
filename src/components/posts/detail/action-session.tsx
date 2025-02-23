'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import usePostLikeStore from '@/stores/post-like-store';
import Routes from '@/ultils/routes';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';

export interface IActionSessionProps {
    data: IPost;
    initFetch?: boolean;
}

export default function ActionSession({ data, initFetch = true }: IActionSessionProps) {
    const { likeData, setLikeData } = usePostLikeStore();

    const { toast } = useToast();

    const likeAction = async () => {
        try {
            const result = await axios({
                url: 'likes',
                method: 'POST',
                data: {
                    post_id: data.id,
                },
            });

            if (result?.data && result.data?.data) {
                setLikeData({ post: { ...data, like_count: result.data.data.post.like_count || 0 }, action: result.data.data.action || 'unlike' });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'Oops !',
                description: 'Chậm lại một chút nhé!',
                duration: 2000,
            });
        }
    };

    const getLikeInfo = useCallback(async () => {
        if (!data.id || initFetch) return;
        try {
            const result = await axios({
                url: 'likes/post/' + data.id,
            });

            if (result?.data && result.data.data) {
                setLikeData(result.data.data);
            } else {
                setLikeData({ post: data, action: 'unlike' });
            }
        } catch (error) {
            console.log(error);
            setLikeData({ post: data, action: 'unlike' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, initFetch]);

    useEffect(() => {
        getLikeInfo();
    }, [getLikeInfo]);

    return (
        <div className="flex flex-col gap-2 justify-center items-center py-3">
            <div className="flex items-center gap-2 ">
                <Button onClick={() => likeAction()} variant={'ghost'} size={'icon'}>
                    <Heart color={likeData && likeData.action === 'like' ? 'red' : undefined} />
                </Button>
                <span className="text-[15px] font-medium">{likeData ? likeData.post?.like_count : 0}</span>
            </div>
            <span className="text-center text-[#757575] text-sm">Cho một tim nếu bạn thấy bài viết này hữu ít ❤️</span>

            {data?.tags && data.tags.length > 0 && (
                <div className="flex items-center gap-4 flex-wrap">
                    {data.tags.map((item) => {
                        return (
                            <Link key={item.slug} href={Routes.POSTS + `?tags=${item.slug}`}>
                                <Badge variant={'outline'}>#{item.name}</Badge>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
