'use client';
import Loading from '@/components/loading';
import Post from '@/components/post';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import Routes from '@/ultils/routes';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Posts() {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);

    async function getData() {
        const { data } = await axios({
            method: 'GET',
            url: `posts/outstanding`,
        });

        if (data) setPosts(data);

        setLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className="order-2 md:order-1 md:col-span-8">
            <div>
                <h2 className="text-2xl font-medium">Bài viết nổi bật</h2>

                <div className="mt-4 flex flex-col gap-4">{loading ? <Loading /> : posts.map((item) => <Post data={item} key={item._id} />)}</div>

                <Link href={Routes.POSTS} className="flex items-center justify-center mt-8">
                    <Button variant={'link'}>
                        Xem tất cả
                        <ArrowRightIcon />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
