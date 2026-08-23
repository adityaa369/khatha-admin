import React from 'react';

export default function LoanOperations() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Loan Operations</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded border">ACTIVE: 1,284</div>
          <div className="bg-white p-4 rounded border">PENDING: 93</div>
          <div className="bg-white p-4 rounded border">DEFAULTED: 18</div>
          <div className="bg-white p-4 rounded border">COMPLETED: 7,421</div>
        </div>
      </div>
    </div>
  );
}
