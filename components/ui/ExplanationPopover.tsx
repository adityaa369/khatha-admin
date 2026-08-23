
import React from 'react';

export const ExplanationPopover = ({ title, meaning, technical }: { title: string, meaning: string, technical?: string }) => (
    <div className="group relative inline-block ml-2 cursor-help text-gray-400">
        ?
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg group-hover:block z-50">
            <p className="font-bold mb-1">What does this mean?</p>
            <p className="mb-2">{meaning}</p>
            {technical && (
                <>
                    <p className="font-bold mb-1 text-gray-400">Technical details</p>
                    <p className="text-gray-300 font-mono">{technical}</p>
                </>
            )}
        </div>
    </div>
);
