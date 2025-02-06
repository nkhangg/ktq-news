import { ReactNode } from 'react';
import { Label } from './ui/label';

export interface IInputLabelProps {
    label: string;
    children: ReactNode;
}

export default function InputLabel({ label, children }: IInputLabelProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>{label}</Label>
            {children}
        </div>
    );
}
