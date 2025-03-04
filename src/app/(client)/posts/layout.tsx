import Constant from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export interface IPostsLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: `Bài viết | ${process.env.LOGO_NAME}`,
    description: Constant.DESCRIPTION,
    // alternates: {
    //     canonical: `${process.env.NEXT_PUBLIC_SITE_URL}${Routes.POSTS}`,
    // },
    // robots: {
    //     index: false,
    //     follow: true,
    // },
};

export default function PostsLayout({ children }: IPostsLayoutProps) {
    return <>{children}</>;
}
