
import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function SecurityCommandCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h1 className="text-2xl font-bold text-gray-900">Security Status</h1>
          <p className="text-sm font-medium text-green-700 mt-1">?? No active critical threats. The system is blocking attacks successfully.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Blocked Requests" 
            value="481" 
            status="🟢 Healthy"
            explanation="Malicious or abusive requests intercepted by the firewall and rate limiters."
          />
          <MetricCard 
            title="Suspicious Sessions" 
            value="2" 
            status="🟡 Attention"
            explanation="Sessions exhibiting elevated risk signals such as rapid IP changes."
          />
          <MetricCard 
            title="OTP Replay Attempts" 
            value="3" 
            status="🔴 Critical"
            explanation="Attempts to reuse a previously consumed OTP."
          />
        </div>

        {/* Actionable Intelligence */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What requires attention?</h2>
          <ul className="space-y-4">
             <li className="flex items-start">
               <span className="text-yellow-600 mr-2">??</span>
               <div>
                 <p className="font-medium text-gray-900">2 suspicious sessions</p>
                 <p className="text-sm text-gray-500">Detected unusual geographical movement.</p>
               </div>
             </li>
             <li className="flex items-start">
               <span className="text-red-600 mr-2">??</span>
               <div>
                 <p className="font-medium text-gray-900">1 repeated OTP attack</p>
                 <p className="text-sm text-gray-500">37 attempts from a single masked source IP.</p>
               </div>
             </li>
          </ul>
        </div>
        
        {/* Read Only Proof */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded text-sm mt-8">
          <strong>Security Operations Scope:</strong> This module is strictly observational. Administrative capabilities such as suspending accounts are governed by independent, highly-controlled operational workflows and are not available here.
        </div>
      </div>
    </div>
  );
}
