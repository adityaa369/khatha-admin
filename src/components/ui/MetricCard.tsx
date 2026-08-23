
import React from 'react';
import { StatusBadge } from './StatusBadge';
import { ExplanationPopover } from './ExplanationPopover';
import { StatusLevel } from '@/types';

export const MetricCard = ({ title, value, status, explanation, technical }: { title: string, value: string, status?: StatusLevel, explanation?: string, technical?: string }) => (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-500">
                {title}
                {explanation && <ExplanationPopover title={title} meaning={explanation} technical={technical} />}
            </h3>
            {status && <StatusBadge status={status} />}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
);
