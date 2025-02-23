import Breadcrumb from '@/components/breadcrumb';
import FilterSession from '@/components/posts/filter-session';
import PostsSession from '@/components/posts/posts-session';
import { Suspense } from 'react';

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
