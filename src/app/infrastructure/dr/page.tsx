
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function DisasterRecovery() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">BACKUP STATUS</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
             <p className="text-sm text-gray-500 uppercase tracking-wide">Current RPO</p>
             <p className="text-3xl font-mono mt-2 mb-2">18 minutes</p>
             <StatusBadge status="?? Attention" text="?? RPO TARGET MISSED" />
             <p className="text-sm text-gray-600 mt-4">Target: 5 minutes. Represents the maximum acceptable amount of recent data loss.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
             <p className="text-sm text-gray-500 uppercase tracking-wide">Last Successful Backup</p>
             <p className="text-3xl font-mono mt-2 mb-2">12:05</p>
             <StatusBadge status="?? Healthy" text="?? AVAILABLE" />
             <p className="text-sm text-gray-600 mt-4">Provider: MongoDB Atlas (PITR Enabled)</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recovery Scenarios</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
               <span className="font-medium">MongoDB Failure</span>
               <StatusBadge status="?? Healthy" text="?? Ready" />
            </div>
            <div className="flex justify-between items-center border-b pb-2">
               <span className="font-medium">Redis Failure</span>
               <StatusBadge status="?? Healthy" text="?? Ready" />
            </div>
            <div className="flex justify-between items-center">
               <span className="font-medium">Reconciliation After Restore</span>
               <StatusBadge status="?? Healthy" text="?? PASS" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
