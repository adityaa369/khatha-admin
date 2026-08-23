
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';

export default function CustomerDetail() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Customer 360 Header */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-mono mb-1">CUSTOMER #KH-82931</p>
              <h1 className="text-2xl font-bold text-gray-900">Aditya A. (����8291)</h1>
              <div className="mt-2 flex space-x-2">
                <StatusBadge status="🟢 Healthy" text="ACTIVE" />
                <StatusBadge status="🟢 Healthy" text="KYC VERIFIED" />
              </div>
            </div>
            <div className="text-right flex space-x-4">
              <div><span className="text-gray-500 block text-sm">Loans</span><span className="font-bold text-lg">6</span></div>
              <div><span className="text-gray-500 block text-sm">Chits</span><span className="font-bold text-lg">3</span></div>
              <div><span className="text-gray-500 block text-sm">Payments</span><span className="font-bold text-lg">28</span></div>
            </div>
          </div>
        </div>

        {/* KYC Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            KYC Identity
            <ExplanationPopover title="KYC Identity" meaning="KYC information is restricted because it contains sensitive identity information. Your role allows you to see verification status but the underlying documents are masked." />
          </h2>
          
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-gray-500 mb-1">PAN Number</p>
              <p className="font-mono text-lg text-gray-900">������1234</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Aadhaar Number</p>
              <p className="font-mono text-lg text-gray-900">��������7890</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
             <p className="text-sm text-gray-500">
               To view sensitive information, you must provide an operational reason. This action requires MFA and will be audited.
             </p>
             <button className="px-4 py-2 bg-red-50 text-red-700 rounded text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors">
               ?? View Sensitive Information
             </button>
          </div>
        </div>

        {/* Support Timeline Example */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Timeline</h2>
          <div className="border-l-2 border-gray-200 ml-3 pl-4 space-y-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">14:32 TODAY</p>
              <p className="font-medium">Payment ?5,000 <StatusBadge status="🟢 Healthy" text="Successful" /></p>
              <p className="text-sm text-gray-600 mt-1">Transaction TX-918273 linked to Loan KH-10293.</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">14:32 TODAY</p>
              <p className="font-medium">Notification <StatusBadge status="🟢 Healthy" text="Delivered" /></p>
              <p className="text-sm text-gray-600 mt-1">Payment confirmation delivered via FCM.</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">12:14 TODAY</p>
              <p className="font-medium">Login from Android Device <StatusBadge status="🟢 Healthy" text="Successful" /></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
