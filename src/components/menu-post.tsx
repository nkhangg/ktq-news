'use client';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard, generateCoppyLink } from '@/ultils/app';
import { BugIcon, Ellipsis, LinkIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';
import FeedbackContentModal from './posts/detail/feedback-content-modal';

export interface IMenuPostProps {
    data: IPost;
}

export default function MenuPost({ data }: IMenuPostProps) {
    const { toast } = useToast();

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-full">
                        <Ellipsis />
                    </span>
                </PopoverTrigger>
                <PopoverContent className="p-0 md:max-w-[240px]">
                    <ul>
                        <li
                            onClick={() => {
                                {
                                    const url = generateCoppyLink(data);
                                    copyToClipboard(url, () => {
                                        toast({
                                            title: 'Sao chép thành công !',
                                            description: 'Đã sao chép ' + url,
                                            duration: 1000,
                                        });
                                    });
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
                        >
                            <LinkIcon size={14} />
                            <span className="text-sm">Sao chép liên kết</span>
                        </li>
                        <li
                            onClick={() => {
                                setOpenModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
                        >
                            <BugIcon size={14} />
                            <span className="text-sm">Báo cáo chỉnh sửa nội dung</span>
                        </li>
                    </ul>
                </PopoverContent>
            </Popover>

            <FeedbackContentModal open={openModal} setOpen={setOpenModal} data={data} />
        </>
    );
}
