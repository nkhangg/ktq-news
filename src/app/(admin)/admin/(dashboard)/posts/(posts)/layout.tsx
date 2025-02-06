'use client';
import MediaList from '@/components/admin/medias/media-list';
import { ReactNode, Suspense } from 'react';

export interface ILayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
    return (
        <>
            <Suspense>
                {children}
                <MediaList />
            </Suspense>
        </>
    );
}
