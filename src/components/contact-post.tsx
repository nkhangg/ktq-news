/* eslint-disable jsx-a11y/alt-text */
import { ArrowRight, Dot } from 'lucide-react';
import * as React from 'react';
import Image from './image';
import Link from 'next/link';
import { Button } from './ui/button';
import Routes from '@/ultils/routes';
import { generateTTR } from '@/ultils/app';

export interface IContactPostProps {
    data: IPost;
}

export default function ContactPost({ data }: IContactPostProps) {
    return (
        <div className="flex flex-col gap-2 py-2 border-b border-gray-200">
            <div className="text-[15px] flex items-center gap-1">
                <span>Đăng bởi </span>
                <b className="font-medium ml-[2px]">{data.admin.fullname || 'Admin'}</b>
                <Dot size={10} />
                <span>{generateTTR(data.ttr + '')}</span>
            </div>

            <h3 className="mt-2 text-lg font-medium line-clamp-2">{data.title}</h3>

            <Image src={data.thumbnail} className="h-[280px]" />

            <p className="line-clamp-4">{data.preview_content}</p>

            <Link href={Routes.GENERATE_POST_URL(data)} className="flex items-center justify-center">
                <Button variant={'link'}>
                    <span>Xem tiếp</span>
                    <ArrowRight />
                </Button>
            </Link>
        </div>
    );
}
