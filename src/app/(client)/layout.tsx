import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Trang chủ | ${process.env.LOGO_NAME}`,
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-full min-h-screen flex flex-col justify-between">
            <div className="flex flex-col">
                <main className="w-full max-w-full items-center justify-center px-5 flex-col flex">
                    <div className="w-full max-w-7xl py-5">{children}</div>
                </main>
            </div>
        </div>
    );
}
