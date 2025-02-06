/* eslint-disable jsx-a11y/alt-text */
'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axiosConfig from '@/lib/axios';
import Routes from '@/ultils/routes';
import { CircleCheck, User } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/vi';
import Link from 'next/link';
import { upperCaseFirst } from 'upper-case-first';
import Image from './image';
import MenuPost from './menu-post';
import { Button } from './ui/button';
import { generateTTR } from '@/ultils/app';
moment.locale('vi');

export interface IPostProps {
    data: IPost;
}

export default function Post({ data }: IPostProps) {
    const handleWriteHistory = async () => {
        await axiosConfig({ url: 'histories', method: 'POST', data: { post_id: data._id } });
    };

    return (
        <div className="border-2 border-[#e8e8e8] rounded-xl w-full p-5">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="/" />
                        <AvatarFallback>
                            <User size={16} />
                        </AvatarFallback>
                    </Avatar>

                    <span className="font-medium text-sm flex items-center gap-1">
                        <p>{data.user.fullname}</p>

                        {data.user.role === 'admin' && <CircleCheck size={14} className="text-[#1b74e4]" />}
                    </span>
                </div>

                <div className="">
                    <MenuPost data={data} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 mt-2 items-center">
                <div className="md:col-span-9 pr-5 flex flex-col gap-3">
                    <Link href={Routes.GENERATE_POST_URL(data)} onClick={() => handleWriteHistory()} className="line-clamp-2 font-medium text-[16px] hover:underline">
                        {data.title}
                    </Link>

                    <p className="line-clamp-2 text-sm">{data.preview_content}</p>

                    <div className="flex items-center text-sm gap-3">
                        <Link href={Routes.GENERATE_CATEGORY_URL(data.category)}>
                            <Button variant={'outline'} size={'sm'} className="rounded-full">
                                {data.category.name}
                            </Button>
                        </Link>

                        <span>{upperCaseFirst(moment(data.createdAt || '').fromNow())}</span>
                        <span>{generateTTR(data.ttr + '')}</span>
                    </div>
                </div>

                <div className="hidden md:block md:col-span-3 ">
                    <Image src={data.thumbnail} />
                </div>
            </div>
        </div>
    );
}
