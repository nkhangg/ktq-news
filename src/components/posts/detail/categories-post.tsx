import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import Routes from '@/ultils/routes';
import Link from 'next/link';
import { Suspense } from 'react';

export interface ICategoriesPostProps {
    data: IPost;
}

async function getData(post: IPost) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/outstanding/?limit=10&ignore=${post.category.id}`, {
        cache: 'force-cache',
        next: { tags: [`categories/outstanding_limit=10_ignore=${post.category.id}`], revalidate: 300 },
    });

    return await data.json();
}

export default async function CategoriesPost({ data }: ICategoriesPostProps) {
    const result: ICategory[] = (await getData(data)) || [];

    console.log(result);
    return (
        <div className=" mt-4">
            <div>
                <h3 className="text-[#757575] ">Xem các bài viết theo chủ đề khác</h3>

                <div className="mt-2 flex flex-wrap gap-2">
                    <Suspense fallback={<Loading />}>
                        {(result || []).map((item) => {
                            return (
                                <Link href={Routes.GENERATE_CATEGORY_URL(item)} key={item.id}>
                                    <Button variant={'outline'} size={'sm'} className="rounded-full">
                                        {item.name} {item.post_count ? `(${item.post_count})` : ''}
                                    </Button>
                                </Link>
                            );
                        })}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
