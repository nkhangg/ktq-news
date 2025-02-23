import axios from '@/lib/axios';
import Routes from '@/ultils/routes';
import { Link2 } from 'lucide-react';
import Link from 'next/link';

export interface ISearchItemProps {
    data: IPost;
    onClicked?: () => void;
}

export default function SearchItem({ data, onClicked }: ISearchItemProps) {
    const updateSearchCount = async () => {
        await axios({
            url: 'search-histories',
            data: { post_id: data.id },
            method: 'POST',
        });
    };

    return (
        <div className="hover:bg-gray-100 py-2 px-2 text-sm rounded-sm w-full">
            <Link
                onClick={() => {
                    updateSearchCount();

                    if (onClicked) onClicked();
                }}
                href={`${Routes.POSTS}/?search=${data.slug}`}
                className="flex items-center gap-2 "
            >
                <Link2 size={18} />

                <span className="w-[450px] block truncate">{data.title}</span>
            </Link>
        </div>
    );
}
