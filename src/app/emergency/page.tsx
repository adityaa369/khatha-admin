
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';

export default function EmergencyCommandCenter() {
  const isFrozen = false; // Simulated state

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-red-900 rounded-lg shadow p-6 text-white">
          <h1 className="text-3xl font-bold tracking-tight">EMERGENCY CONTROLS</h1>
          <p className="mt-2 text-red-200">Financial Kill Switch and Critical Outage Management</p>
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">FINANCIAL OPERATIONS</h2>
              <p className="text-sm text-green-700 font-bold mt-1">?? ACTIVE</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Kill Switch</span>
              <p className="text-2xl font-bold font-mono">OFF</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-sm font-medium border-t pt-4">
            <div>Loans <span className="text-green-700 ml-2">?? Processing</span></div>
            <div>Payments <span className="text-green-700 ml-2">?? Processing</span></div>
            <div>Auctions <span className="text-green-700 ml-2">?? Processing</span></div>
            <div>Reconciliation <span className="text-green-700 ml-2">?? Balanced</span></div>
          </div>
        </div>

        {/* Warning Indicator */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
           <h3 className="font-bold text-red-800 text-lg flex items-center">
             ?? FINANCIAL OPERATIONS AT RISK
           </h3>
           <p className="text-red-700 mt-2">3 critical reconciliation incidents detected in the last 5 minutes.</p>
           <p className="text-sm font-medium text-red-900 mt-4">Recommended action: <span className="font-bold bg-red-200 px-2 py-1 rounded">FREEZE FINANCIAL MUTATIONS</span></p>
        </div>

        {/* Activation Workflow */}
        {!isFrozen && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-300">
            <h2 className="text-lg font-bold text-gray-900 mb-2 border-b pb-2">Activate Kill Switch</h2>
            <p className="text-sm text-gray-600 mb-6">Freezing financial operations will prevent new financial mutations from being processed. Existing financial records remain available for viewing.</p>
            
            <div className="grid grid-cols-2 gap-8 text-sm mb-6 bg-gray-50 p-4 rounded">
              <div>
                <strong className="text-red-700 block mb-2">WILL STOP</strong>
                <ul className="space-y-1 text-gray-600">
                  <li>?? Loan payments & creation</li>
                  <li>?? Chit financial mutations</li>
                  <li>?? Bidding mutations</li>
                </ul>
              </div>
              <div>
                <strong className="text-green-700 block mb-2">WILL REMAIN AVAILABLE</strong>
                <ul className="space-y-1 text-gray-600">
                  <li>?? Login & Customer Profiles</li>
                  <li>?? Reconciliation & Security</li>
                  <li>?? Admin panel access</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Step 1 � Reason</label>
                <input type="text" className="w-full border rounded p-2 text-sm" placeholder="Why are you freezing financial operations?" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-red-600" />
                <label className="text-sm text-gray-700 font-medium">Step 2 � I understand that financial mutations will be rejected.</label>
              </div>
              <div className="pt-4 flex justify-end space-x-4">
                <button className="px-4 py-2 text-gray-600 text-sm font-medium">Cancel</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded text-sm font-bold shadow hover:bg-red-700 flex items-center">
                  <span className="mr-2">??</span> FREEZE FINANCIAL OPERATIONS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pre-flight Restoration Readiness (Hidden in UI unless frozen, but built for architecture) */}
        {isFrozen && (
          <div className="bg-white rounded-lg shadow p-6">
             <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">RESTORATION READINESS</h2>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between"><span>Reconciliation</span><StatusBadge status="?? Healthy" text="PASS" /></div>
               <div className="flex justify-between"><span>Critical incidents</span><span className="font-bold">0</span></div>
               <div className="flex justify-between"><span>MongoDB</span><StatusBadge status="?? Healthy" text="Healthy" /></div>
             </div>
             <button className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded text-sm font-bold shadow hover:bg-green-700">
               RESTORE FINANCIAL OPERATIONS
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
