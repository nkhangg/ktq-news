/* eslint-disable @typescript-eslint/no-unused-vars */
import ActionSession from '@/components/posts/detail/action-session';
import AuthorSession from '@/components/posts/detail/author-session';
import CategoriesPost from '@/components/posts/detail/categories-post';
import GenerateContent from '@/components/posts/detail/generate-content';
import PostContactSession from '@/components/posts/detail/post-contact-session';
import Constant from '@/constants';
import connectDB from '@/lib/mongoose';
import { PostModel } from '@/models/post';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const getData = async (_id: IPost['_id']) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${_id}`);

    if (data.status != 200) {
        notFound();
    }

    return data.json();
};

export interface IDetailPostProps {
    params: Promise<{ params: string[] }>;
}

export async function generateMetadata({ params }) {
    const [_id, slug, title] = (await params).params;

    await connectDB();

    const data = await PostModel.findOne({ _id });

    return {
        title: data ? data.title : ` ${decodeURIComponent(title).replaceAll('-', ' ')} | KTQ News`,
        description: Constant.DESCRIPTION,
    };
}

export default async function DetailPost({ params }: IDetailPostProps) {
    const [_id] = (await params).params;

    const data: IPost = await getData(_id);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 mt-10">
            <div className="md:col-span-9 ">
                <h1 className="text-3xl font-bold">{data.title}</h1>

                <Suspense>
                    <AuthorSession data={data} />
                </Suspense>

                <GenerateContent data={data} />

                <div className="mt-5">
                    <PostContactSession data={data} />

                    <CategoriesPost data={data} />
                </div>
            </div>
            <div className="hidden md:block md:col-span-3 ml-5">
                <div className="w-full flex items-center justify-center pb-5">
                    <span className="font-medium text-sm">{data.user.fullname}</span>
                </div>
                <div className="h-[1px] w-full bg-[#e6e6e6]"></div>

                <div className="w-full flex justify-center">
                    <ActionSession initFetch={false} data={data} />
                </div>
            </div>
        </div>
    );
}
