import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import Routes from '@/ultils/routes';
import Link from 'next/link';
import { Suspense } from 'react';
import Logo from '../logo';
import Menu from './menu';
import SearchHeader from './search-header';

export default async function Header() {
    return (
        <header className="w-full sticky shadow-sm bg-white z-50 top-0 max-w-full flex items-center justify-center px-5">
            <div className="w-full max-w-7xl py-5 flex items-center justify-between">
                <div className="flex items-end gap-4">
                    <Logo />

                    <nav className="hidden lg:flex items-end gap-7 ml-2">
                        {Routes.MENUS.map((item) => {
                            return (
                                <Link key={item.title} href={item.link}>
                                    <Button variant={'link'} className="truncate py-0">
                                        {item.title}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <SearchHeader />

                    <Suspense fallback={<Loading />}>
                        <Menu />
                    </Suspense>
                </div>
            </div>
        </header>
    );
}
