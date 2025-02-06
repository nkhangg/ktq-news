import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Logo from '../logo';
import Routes from '@/ultils/routes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getCategories() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, { cache: 'force-cache', next: { revalidate: 300 } });
    return await data.json();
}

export default async function Menu() {
    const data: ICategory[] = (await getCategories()) || [];

    return (
        <Sheet>
            <SheetTrigger className="border border-gray-400 rounded-full">
                <span className="h-8 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground px-8 border border-gray-400 rounded-full">
                    Menu
                </span>
            </SheetTrigger>
            <SheetContent side={'left'}>
                <SheetHeader>
                    <SheetTitle>
                        <Logo />
                    </SheetTitle>
                </SheetHeader>

                <ul className="flex gap-1 flex-col mt-4">
                    {Routes.MENUS.map((item) => {
                        return (
                            <li key={item.title} className="hover:underline">
                                <Link href={item.link}>{item.title}</Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-8">
                    <span className="text-lg font-semibold ">Chủ đề</span>

                    <ul className="flex flex-wrap gap-3 mt-4 items-center">
                        {data.map((item) => {
                            return (
                                <li key={item._id}>
                                    <Link href={Routes.GENERATE_CATEGORY_URL(item)}>
                                        <Button variant={'outline'} size={'sm'}>
                                            {item.name}
                                        </Button>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </SheetContent>
        </Sheet>
    );
}
