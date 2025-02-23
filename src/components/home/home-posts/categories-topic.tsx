import Link from 'next/link';
import { Button } from '../../ui/button';
import { Suspense } from 'react';
import Loading from '@/components/loading';
import Routes from '@/ultils/routes';
import { getCategoriesTopic } from '@/ultils/data-fn';

export default async function CategoriesTopic() {
    const data: ICategory[] = (await getCategoriesTopic()) || [];

    return (
        <div className=" order-1 md:order-2 md:col-span-4">
            <div>
                <h4 className="text-[#757575] ">Xem bài viết theo chủ đề</h4>

                <div className="mt-2 flex flex-wrap gap-2">
                    <Suspense fallback={<Loading />}>
                        {data.map((item) => {
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
