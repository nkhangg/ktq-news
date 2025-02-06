'use client';
import { Logo } from '@/components/common';
import { Button } from '@/components/ui/button';
import Routes from '@/ultils/routes';
import Link from 'next/link';
import { ReactNode, useEffect, useRef, useState } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    const navParent = useRef<HTMLDivElement>(null);

    const [widthNav, setWidthNav] = useState(500);

    useEffect(() => {
        if (!navParent.current) return;
        const { width } = navParent.current.getBoundingClientRect();

        setWidthNav(width);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navParent.current]);
    return (
        <div className="grid grid-cols-12 min-h-[1000px] ">
            <div ref={navParent} className="col-span-2 h-full relative">
                <div style={{ width: widthNav + 'px' }} className="fixed top-0 bottom-0 left-0 border-r border-gray-400 h-screen p-5">
                    <Logo admin />

                    <div className="py-10  flex flex-col gap-3 bg-white">
                        {Routes.ADMIN_MENU.map((item) => {
                            return (
                                <Link href={item.link} key={item.title}>
                                    <Button variant={'default'} className="text-white w-full">
                                        {item.title}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="col-span-10 h-full p-5">{children}</div>
        </div>
    );
}
