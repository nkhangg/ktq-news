import { Metadata } from 'next';
import { ReactNode } from 'react';

export interface IRootLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: `Đăng nhập | ${process.env.NEXT_PUBLIC_LOGO_NAME}`,
};

export default function RootLayout({ children }: IRootLayoutProps) {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="w-[450px]">{children}</div>
        </div>
    );
}
