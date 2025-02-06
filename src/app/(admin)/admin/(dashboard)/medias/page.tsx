/* eslint-disable jsx-a11y/alt-text */
'use client';
import ModalCreateMedia from '@/components/admin/medias/modal-create-media';
import Image from '@/components/image';
import Loading from '@/components/loading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

export default function AdminMedias() {
    const [response, setResponse] = useState<IPaginateResponse<IMedia> | null>(null);

    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [open, setOpen] = useState(false);

    const { toast } = useToast();

    const getMedias = useCallback(async () => {
        const params: Record<string, unknown> = {};
        const acceptSorting = sorting.filter((item) => !item.desc);

        if (acceptSorting.length > 0) {
            params['sortField'] = acceptSorting[0].id;
        }

        if (currentPage) {
            params['page'] = currentPage;
        }

        if (search) {
            params['search'] = search;
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
    }, [sorting, currentPage, search]);

    const handleDelete = async (media: IMedia) => {
        try {
            setLoading(true);
            const { data } = await axios({
                url: 'admin/medias/' + media._id,
                method: 'DELETE',
                data: {
                    public_id: media.cloud_data.public_id,
                },
            });

            toast({
                title: 'Oops!',
                duration: 1000,
                description: data.message || '',
            });

            await getMedias();
        } catch (error) {
            toast({
                title: 'Oops!',
                duration: 1000,
                description: ((error as AxiosError).response?.data as Record<string, string>).message || 'Something Error',
            });
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnDef<IMedia>[] = [
        {
            accessorKey: 'cloud_data',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Image
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const { secure_url } = row.getValue('cloud_data') as ICLoudData;
                return (
                    <div className="w-fit">
                        <Image className="aspect-square w-[140px]" src={secure_url} />
                    </div>
                );
            },
        },
        {
            accessorKey: 'cloud_data_filename',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Filename
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const { original_filename } = row.getValue('cloud_data') as ICLoudData;
                return <div className="capitalize">{original_filename}</div>;
            },
        },
        {
            accessorKey: 'cloud_data_public_id',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Public Id
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const { public_id } = row.getValue('cloud_data') as ICLoudData;
                return <div className="capitalize">{public_id}</div>;
            },
        },
        {
            accessorKey: 'createdAt',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Created At
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                return <div className="capitalize">{moment(row.getValue('createdAt')).format('DD/MM/YYYY')}</div>;
            },
        },
        {
            accessorKey: 'updatedAt',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Updated At
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                return <div className="capitalize">{moment(row.getValue('updatedAt')).format('DD/MM/YYYY')}</div>;
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const media = row.original;

                return (
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(media._id)}>Copy ID</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(media.cloud_data.secure_url)}>Copy Url</DropdownMenuItem>
                                <DropdownMenuSeparator />

                                <AlertDialogTrigger className="w-full">
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure delete: {media.cloud_data.original_filename}?</AlertDialogTitle>
                                <div className="flex items-center justify-center">
                                    <Image className="h-auto max-w-full aspect-square" src={media.cloud_data.secure_url} />
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(media)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            },
        },
    ];

    const table = useReactTable({
        data: response?.data || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    useEffect(() => {
        getMedias();
    }, [getMedias]);

    return (
        <>
            <div className="w-full">
                <div className="flex items-center py-4 justify-between">
                    <Input
                        placeholder="Filter medias..."
                        onKeyDown={(event) => {
                            if (event.code === 'Enter') {
                                setSearch(event.currentTarget.value);
                            }
                        }}
                        className="max-w-sm"
                    />

                    <div
                        onClick={() => setOpen((prev) => !prev)}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                    >
                        <Plus /> Create
                    </div>
                </div>
                <div className="rounded-md border relative">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell, index) => (
                                            <TableCell className={cn('pl-6', {})} key={cell.id + index}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length || 1} className="h-24 text-center">
                                        No results. Sorting is disabled as there are no data rows.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {loading && (
                        <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full bg-[rgba(0,0,0,.2)]">
                            <Loading className="min-h-0" />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex items-center justify-between py-4 gap-2">
                        <div className="text-sm">
                            Page {response?.current_page} of {response?.last_page}
                        </div>
                        <div className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={!response?.has_prev_page}>
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => (response?.has_next_page ? prev + 1 : prev))}
                                disabled={!response?.has_next_page}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalCreateMedia onCreated={() => getMedias()} setOpen={setOpen} open={open} />
        </>
    );
}
