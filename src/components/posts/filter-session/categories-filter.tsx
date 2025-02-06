'use client';
import Loading from '@/components/loading';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { handleFilterChange } from '@/ultils/app';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoriesFilter() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();

    async function getCategories() {
        const { data } = await axios({
            url: 'categories',
        });

        setLoading(false);
        if (!data) return;

        setCategories(data);
    }

    useEffect(() => {
        getCategories();
    }, []);
    return (
        <>
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-[#757575] text-[16px] hover:no-underline">Chủ đề</AccordionTrigger>
                <AccordionContent className="mt-2 flex flex-wrap gap-2">
                    {!loading &&
                        categories.map((item) => {
                            return (
                                <Button
                                    key={item._id}
                                    onClick={() => handleFilterChange('category', item.slug)}
                                    variant={searchParams.get('category') === item.slug ? 'default' : 'outline'}
                                    size={'sm'}
                                    className="rounded-full"
                                >
                                    {item.name} {item.post_count ? `(${item.post_count})` : ''}
                                </Button>
                            );
                        })}
                    {loading && <Loading className="min-h-10" />}
                </AccordionContent>
            </AccordionItem>
        </>
    );
}
