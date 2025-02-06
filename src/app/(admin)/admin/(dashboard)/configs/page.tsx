'use client';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { isValidJSONObject } from '@/ultils/app';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

const configSchema = z.object({
    value: z.string().min(1, 'Name is required'),
    key: z.string().min(1, 'Key name is required'),
});

export default function AdminConfigs() {
    const [response, setResponse] = useState<IPaginateResponse<IConfig> | null>(null);

    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [data, setData] = useState<IConfig | null>(null);

    const [open, setOpen] = useState(false);

    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(configSchema),
    });

    const getConfigs = useCallback(async () => {
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
            url: 'admin/configs',
            params,
        });

        if (data) {
            setResponse(data);
        }

        setLoading(false);
    }, [sorting, currentPage, search]);

    const update = useCallback(
        async (config: IConfig, values: FieldValues) => {
            try {
                setLoading(true);
                const { data } = await axios({
                    url: 'admin/configs/' + config._id,
                    data: { key: values.key, value: isValidJSONObject(values.value) ? JSON.parse(values.value) : values.value },
                    method: 'POST',
                });

                if (data) {
                    setResponse(data);

                    toast({
                        title: 'Oops!',
                        description: data.message || '',
                    });

                    setOpen(false);

                    await getConfigs();
                }
            } catch (error) {
                toast({
                    title: 'Oops!',
                    description: ((error as AxiosError).response?.data as Record<string, string>).message || 'Something Error',
                });
            } finally {
                setLoading(false);
            }
        },
        [getConfigs, toast],
    );

    const columns: ColumnDef<IConfig>[] = [
        {
            accessorKey: 'key',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Key
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                return <div>{row.getValue('key')}</div>;
            },
        },
        {
            accessorKey: 'value',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Value
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                return <div>{JSON.stringify(row.getValue('value'))}</div>;
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
                const config = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(config._id)}>Copy ID</DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DialogTrigger
                                className="w-full"
                                onClick={() => {
                                    setData(config);
                                    reset({ ...config, value: typeof config.value === 'object' ? JSON.stringify(config.value) : config.value });
                                }}
                            >
                                <DropdownMenuItem className="w-full">Edit</DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
        getConfigs();
    }, [getConfigs]);

    return (
        <Dialog
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    reset({ key: '', value: '' });
                    setData(null);
                }
            }}
            open={open}
        >
            <div className="w-full">
                <div className="flex items-center py-4 justify-between">
                    <Input
                        placeholder="Filter configs..."
                        onKeyDown={(event) => {
                            if (event.code === 'Enter') {
                                setSearch(event.currentTarget.value);
                            }
                        }}
                        className="max-w-sm"
                    />
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{'Config'}</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(async (values) => {
                        if (!data) return;

                        await update(data, values);
                    })}
                >
                    {data && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Key</Label>
                                <Input {...register('key')} />
                                {errors.key && <p className="text-red-500 text-sm">{errors.key.message as string}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Value</Label>
                                <Textarea rows={8} {...register('value')} />
                                {errors.value && <p className="text-red-500 text-sm">{errors.value.message as string}</p>}
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full mt-4">
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
