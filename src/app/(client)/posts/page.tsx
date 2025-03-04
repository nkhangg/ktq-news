import Breadcrumb from '@/components/breadcrumb';
import FilterSession from '@/components/posts/filter-session';
import PostsSession from '@/components/posts/posts-session';
import Constant from '@/constants';
import Routes from '@/ultils/routes';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const generateMetadata = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> => {
    const params = (await searchParams) || {};

    const hasParams = Object.keys(params).length > 0;

    return {
        title: `Bài viết | ${process.env.LOGO_NAME}`,
        description: Constant.DESCRIPTION,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_SITE_URL}${Routes.POSTS}`,
        },
        robots: {
            index: !hasParams,
            follow: true,
        },
    };
};

export default async function Posts() {
    return (
        <div>
            <Breadcrumb
                data={[
                    {
                        pageName: 'Bài viết',
                    },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 mt-10 gap-5">
                <div className="md:col-span-3">
                    <Suspense>
                        <FilterSession />
                    </Suspense>
                </div>
                <div className="md:col-span-9">
                    <Suspense>
                        <PostsSession />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
