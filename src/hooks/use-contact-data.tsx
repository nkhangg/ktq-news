import Constant from '@/constants';
import { getContactData } from '@/ultils/data-fn';
import { useCallback, useEffect, useState } from 'react';

export default function useContactData() {
    const [result, setResult] = useState<Record<string, string>>({
        primaryEmail: '',
        contactEmail: '',
    });

    const getData = useCallback(async () => {
        const data = await getContactData();

        if (data) {
            const primaryEmail = (Constant.getPrimaryEmail(data)?.value as string) || '';
            const contactEmail = (Constant.getContactEmail(data)?.value as string) || '';

            setResult({
                primaryEmail,
                contactEmail,
            });
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return result;
}
