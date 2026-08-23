
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';

export default function ChitDetail() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CHIT #CH-182</h1>
              <p className="text-sm text-gray-500">Cycle 7 / 20</p>
            </div>
            <div className="flex space-x-2 items-center">
              <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded text-sm font-medium border border-blue-200 shadow-sm hover:bg-blue-100 transition-colors">
                ?? Explain This Chit
              </button>
              <StatusBadge status="🟢 Healthy" text="ACTIVE" />
            </div>
          </div>
          <div className="flex space-x-8 text-sm">
            <div><span className="text-gray-500 block">Pot Value</span><span className="font-bold text-lg">?1,00,000</span></div>
            <div><span className="text-gray-500 block">Members</span><span className="font-bold text-lg">20</span></div>
          </div>
        </div>

        {/* State Mismatch Monitor */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Auction State Synchronization</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Live Socket Stream</p>
                <p className="text-2xl font-mono mt-1">?42,000</p>
                <p className="text-xs text-gray-400">14:31:52</p>
              </div>
              <div className="text-center">
                <StatusBadge status="🟢 Healthy" text="STATE MATCH: YES" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center justify-end">
                  Database State
                  <ExplanationPopover title="Database State" meaning="The immutable, authoritative value saved in MongoDB. If the socket disagrees with this, the socket is desynced." />
                </p>
                <p className="text-2xl font-mono mt-1 text-green-700">?42,000</p>
                <p className="text-xs font-medium text-green-700 bg-green-50 rounded px-2 py-1 mt-1 inline-block">Authoritative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dividend Math Explanation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Dividend Breakdown (Cycle 7)</h2>
          <div className="font-mono text-sm space-y-2 bg-gray-50 p-4 rounded border">
            <div className="flex justify-between"><span>POT</span><span>?1,00,000</span></div>
            <div className="flex justify-between text-red-600"><span>- WINNING DISCOUNT</span><span>?42,000</span></div>
            <div className="flex justify-between text-red-600"><span>- COMMISSION</span><span>?5,000</span></div>
            <div className="border-b my-2"></div>
            <div className="flex justify-between font-bold text-green-700"><span>AVAILABLE DIVIDEND</span><span>?53,000</span></div>
            
            <div className="mt-6 pt-4 border-t">
              <p className="text-gray-600 mb-2 font-sans">Khatha uses integer paise allocation so no fractional money disappears.</p>
              <div className="flex justify-between"><span>Eligible Members</span><span>20</span></div>
              <div className="flex justify-between"><span>?53,000 � 20</span><span>?2,650 / member</span></div>
            </div>
          </div>
        </div>

        {/* Read Only Proof */}
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm flex justify-between items-center">
          <div>
            <strong>Operational Rule Enforced:</strong> The Admin is an observer plane. There are no controls to mutate auction bids, declare winners, or modify financial states.
          </div>
          <StatusBadge status="🟢 Healthy" text="READ-ONLY MODE" />
        </div>
      </div>
    </div>
  );
}
