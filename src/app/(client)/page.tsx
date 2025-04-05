'use client';
import { useAuthenticationFn } from '@/modules/authentication/hooks';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const { me, logout } = useAuthenticationFn();

    const router = useRouter();

    const [data, setData] = useState<null | IUser>(null);

    useEffect(() => {
        (async () => {
            const result = await me();

            if (result) {
                setData(result);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h1 className="text-red">This is home {data?.email}</h1>

            <Button onClick={() => logout(() => router.push('/login'))}>Logout</Button>
        </>
    );
}
