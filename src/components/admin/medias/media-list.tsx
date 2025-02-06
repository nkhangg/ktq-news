/* eslint-disable jsx-a11y/alt-text */
import Image from '@/components/image';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import axios from '@/lib/axios';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function MediaList() {
    const [response, setResponse] = useState<IPaginateResponse<IMedia> | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [open, setOpen] = useState(false);

    const [value, setValue] = useState('');

    const [search] = useDebounce(value, 800);

    const getMedias = useCallback(async () => {
        const params: Record<string, unknown> = { limit: 15 };

        if (search) {
            params['search'] = search;
        }

        if (currentPage) {
            params['page'] = currentPage;
        }

        setLoading(true);
        const { data } = await axios({
            url: 'admin/medias',
            params,
        });

        if (data) {
            setResponse(data);
        }

        setLoading(false);
    }, [search, currentPage]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key.toLowerCase() === 'm') {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        getMedias();
    }, [getMedias]);

    return (
        <Sheet onOpenChange={setOpen} open={open}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Media list</SheetTitle>
                    <SheetDescription>All image in system</SheetDescription>
                </SheetHeader>
                {loading && (
                    <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full z-10 bg-[rgba(0,0,0,.2)]">
                        <Loading />
                    </div>
                )}
                <div className="mb-4 flex items-center justify-between mt-5 gap-5">
                    <Input value={value} onChange={(e) => setValue(e.target.value)} className="max-w-[340px]" placeholder="Search..." />

                    <div className="space-x-2 flex items-center ">
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={!response?.has_prev_page}>
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((prev) => (response?.has_next_page ? prev + 1 : prev))}
                            disabled={!response?.has_next_page}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-5">
                    {response?.data &&
                        response?.data.length > 0 &&
                        response.data.map((item) => {
                            return (
                                <div key={item._id} className="flex items-center justify-between relative w-full aspect-square">
                                    <Image src={item.cloud_data.secure_url} className="w-full h-full min-h-0" />

                                    <div className="absolute inset-0 w-full h-full flex justify-center items-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 ">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.cloud_data.secure_url)}>Copy URL</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        })}

                    {response?.data && response?.data.length <= 0 && (
                        <div className="flex items-center justify-center w-full col-span-12">
                            <p className="text-sm font-medium">No result</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
