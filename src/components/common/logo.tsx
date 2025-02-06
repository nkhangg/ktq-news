'use client';
import { cn } from '@/lib/utils';
import Routes from '@/ultils/routes';
import { Exo_2 } from 'next/font/google';
import Link from 'next/link';
import * as React from 'react';

const exo2 = Exo_2({
    subsets: ['latin'],
});

export default function Logo({ dark = false, admin = false }: { dark?: boolean; admin?: boolean }) {
    return (
        <Link href={!admin ? Routes.HOME : Routes.DASHBOARD}>
            <span
                className={cn(exo2.className, 'font-semibold text-3xl', {
                    ['text-white']: dark,
                })}
            >
                KTQ news
            </span>
        </Link>
    );
}
