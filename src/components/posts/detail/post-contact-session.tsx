'use client';

import ContactPost from '@/components/contact-post';
import ActionSession from './action-session';
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading';

export interface IPostContactSessionProps {
    data: IPost;
}

export default function PostContactSession({ data }: IPostContactSessionProps) {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        const result = await axios({
            url: 'posts',
            params: {
                limit: 4,
                category: data.category.slug,
                ignore: data._id,
            },
        });

        if (result && result.data?.data) {
            setPosts(result.data.data);
        }

        setLoading(false);
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <ActionSession data={data} />

            <div className="h-[2px] bg-[#757575] w-full my-5"></div>

            {!loading && posts.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-medium">Các bài viết khác về chủ đề {data.category.name}</h2>

                    <div className="mt-5 flex flex-col gap-4">
                        {posts.map((item) => {
                            return <ContactPost key={item._id} data={item} />;
                        })}
                    </div>
                </div>
            )}

            {loading && <Loading />}
        </div>
    );
}
