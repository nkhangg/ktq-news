'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from '@/lib/axios';
import { Search as SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchItem from './search-item';
import Loading from '@/components/loading';

export default function SearchHeader() {
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState<null | string>(null);
    const [value] = useDebounce(search, 800);
    const [searchHistories, setSearchHistories] = useState<ISearchHistory[]>([]);

    const [loading, setLoading] = useState(false);

    const [searchSuggests, setSearchSuggests] = useState<IPost[]>([]);

    const getSearchHistories = async () => {
        const { data } = await axios({
            url: 'search-histories',
            params: {
                limit: 4,
            },
        });

        if (data && data?.data) setSearchHistories(data.data);
    };

    const getSearchSuggests = useCallback(async () => {
        setLoading(true);

        if (!value) {
            setSearchSuggests([]);
            setLoading(false);
            return;
        }
        const { data } = await axios({
            url: 'posts',
            params: {
                search: value,
            },
        });
        setLoading(false);
        if (data) setSearchSuggests(data.data);
    }, [value]);

    useEffect(() => {
        getSearchHistories();
    }, []);

    useEffect(() => {
        getSearchSuggests();
    }, [getSearchSuggests]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-full w-8 h-8">
                    <SearchIcon />
                </span>
            </DialogTrigger>
            <DialogContent className="p-0 gap-0">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between px-[12px] py-3 border-b border-gray-400 gap-2">
                        <SearchIcon size={18} />

                        <input
                            value={search || ''}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            className="outline-none border-none w-full h-full text-sm"
                            type="text"
                            placeholder="Tìm kiếm..."
                        />
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="w-full h-[236px] p-2">
                    <div className="w-full flex flex-col gap-3">
                        {value && value.length && (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-[#757575]">Gợi ý</span>

                                {!loading ? (
                                    searchSuggests.length > 0 ? (
                                        <ul className="flex flex-col gap-2">
                                            {searchSuggests.map((post) => {
                                                return (
                                                    <li className="" key={post.id}>
                                                        <SearchItem onClicked={() => setOpen(false)} data={post} />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="w-full flex items-center justify-center">
                                            <span className="text-sm">Không có kết quả</span>
                                        </div>
                                    )
                                ) : (
                                    <Loading className="min-h-0" size="w-4 h-4" />
                                )}
                            </div>
                        )}

                        {searchHistories.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-[#757575]">Tìm kiếm nhiều nhất</span>
                                <ul className="flex flex-col gap-2">
                                    {searchHistories.map((item) => {
                                        return (
                                            <li className="" key={item.id}>
                                                <SearchItem onClicked={() => setOpen(false)} data={item.post} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
