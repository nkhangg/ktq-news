import Constant from '@/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export interface IPostsLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: `Bài viết | ${process.env.LOGO_NAME}`,
    description: Constant.DESCRIPTION,
};

export default function PostsLayout({ children }: IPostsLayoutProps) {
    return <>{children}</>;
}
