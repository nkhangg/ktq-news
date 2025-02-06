import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';

export default function BoxAboutSession({
    children,
    title,
    icon,
}: {
    children: ReactNode;
    title: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}) {
    const ICon = icon;
    return (
        <div className="flex flex-col gap-2 rounded-lg p-8 shadow-border h-full items-center justify-center">
            <div className="text-xl font-bold text-center flex items-center gap-3">
                <span>{title}</span> <ICon />
            </div>

            <div className="text-lg text-center">{children}</div>
        </div>
    );
}
