export const dynamic = 'force-dynamic';
import { Footer, Header } from '@/components/common';
import { Button } from '@/components/ui/button';
import Routes from '@/ultils/routes';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col">
                <Header />
                <main className="w-full max-w-full items-center justify-center flex-col flex">
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full text-center">
                        <h1 className="text-4xl font-bold ">Oops! Trang không tồn tại 😢</h1>
                        <p className="text-lg mt-2 text-gray-600 font-medium">Rất tiếc, chúng tôi không tìm thấy trang bạn yêu cầu.</p>
                        <Link href={Routes.HOME} className="mt-4 text-blue-500 hover:underline">
                            <Button variant={'link'}>
                                Quay về trang chủ <ArrowRight />
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
