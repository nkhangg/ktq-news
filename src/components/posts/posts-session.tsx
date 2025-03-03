'use client';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import Constant from '@/constants';
import axios from '@/lib/axios';
import { handleFilterChange } from '@/ultils/app';
import Routes from '@/ultils/routes';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Loading from '../loading';
import Post from '../post';
import { Button } from '../ui/button';

export default function PostsSession() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IPaginateResponse<IPost> | null>(null);

    const params = useMemo(() => {
        return Constant.PARAMS_KEYS.reduce((prev, cur) => {
            const param = searchParams.get(cur);
            if (param) prev[cur] = param;
            return prev;
        }, {} as Record<string, string>);
    }, [searchParams]);

    // 🛠 API fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const transformedParams = Object.keys(params).reduce((prev, cur) => {
                    switch (cur) {
                        case 'category':
                            prev['filter.category.slug'] = params[cur];
                            break;
                        case 'ttr':
                            prev['filter.ttr'] = params[cur] === '-1' ? '$lte:300' : '$gt:300';
                            break;
                        case 'tags':
                            prev['filter.tags.slug'] = params[cur];
                            break;
                        case 'sortBy':
                            prev[cur] = params[cur] === '-1' ? 'updated_at:ASC' : 'updated_at:DESC';
                            break;
                        default:
                            prev[cur] = params[cur];
                    }
                    return prev;
                }, {} as Record<string, string>);

                const { data } = await axios.get('posts', {
                    params: { ...transformedParams, limit: 10 },
                });

                setData(data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [params]);

    // 🛠 Generate pagination logic
    const createPagination = (currentPage: number, totalPages: number) => {
        const delta = 2;
        const range: string[] = [];
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push('1');
        if (left > 2) range.push('...');
        for (let i = left; i <= right; i++) range.push(String(i));
        if (right < totalPages - 1) range.push('...');
        if (totalPages > 1) range.push(String(totalPages));

        return range;
    };

    return (
        <>
            {loading ? (
                <Loading className="min-h-[60vh]" />
            ) : !data?.data || data.data.length === 0 ? (
                <div className="flex items-center justify-center w-full min-h-[60vh]">
                    <Link href={Routes.HOME}>
                        <Button variant="link" size="sm">
                            Không có dữ liệu! Trở lại trang chủ
                        </Button>
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col gap-4">
                        {data.data.map((item) => (
                            <Post data={item} key={item.id} />
                        ))}
                    </div>

                    {data.last_page > 1 && (
                        <Pagination className="mt-5">
                            <PaginationContent>
                                {data.has_prev_page && (
                                    <PaginationItem>
                                        <Button variant="outline" size="icon" onClick={() => handleFilterChange('page', '1')}>
                                            <ChevronLeft />
                                        </Button>
                                    </PaginationItem>
                                )}
                                {createPagination(data.current_page, data.last_page).map((page) =>
                                    page === '...' ? (
                                        <PaginationItem key={page}>
                                            <Button variant="outline" size="icon">
                                                <Ellipsis />
                                            </Button>
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={page}>
                                            <Button
                                                variant={searchParams.get('page') === page ? 'default' : 'outline'}
                                                size="icon"
                                                onClick={() => handleFilterChange('page', page)}
                                            >
                                                {page}
                                            </Button>
                                        </PaginationItem>
                                    ),
                                )}
                                {data.has_next_page && (
                                    <PaginationItem>
                                        <Button variant="outline" size="icon" onClick={() => handleFilterChange('page', String(data.current_page + 1))}>
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
