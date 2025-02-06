/* eslint-disable @next/next/no-img-element */
'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface IImageProps {
    src: string;
    className?: string;
}

export default function Image({ src, className }: IImageProps) {
    const [fallback, setFallback] = useState<string | null>(null);

    return (
        <div
            className={cn('relative w-full rounded-xl h-32 overflow-hidden', {
                ['border-2 border-gray-400']: fallback,
                [className || '']: !!className,
            })}
        >
            <img
                className={cn('object-cover w-full h-full', {})}
                src={fallback || src}
                alt={src}
                loading="lazy"
                onError={() => {
                    setFallback('/placeholder-image.jpg');
                }}
            />
        </div>
    );
}
