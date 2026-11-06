"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { href: '/', label: 'Operations Overview', badge: 'Live' },
    { href: '/customers', label: 'Users & Accounts' },
    { href: '/financial', label: 'Financial Command' },
    { href: '/financial/loans', label: 'Credits & Agreements' },
    { href: '/financial/transactions', label: 'Repayments & Ledger' },
    { href: '/reconciliation', label: 'Reconciliation Center' },
    { href: '/security', label: 'Security Telemetry' },
    { href: '/investigation', label: 'Forensic Investigation' },
    { href: '/infrastructure', label: 'Infrastructure & Health' },
    { href: '/administration', label: 'Admins & Audit Trail' },
    { href: '/readiness', label: 'Play Store Readiness' },
    { href: '/emergency', label: 'Emergency Kill Switch', danger: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Persistent Left Sidebar */}
            <aside className="w-full lg:w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-800">
                <div>
                    <div className="p-5 border-b border-gray-800 flex items-center justify-between lg:justify-start space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-extrabold text-white text-sm tracking-tight">
                            HC
                        </div>
                        <div>
                            <div className="font-bold text-base tracking-tight text-white">HandCredit Ops</div>
                            <div className="text-[11px] text-emerald-400 font-mono">PRODUCTION CONTROL PLANE</div>
                        </div>
                    </div>

                    <nav className="p-3 space-y-1 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
                        {NAV_ITEMS.map((item) => {
                            const isActive =
                                item.href === '/'
                                    ? pathname === '/'
                                    : pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ' +
                                        (isActive
                                            ? item.danger
                                                ? 'bg-red-600 text-white'
                                                : 'bg-emerald-600 text-white'
                                            : item.danger
                                              ? 'text-red-400 hover:bg-red-950/50 hover:text-red-300'
                                              : 'text-gray-300 hover:bg-gray-800 hover:text-white')
                                    }
                                >
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 font-mono">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-800 flex lg:flex-col items-center lg:items-stretch justify-between gap-2">
                    <div className="text-[11px] text-gray-400 font-mono truncate">
                        Zero-Trust RBAC Active
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors text-center"
                    >
                        Sign Out Operator
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">{children}</main>
        </div>
    );
}
