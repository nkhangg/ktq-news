'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Constant from '@/constants';
import { handleClearFilterChange, handleFilterChange } from '@/ultils/app';
import { RefreshCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CategoriesFilter from './categories-filter';
import TagsFilter from './tags-filter';

const initFilter = [
    {
        title: 'Phút đọc',
        name: 'ttr',
        data: [
            {
                title: 'Dưới 5 phút đọc',
                value: '-1',
            },
            {
                title: 'Trên 5 phút đọc',
                value: '1',
            },
        ],
    },
    {
        title: 'Sắp xếp',
        name: 'sortBy',
        default: '1',
        data: [
            {
                title: 'Mới nhất',
                value: '-1',
            },
            {
                title: 'Cũ nhất',
                value: '1',
            },
        ],
    },
];

export default function FilterWarper({ tags, categories }: { tags: ITag[]; categories: ICategory[] }) {
    const searchParams = useSearchParams();

    const [data, setData] = useState(initFilter);

    const [showRefresh, setShowRefresh] = useState(false);

    useEffect(() => {
        const params = Constant.PARAMS_KEYS.reduce((prev, cur) => {
            const param = searchParams.get(cur);

            if (param) {
                prev[cur] = param;
            }

            return prev;
        }, {});

        if (Object.keys(params).length > 0) {
            setShowRefresh(true);
        } else {
            setShowRefresh(false);
        }

        const prevData = [...data];

        prevData.forEach((item) => {
            const param = searchParams.get(item.name);

            if (param) {
                item.default = param;
            }
        });

        if (JSON.stringify(prevData) !== JSON.stringify(data)) {
            setData(prevData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <>
            {showRefresh && (
                <div className="flex items-center justify-end">
                    <Button onClick={() => handleClearFilterChange()} size={'icon'}>
                        <RefreshCcw />
                    </Button>
                </div>
            )}
            <Accordion type="multiple">
                <CategoriesFilter categories={categories} />
                <TagsFilter tags={tags} />

                {data.map((item) => {
                    return (
                        <AccordionItem key={item.name} value={item.title}>
                            <AccordionTrigger className="text-[#757575] text-[16px] hover:no-underline">{item.title}</AccordionTrigger>
                            <AccordionContent className="flex items-center flex-col gap-2">
                                <RadioGroup onValueChange={(value) => handleFilterChange(item.name, value)} name={item.name} defaultValue={String(item.default)} className="w-full">
                                    {item.data.map((i) => {
                                        return (
                                            <div key={i.title} className="flex items-center space-x-2 w-full">
                                                <RadioGroupItem value={String(i.value)} id={i.value + item.name} />
                                                <Label htmlFor={i.value + item.name}>{i.title}</Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </>
    );
}
