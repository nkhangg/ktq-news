'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import usePostLikeStore from '@/stores/post-like-store';
import { Heart } from 'lucide-react';
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
                url: 'posts/like',
                method: 'POST',
                data: {
                    post_id: data._id,
                },
            });

            if (result.data) {
                setLikeData({ post: { ...data, like_count: result.data.current_like_count || 0 }, action: result.data.action || 'unlike' });
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
        if (!data._id || initFetch) return;
        const result = await axios({
            url: 'posts/like',
            params: { post_id: data._id },
        });

        if (result.data) {
            setLikeData(result.data);
        } else {
            setLikeData(null);
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
                <span className="text-[15px] font-medium">{likeData ? likeData.post.like_count : 0}</span>
            </div>
            <span className="text-center text-[#757575] text-sm">Cho một tim nếu bạn thấy bài viết này hữu ít ❤️</span>
        </div>
    );
}
