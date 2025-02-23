'use client';
import Post from '@/components/post';
import { Button } from '@/components/ui/button';
import Routes from '@/ultils/routes';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function Posts({ title, data }: { title: string; data: IPost[] }) {
    return (
        <div>
            <div>
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-2xl font-medium">{title}</h2>

                    <Link href={Routes.POSTS} className="flex items-center justify-center">
                        <Button variant={'link'}>
                            Xem tất cả
                            <ArrowRightIcon />
                        </Button>
                    </Link>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    {data.map((item) => (
                        <Post data={item} key={item.id} />
                    ))}
                </div>
                {/* <div className="mt-4 flex flex-col gap-4">{loading ? <Loading /> : data.map((item) => <Post data={item} key={item.id} />)}</div> */}
            </div>
        </div>
    );
}
