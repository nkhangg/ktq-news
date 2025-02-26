/* eslint-disable @typescript-eslint/no-unused-vars */
import ActionSession from '@/components/posts/detail/action-session';
import AuthorSession from '@/components/posts/detail/author-session';
import GenerateContent from '@/components/posts/detail/generate-content';
import PostContactSession from '@/components/posts/detail/post-contact-session';
import Constant from '@/constants';
import { getData, getMetadata } from '@/ultils/data-fn';
import { Suspense } from 'react';

export interface IDetailPostProps {
    params: Promise<{ params: string[] }>;
}

export async function generateMetadata({ params }) {
    const [slug, title] = (await params).params;

    const data = await getMetadata(slug);

    return {
        title: data && data?.title ? data.title + ` | ${process.env.LOGO_NAME}` : ` ${decodeURIComponent(title).replaceAll('-', ' ')} | ${process.env.LOGO_NAME}`,
        description: data && data?.preview_content ? data?.preview_content : Constant.DESCRIPTION,
    };
}

export default async function DetailPost({ params }: IDetailPostProps) {
    const [slug] = (await params).params;

    const data: IPost = await getData(slug);

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

                    {/* <CategoriesPost data={data} /> */}
                </div>
            </div>
            <div className="hidden md:block md:col-span-3 ml-5">
                <div className="w-full flex items-center justify-center pb-5">
                    <span className="font-medium text-sm">{data.admin.fullname || 'Admin'}</span>
                </div>
                <div className="h-[1px] w-full bg-[#e6e6e6]"></div>

                <div className="w-full flex justify-center">
                    <ActionSession initFetch={false} data={data} />
                </div>
            </div>
        </div>
    );
}
