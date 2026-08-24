"use client";
import React, { useState } from 'react';

export default function IncidentInvestigation() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [time, setTime] = useState('1h');
  const [severity, setSeverity] = useState('All');
  const [financialImpact, setFinancialImpact] = useState('All');
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(false);
    setSelectedEvent(null);
    try {
      const params = new URLSearchParams({ query, type, time, severity, financialImpact });
      const res = await fetch(`/api/admin/security/investigate?${params.toString()}`);
      if (res.status === 401) {
         window.location.href = '/login';
         return;
      }
      if (!res.ok) throw new Error('API Error');
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      setError(true);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-slate-800">
          <h1 className="text-2xl font-bold text-gray-900">INCIDENT INVESTIGATION</h1>
          <p className="text-sm font-medium mt-1 text-gray-600">
            Read-only Evidence Explorer
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Search ID</label>
            <input 
              type="text" 
              placeholder="Request ID, Txn ID, Actor, Loan ID..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-slate-500 focus:border-slate-500 text-black"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Time</label>
            <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm text-black">
              <option value="1h">Last 1h</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7d</option>
              <option value="All">All Time</option>
            </select>
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm text-black">
              <option value="All">All</option>
              <option value="OVERPAYMENT_ATTEMPT">OVERPAYMENT_ATTEMPT</option>
              <option value="RATE_LIMIT_EXCEEDED">RATE_LIMIT_EXCEEDED</option>
              <option value="FINANCIAL_KILL_SWITCH_BLOCKED">KILL_SWITCH</option>
              <option value="OTP_REPLAY">OTP_REPLAY</option>
              <option value="AUTH_FAILED">AUTH_FAILED</option>
              <option value="LOAN_PAYMENT_COMMITTED">LOAN_PAYMENT</option>
            </select>
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm text-black">
              <option value="All">All</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Financial Impact</label>
            <select value={financialImpact} onChange={(e) => setFinancialImpact(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm text-black">
              <option value="All">All</option>
              <option value="COMMITTED">COMMITTED</option>
              <option value="ATTEMPTED">ATTEMPTED</option>
              <option value="NONE">NONE</option>
            </select>
          </div>
          <button 
            onClick={handleSearch}
            className="bg-slate-800 text-white font-bold py-2 px-6 rounded hover:bg-slate-700 transition-colors h-[38px]"
          >
            SEARCH
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
            Unknown Error retrieving investigation data.
          </div>
        )}

        <div className="flex gap-6">
          {/* Results List */}
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden h-[600px] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Incident Timeline</h2>
              <span className="text-xs text-gray-500">{events.length} results</span>
            </div>
            <div className="overflow-y-auto flex-1 p-0">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Searching evidence...</div>
              ) : events.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No matching events found.</div>
              ) : (
                <ul className="divide-y divide-gray-200 font-mono text-sm">
                  {events.map((e, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => setSelectedEvent(e)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedEvent?.eventId === e.eventId ? 'bg-slate-100 border-l-4 border-slate-800' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">{e.eventType}</span>
                        <span className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-gray-600">Req: {e.requestId?.slice(0,8) || 'N/A'}...</span>
                        <span className="text-gray-600">Actor: {e.actorId?.slice(0,8) || 'N/A'}...</span>
                        <span className={`font-bold ${e.financialImpact === 'COMMITTED' ? 'text-red-600' : 'text-gray-500'}`}>
                          {e.financialImpact}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Detailed Evidence Panel */}
          <div className="flex-1 bg-white rounded-lg shadow h-[600px] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-slate-800 text-white flex justify-between items-center">
              <h2 className="font-bold">Evidence Viewer</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-sm text-gray-800">
              {!selectedEvent ? (
                <div className="text-gray-400 h-full flex items-center justify-center">Select an event to view full evidence chain</div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-500 border-b pb-1 mb-3">WHO</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-500">Actor Type:</span><span>{selectedEvent.actorType}</span>
                      <span className="text-gray-500">Actor ID:</span><span>{selectedEvent.actorId || 'N/A'}</span>
                      <span className="text-gray-500">IP Ref:</span><span>{selectedEvent.ipReference || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-500 border-b pb-1 mb-3">WHAT & WHERE</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-500">Event ID:</span><span>{selectedEvent.eventId}</span>
                      <span className="text-gray-500">Type:</span><span className="font-bold">{selectedEvent.eventType}</span>
                      <span className="text-gray-500">Route:</span><span>{selectedEvent.route || 'N/A'}</span>
                      <span className="text-gray-500">Request ID:</span><span>{selectedEvent.requestId || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-500 border-b pb-1 mb-3">MONEY (WHY)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-500">Result:</span>
                      <span className={selectedEvent.result === 'BLOCKED' ? 'text-red-600 font-bold' : ''}>{selectedEvent.result}</span>
                      
                      <span className="text-gray-500">Financial Logic Reached:</span>
                      <span className={selectedEvent.reachedFinancialLogic ? 'text-red-600 font-bold' : ''}>{selectedEvent.reachedFinancialLogic ? 'YES' : 'NO'}</span>
                      
                      <span className="text-gray-500">Financial Impact:</span>
                      <span className={selectedEvent.financialImpact === 'COMMITTED' ? 'text-red-600 font-bold' : ''}>{selectedEvent.financialImpact}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-500 border-b pb-1 mb-3">RAW EVIDENCE (METADATA)</h3>
                    <pre className="bg-slate-50 p-4 rounded text-xs overflow-x-auto border">
                      {JSON.stringify(selectedEvent.metadata || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
