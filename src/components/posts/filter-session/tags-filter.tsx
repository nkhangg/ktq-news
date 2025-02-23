'use client';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { handleFilterChange } from '@/ultils/app';
import { useSearchParams } from 'next/navigation';

export default function TagsFilter({ tags }: { tags: ITag[] }) {
    const searchParams = useSearchParams();

    return (
        <>
            <AccordionItem value="item-tag">
                <AccordionTrigger className="text-[#757575] text-[16px] hover:no-underline">Tags</AccordionTrigger>
                <AccordionContent className="mt-2 flex flex-wrap gap-2">
                    {tags.map((item) => {
                        return (
                            <Button
                                key={item.id}
                                onClick={() => handleFilterChange('tags', item.slug)}
                                variant={searchParams.get('tags') === item.slug ? 'default' : 'outline'}
                                size={'sm'}
                                className="rounded-full"
                            >
                                #{item.name}
                            </Button>
                        );
                    })}
                </AccordionContent>
            </AccordionItem>
        </>
    );
}
