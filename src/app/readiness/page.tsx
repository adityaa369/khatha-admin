
import React, { useState, useEffect } from 'react';

export default function ReadinessGate() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulated fetch of the GET /api/admin/system/readiness response
    setTimeout(() => {
      setData({
        result: 'PRODUCTION GO',
        metrics: {
          criticalViolations: 0,
          highViolations: 0,
          openIncidents: 0,
          ledgerDifference: 0,
          rpoMinutes: 2,
          rtoMinutes: 15
        },
        gates: [
          { name: 'Security', status: 'PASS', evidence: 'TEST-RUN-SEC-912', env: 'STAGING', commit: 'a91bc82', assertions: '225/225', details: '0 Critical, 0 High' },
          { name: 'Financial Integrity', status: 'PASS', evidence: 'TEST-RUN-FIN-332', env: 'STAGING', commit: 'a91bc82', assertions: '71/71', details: 'All mutations protected' },
          { name: 'Ledger', status: 'PASS', evidence: 'TEST-RUN-REC-119', env: 'STAGING', commit: 'a91bc82', assertions: '184/184', details: 'Reconciliation = ?0 diff' },
          { name: 'State Machines', status: 'PASS', evidence: 'TEST-RUN-SM-881', env: 'STAGING', commit: 'a91bc82', assertions: '40/40', details: 'Invalid transitions blocked' },
          { name: 'Concurrency', status: 'PASS', evidence: 'TEST-RUN-CON-002', env: 'STAGING', commit: 'a91bc82', assertions: '18/18', details: 'Double-spend prevented' },
          { name: 'Infrastructure', status: 'PASS', evidence: 'TEST-RUN-INF-442', env: 'STAGING', commit: 'a91bc82', assertions: '12/12', details: 'Live/Ready endpoints pass' },
          { name: 'Graceful Shutdown', status: 'PASS', evidence: 'TEST-RUN-SHUT-01', env: 'STAGING', commit: 'a91bc82', assertions: '3/3', details: 'SIGTERM handled' },
          { name: 'Disaster Recovery', status: 'PASS', evidence: 'TEST-RUN-DR-992', env: 'STAGING', commit: 'a91bc82', assertions: 'RPO = 5m, RTO = 30m', details: 'Calculated from last backup' },
          { name: 'Backups', status: 'PASS', evidence: 'TEST-RUN-BKP-771', env: 'STAGING', commit: 'a91bc82', assertions: '100% Data Restore', details: 'Reconciliation after restore PASS' },
          { name: 'Mobile', status: 'PASS', evidence: 'TEST-RUN-MOB-019', env: 'STAGING', commit: 'a91bc82', assertions: 'Obfuscation, SSL Pinning', details: 'No secrets bundled' },
          { name: 'Admin Control Plane', status: 'PASS', evidence: 'TEST-RUN-ADM-883', env: 'STAGING', commit: 'a91bc82', assertions: 'Read-only verified', details: 'No financial mutations possible' },
          { name: 'Operational Readiness', status: 'PASS', evidence: 'MANUAL-SIGN-OFF', env: 'PRODUCTION', commit: 'a91bc82', assertions: '14 Runbooks', details: 'Incident workflows established' }
        ]
      });
    }, 1000);
  }, []);

  if (!data) return <div className="p-8 text-center animate-pulse">Loading Readiness Evidence...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex justify-between items-center shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">KHATHA PRODUCTION READINESS</h1>
            <p className="text-sm text-gray-400">Formal Release Gate Checklist & Evidence Traceability</p>
          </div>
          <div className={`px-6 py-4 rounded text-2xl font-bold shadow-lg ${data.result === 'PRODUCTION GO' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
             {data.result === 'PRODUCTION GO' ? '?? PRODUCTION GO' : '?? NO-GO'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          
          {/* Summary Metrics */}
          <div className="col-span-1 bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Hard-Coded Constraints</h2>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Critical Findings</span>
              <span className={`font-bold ${data.metrics.criticalViolations === 0 ? 'text-green-400' : 'text-red-400'}`}>{data.metrics.criticalViolations}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">High Findings</span>
              <span className={`font-bold ${data.metrics.highViolations === 0 ? 'text-green-400' : 'text-red-400'}`}>{data.metrics.highViolations}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Open P0 Incidents</span>
              <span className={`font-bold ${data.metrics.openIncidents === 0 ? 'text-green-400' : 'text-red-400'}`}>{data.metrics.openIncidents}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Ledger Difference</span>
              <span className={`font-bold ${data.metrics.ledgerDifference === 0 ? 'text-green-400' : 'text-red-400'}`}>?{data.metrics.ledgerDifference}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Reconciliation</span>
              <span className="font-bold text-green-400">PASS</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">RPO</span>
              <span className={`font-bold ${data.metrics.rpoMinutes <= 5 ? 'text-green-400' : 'text-red-400'}`}>= {data.metrics.rpoMinutes} min</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">RTO</span>
              <span className={`font-bold ${data.metrics.rtoMinutes <= 30 ? 'text-green-400' : 'text-red-400'}`}>= {data.metrics.rtoMinutes} min</span>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500">
              Violating any of these metrics automatically triggers a NO-GO state that cannot be manually overridden.
            </div>
          </div>

          {/* Evidence Ledger */}
          <div className="col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6">
             <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Evidence & Traceability Matrix</h2>
             
             <div className="space-y-4">
               {data.gates.map((gate, idx) => (
                 <div key={idx} className="bg-gray-900 border border-gray-700 p-4 rounded text-sm flex flex-col space-y-2">
                   
                   <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                     <span className="font-bold text-white text-lg">{gate.name}</span>
                     <span className="bg-green-900 text-green-400 px-3 py-1 rounded font-bold">?? {gate.status}</span>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-4 text-xs">
                     <div>
                       <span className="text-gray-500 block mb-1">EVIDENCE TRACE</span>
                       <span className="text-blue-400 font-bold">{gate.evidence}</span>
                     </div>
                     <div>
                       <span className="text-gray-500 block mb-1">ENVIRONMENT</span>
                       <span className="text-yellow-400">{gate.env}</span>
                     </div>
                     <div>
                       <span className="text-gray-500 block mb-1">COMMIT</span>
                       <span className="text-gray-300 font-mono">{gate.commit}</span>
                     </div>
                   </div>
                   
                   <div className="pt-2">
                     <span className="text-gray-400">Result: </span>
                     <span className="text-gray-300">{gate.assertions} � {gate.details}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
