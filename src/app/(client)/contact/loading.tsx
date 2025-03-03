import Loading from '@/components/loading';
import * as React from 'react';

export default function LoadingPage() {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <Loading />
        </div>
    );
}
