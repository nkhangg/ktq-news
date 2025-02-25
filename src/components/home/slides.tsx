import { Button } from '@/components/ui/button';
import Constant from '@/constants';
import { cn } from '@/lib/utils';
import { getSliders, getStaticData } from '@/ultils/data-fn';
import Routes from '@/ultils/routes';
import { ArrowRightIcon, ArrowUpRight } from 'lucide-react';
import moment from 'moment';
import { Dancing_Script } from 'next/font/google';
import Link from 'next/link';
import { Suspense } from 'react';
const dancing = Dancing_Script({
    subsets: ['latin'],
});

export default async function Slides() {
    const staticData = await getStaticData();
    const data: { post_count: number; category_count: number } = await getSliders();

    return (
        <Suspense>
            <div className="grid grid-cols-1 md:grid-cols-12 md:h-[500px] gap-5">
                <div
                    style={{
                        backgroundImage: `url('${staticData.images['slide-image-1']}')`,
                    }}
                    className="h-[240px] md:h-full md:col-span-8 relative bg-no-repeat bg-center bg-cover transition-all rounded-xl shadow-xl p-5 flex flex-col justify-between"
                >
                    <div className="flex items-start justify-between">
                        <Button variant="outline" className="w-fit hidden md:flex">
                            {moment().format('MMMM Do YYYY')}
                        </Button>

                        <div
                            className={cn('text-white drop-shadow-2xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] py-2 px-5 rounded-md max-w-[500px] text-3xl', {
                                [dancing.className]: true,
                            })}
                        >
                            {staticData.description || Constant.DESCRIPTION}
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <Link href={Routes.POSTS}>
                            <Button variant={'outline'} size={'icon'} className="rounded-full">
                                <ArrowUpRight />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className=" md:col-span-4 flex flex-col gap-5">
                    <div
                        style={{
                            backgroundImage: `url('${staticData.images['slide-image-3']}')`,
                        }}
                        className="w-full h-[240px] md:h-full bg-no-repeat bg-bottom bg-cover  border rounded-xl shadow-xl p-4 flex flex-col items-end justify-between "
                    >
                        <Button size={'sm'} variant={'ghost'} className="border border-white bg-transparent text-white">
                            {data?.category_count || 0}+ danh mục
                        </Button>

                        <Link href={Routes.POSTS} className="w-full flex items-center justify-center">
                            <Button variant={'outline'} className="leading-6 border-white border flex items-center justify-between">
                                <p>Khám phá ngay</p>
                                <ArrowRightIcon />
                            </Button>
                        </Link>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url('${staticData.images['slide-image-2']}')`,
                        }}
                        className="w-full  h-[240px] md:h-full bg-no-repeat bg-bottom bg-cover  border rounded-xl shadow-xl p-4 flex flex-col items-end justify-between "
                    >
                        <Button size={'sm'} variant={'ghost'} className="border border-white bg-transparent text-white">
                            {data?.post_count || 0}+ bài viết
                        </Button>

                        <Link href={Routes.POSTS} className="w-full flex items-center justify-center">
                            <Button variant={'outline'} className="leading-6 border-white border flex items-center justify-between">
                                <p>Xem ngay</p>
                                <ArrowRightIcon />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
