import React from 'react';
import { StatusLevel } from '@/types';

export const StatusBadge = ({ status, text }: { status: StatusLevel, text?: string }) => {
    let color = 'bg-gray-100 text-gray-800';
    if (status.includes('🟢')) color = 'bg-green-100 text-green-800';
    if (status.includes('🟡')) color = 'bg-yellow-100 text-yellow-800';
    if (status.includes('🟠')) color = 'bg-orange-100 text-orange-800';
    if (status.includes('🔴')) color = 'bg-red-100 text-red-800';
    
    return (
        <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + color}>
            {status} {text}
        </span>
    );
};
