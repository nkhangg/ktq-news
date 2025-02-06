'use client';
import MenuPost from '@/components/menu-post';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateTTR } from '@/ultils/app';
import { Dot, User } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useState } from 'react';

moment.locale('vi');

export default function AuthorSession(props: { data: IPost }) {
    const [data, setData] = useState(props.data);
    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return (
        <div className="py-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="/" />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>

                <div className="">
                    <span className="font-medium">{data.user.fullname || ''}</span>

                    <div className="flex items-center gap-[2px] text-sm">
                        <span>{moment(data.createdAt).fromNow()}</span>
                        <span>
                            <Dot />
                        </span>
                        <span>{generateTTR(data.ttr + '')}</span>
                    </div>
                </div>
            </div>

            <div className="">
                <MenuPost data={data} />
            </div>
        </div>
    );
}
