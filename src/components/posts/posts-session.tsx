'use client';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import Constant from '@/constants';
import axios from '@/lib/axios';
import { handleFilterChange } from '@/ultils/app';
import Routes from '@/ultils/routes';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Loading from '../loading';
import Post from '../post';
import { Button } from '../ui/button';
export default function PostsSession() {
    const [params, setParams] = useState({});
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState<IPaginateResponse<IPost> | null>(null);

    const searchParams = useSearchParams();

    const getPosts = useCallback(async () => {
        setLoading(true);
        const { data } = await axios({
            url: 'posts',
            method: 'GET',
            params,
        });

        setLoading(false);

        setData(data);
    }, [params]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    const createPagination = (currentPage: number, totalPages: number) => {
        const delta = 2;
        const range: string[] = [];
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(String(1));
        if (left > 2) range.push('...');
        for (let i = left; i <= right; i++) {
            range.push(String(i));
        }
        if (right < totalPages - 1) range.push('...');
        if (totalPages > 1) range.push(String(totalPages));

        return range;
    };

    useEffect(() => {
        const params = Constant.PARAMS_KEYS.reduce((prev, cur) => {
            const param = searchParams.get(cur);

            if (param) {
                prev[cur] = param;
            }

            return prev;
        }, {});

        setParams(params);
    }, [searchParams]);

    useEffect(() => {
        if (!data) return;

        const pagination = createPagination(99, 100);
        console.log(pagination);
    }, [data]);
    return (
        <>
            {loading ? (
                <Loading className="min-h-[60vh]" />
            ) : !data?.data || data.data.length <= 0 ? (
                <div className="flex items-center justify-center w-full min-h-[60vh]">
                    <Link href={Routes.HOME}>
                        <Button variant={'link'} size={'sm'}>
                            Không có dữ liệu !. Trở lại trang chủ
                        </Button>
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col gap-4">
                        {data.data.map((item) => {
                            return <Post data={item} key={item._id} />;
                        })}
                    </div>

                    {data.last_page > 1 && (
                        <Pagination className="mt-5">
                            <PaginationContent>
                                {data.has_prev_page && (
                                    <PaginationItem>
                                        <Button variant={'outline'} size={'icon'} onClick={() => handleFilterChange('page', String(1))}>
                                            <ChevronLeft />
                                        </Button>
                                    </PaginationItem>
                                )}
                                {createPagination(data.current_page, data.last_page).map((page) => {
                                    if (page === '...') {
                                        return (
                                            <PaginationItem key={page}>
                                                <Button variant={'outline'} size={'icon'}>
                                                    <Ellipsis />
                                                </Button>
                                            </PaginationItem>
                                        );
                                    }

                                    return (
                                        <PaginationItem key={page}>
                                            <Button
                                                variant={searchParams.get('page') === page ? 'default' : 'outline'}
                                                size={'icon'}
                                                onClick={() => handleFilterChange('page', String(page))}
                                            >
                                                {page}
                                            </Button>
                                        </PaginationItem>
                                    );
                                })}
                                {data.has_next_page && (
                                    <PaginationItem>
                                        <Button variant={'outline'} size={'icon'} onClick={() => handleFilterChange('page', String(data.current_page + 1))}>
                                            <ChevronRight />
                                        </Button>
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            )}
        </>
    );
}
