'use client';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
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
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
});

export default function AdminCategories() {
    const [response, setResponse] = useState<IPaginateResponse<ICategory> | null>(null);

    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [mode, setMode] = useState<ICategory | null>(null);
    const [open, setOpen] = useState(false);

    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(categorySchema),
    });

    const getCategories = useCallback(async () => {
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
            url: 'admin/categories',
            params,
        });

        if (data) {
            setResponse(data);
        }

        reset({ name: '', slug: '', description: '' });
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting, currentPage, search]);

    const createCategory = async (values: FieldValues) => {
        try {
            const { data } = await axios({
                url: 'admin/categories',
                data: values,
                method: 'POST',
            });

            toast({
                title: 'Oops!',
                description: data.message || '',
            });

            setOpen(false);

            getCategories();
        } catch (error) {
            toast({
                title: 'Oops!',
                description: ((error as AxiosError).response?.data as Record<string, string>).message || 'Something Error',
            });
        }
    };

    const updateCategory = async (_id: ICategory['_id'], values: FieldValues) => {
        try {
            const { data } = await axios({
                url: 'admin/categories/' + _id,
                data: values,
                method: 'POST',
            });

            toast({
                title: 'Oops!',
                description: data.message || '',
            });

            setOpen(false);

            getCategories();
        } catch (error) {
            toast({
                title: 'Oops!',
                description: ((error as AxiosError).response?.data as Record<string, string>).message || 'Something Error',
            });
        }
    };

    const handleDelete = async (category: ICategory) => {
        try {
            setLoading(true);
            const { data } = await axios({
                url: 'admin/categories/' + category._id,
                method: 'DELETE',
                data: {
                    id: category._id,
                },
            });

            toast({
                title: 'Oops!',
                duration: 1000,
                description: data.message || '',
            });

            await getCategories();
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

    const columns: ColumnDef<ICategory>[] = [
        {
            accessorKey: 'name',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Name
                    <ArrowUpDown />
                    {}
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'slug',
            header: ({ column, table }) => (
                <Button variant="ghost" onClick={table.getRowModel().rows?.length ? () => column.toggleSorting(column.getIsSorted() === 'asc') : undefined}>
                    Slug
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue('slug')}</div>,
        },
        {
            accessorKey: 'description',
            header: () => <Button variant="ghost">Description</Button>,
            cell: ({ row }) => <div className="lowercase">{row.getValue('description')}</div>,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const category = row.original;

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
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category._id)}>Copy category ID</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DialogTrigger
                                    onClick={() => {
                                        reset(category);
                                        setMode(category);
                                    }}
                                    className="w-full"
                                >
                                    <DropdownMenuItem>Edit category</DropdownMenuItem>
                                </DialogTrigger>

                                <AlertDialogTrigger className="w-full">
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure delete: {category.name}?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(category)}>Delete</AlertDialogAction>
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
        getCategories();
    }, [getCategories]);

    return (
        <Dialog
            onOpenChange={(open) => {
                setOpen(open);

                if (!open) {
                    reset({ name: '', slug: '', description: '' });
                }
            }}
            open={open}
        >
            <div className="w-full">
                <div className="flex items-center py-4 justify-between">
                    <Input
                        placeholder="Filter categories..."
                        onKeyDown={(event) => {
                            if (event.code === 'Enter') {
                                setSearch(event.currentTarget.value);
                            }
                        }}
                        className="max-w-sm"
                    />

                    <DialogTrigger
                        onClick={() => {
                            setMode(null);
                        }}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                    >
                        <Plus /> Create
                    </DialogTrigger>
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
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell className="pl-6" key={cell.id}>
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
                    <DialogTitle>{'Category: ' + getValues('name')}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(async (values) => {
                        if (mode === null) {
                            await createCategory(values);
                        } else {
                            await updateCategory(mode._id, values);
                        }
                    })}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <Input {...register('name')} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Slug</Label>
                        <Input {...register('slug')} />
                        {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message as string}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Description</Label>
                        <Textarea {...register('description')} />
                    </div>

                    <Button type="submit" className="mt-4">
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
