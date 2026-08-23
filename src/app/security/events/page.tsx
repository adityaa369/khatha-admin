
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';

export default function SecurityEventExplorer() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Security Event Explorer</h1>
        
        {/* Event Detail Example */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500 font-mono mb-1">EVENT #SEC-8291</p>
              <h2 className="text-xl font-bold text-red-700">OTP_REPLAY</h2>
            </div>
            <StatusBadge status="🔴 Critical" text="BLOCKED" />
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div><span className="block text-sm text-gray-500">Customer</span><span className="font-mono font-medium">����8291</span></div>
            <div><span className="block text-sm text-gray-500">Operation</span><span className="font-medium">Loan Payment</span></div>
            <div><span className="block text-sm text-gray-500">Resource</span><span className="font-mono font-medium">KH-10293</span></div>
            <div><span className="block text-sm text-gray-500">Timestamp</span><span className="font-medium">14:31:42 TODAY</span></div>
          </div>
          
          {/* Attack Chain */}
          <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
             <h3 className="font-bold text-gray-900 mb-2 border-b pb-2">Investigation Chain</h3>
             <div className="flex justify-between"><span className="text-sm">AUTHENTICATION</span><span className="text-sm text-green-700">? JWT valid</span></div>
             <div className="flex justify-between"><span className="text-sm">AUTHORIZATION</span><span className="text-sm text-green-700">? User authenticated</span></div>
             <div className="flex justify-between"><span className="text-sm font-bold text-red-700">OTP</span><span className="text-sm font-bold text-red-700">? Replay detected</span></div>
             <div className="flex justify-between"><span className="text-sm">RATE LIMIT</span><span className="text-sm text-green-700">? Within limit</span></div>
             <div className="border-t pt-2 mt-2 flex justify-between items-center">
               <span className="font-bold text-gray-900 flex items-center">
                 FINANCIAL MUTATION
                 <ExplanationPopover title="Financial Impact" meaning="Indicates if the attacker successfully reached the financial processing controllers before being stopped." />
               </span>
               <span className="font-bold bg-green-100 text-green-800 px-2 py-1 rounded">NOT EXECUTED</span>
             </div>
          </div>
        </div>
        
        {/* Risk Signals */}
        <div className="bg-white rounded-lg shadow p-6 mt-6 border-l-4 border-yellow-500">
           <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
             Risk Signals
             <ExplanationPopover title="Security Risk Score" meaning="This score identifies unusual security behavior as an operational signal. It does not establish definitive fraud." />
           </h2>
           <p className="text-sm text-gray-600 mb-4">Customer ����8291 exhibits Elevated Risk.</p>
           <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
             <li>4 failed OTP attempts (+30)</li>
             <li>New device detected (+15)</li>
           </ul>
        </div>
      </div>
    </div>
  );
}
