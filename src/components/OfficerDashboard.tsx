import React, { useState } from 'react';
import { Claim, Queue, RiskLevel } from '../types';
import { Icons } from './Icons';
import { ScoreGauge } from './ScoreGauge';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  claims: Claim[];
}

export const OfficerDashboard: React.FC<DashboardProps> = ({ claims }) => {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // Stats Logic
  const queueStats = {
    [Queue.FAST_TRACK]: claims.filter(c => c.analysis?.recommendedQueue === Queue.FAST_TRACK).length,
    [Queue.STANDARD]: claims.filter(c => c.analysis?.recommendedQueue === Queue.STANDARD).length,
    [Queue.INVESTIGATION]: claims.filter(c => c.analysis?.recommendedQueue === Queue.INVESTIGATION).length,
  };

  const riskData = [
    { name: 'Low Risk', value: claims.filter(c => c.analysis?.riskLevel === RiskLevel.LOW).length, color: '#10b981' }, // Emerald-500
    { name: 'Medium Risk', value: claims.filter(c => c.analysis?.riskLevel === RiskLevel.MEDIUM).length, color: '#f59e0b' }, // Amber-500
    { name: 'High Risk', value: claims.filter(c => c.analysis?.riskLevel === RiskLevel.HIGH).length, color: '#f43f5e' }, // Rose-500
  ];

  const chartData = Object.keys(queueStats).map(key => ({
    name: key,
    count: queueStats[key as Queue],
  }));

  const getRiskBadge = (level?: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">LOW</span>;
      case RiskLevel.MEDIUM: return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">MEDIUM</span>;
      case RiskLevel.HIGH: return <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">HIGH</span>;
      default: return null;
    }
  };

  const getQueueColor = (queue?: Queue) => {
    switch (queue) {
      case Queue.FAST_TRACK: return 'border-l-4 border-l-emerald-500';
      case Queue.STANDARD: return 'border-l-4 border-l-blue-500';
      case Queue.INVESTIGATION: return 'border-l-4 border-l-rose-500';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      
      {/* LEFT COLUMN: CLAIM LIST */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Incoming Queue ({claims.length})</h2>
          <Icons.Search className="w-4 h-4 text-gray-400" />
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2 scrollbar-hide">
          {claims.length === 0 ? (
            <div className="text-center p-8 text-gray-400">No claims received yet.</div>
          ) : (
            claims.slice().reverse().map(claim => (
              <div 
                key={claim.id}
                onClick={() => setSelectedClaim(claim)}
                className={`p-4 rounded-lg border border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedClaim?.id === claim.id ? 'bg-blue-50 ring-1 ring-blue-300' : 'bg-white'} ${getQueueColor(claim.analysis?.recommendedQueue)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 font-mono">#{claim.id.slice(0, 8)}</span>
                  <span className="text-xs text-gray-400">{new Date(claim.submissionDate).toLocaleTimeString()}</span>
                </div>
                <h3 className="font-medium text-gray-900 truncate">{claim.type} Claim</h3>
                <div className="flex items-center justify-between mt-2">
                   <div className="flex items-center space-x-2">
                      {getRiskBadge(claim.analysis?.riskLevel)}
                   </div>
                   <span className="text-xs font-medium text-gray-600">{claim.analysis?.recommendedQueue}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MIDDLE & RIGHT: DETAILS & STATS */}
      <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-1">
        
        {/* Top Section: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase">Risk Distribution</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    {riskData.map(d => (
                        <div key={d.name} className="flex items-center text-xs">
                            <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: d.color}}></span>
                            {d.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase">Triage Queue Volume</h3>
                 <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Bottom Section: Detail View */}
        {selectedClaim ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 animate-in fade-in duration-300">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedClaim.type} Incident</h2>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center"><Icons.Clock className="w-4 h-4 mr-1"/> {selectedClaim.incidentDate}</span>
                  <span className="flex items-center"><Icons.CheckCircle className="w-4 h-4 mr-1"/> Policy #{selectedClaim.policyNumber}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Recommended Action</div>
                <div className={`text-lg font-bold px-4 py-2 rounded-lg inline-block border ${
                    selectedClaim.analysis?.recommendedQueue === Queue.FAST_TRACK ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedClaim.analysis?.recommendedQueue === Queue.INVESTIGATION ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                    {selectedClaim.analysis?.recommendedQueue.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <ScoreGauge 
                 score={selectedClaim.analysis?.fraudRiskScore || 0} 
                 label="Fraud Risk Score" 
                 color={selectedClaim.analysis?.riskLevel === RiskLevel.HIGH ? 'red' : selectedClaim.analysis?.riskLevel === RiskLevel.MEDIUM ? 'yellow' : 'green'} 
                 inverse
               />
               <ScoreGauge 
                 score={selectedClaim.analysis?.completenessScore || 0} 
                 label="Completeness Score" 
                 color={selectedClaim.analysis?.completenessScore || 0 < 80 ? 'yellow' : 'blue'} 
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Icons.ShieldAlert className="w-5 h-5 mr-2 text-rose-500" />
                    Explainable Risk Factors
                </h4>
                {selectedClaim.analysis?.riskFactors.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No significant risk factors detected.</p>
                ) : (
                    <ul className="space-y-2">
                        {selectedClaim.analysis?.riskFactors.map((factor, idx) => (
                            <li key={idx} className="bg-rose-50 text-rose-800 text-sm p-3 rounded-lg border border-rose-100">
                                {factor}
                            </li>
                        ))}
                    </ul>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Icons.FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Narrative & Content
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 italic mb-4">
                    "{selectedClaim.incidentDescription}"
                </div>
                
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Documents</h5>
                <div className="flex flex-wrap gap-2">
                    {selectedClaim.documents.map((doc, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                            {doc.name}
                        </span>
                    ))}
                    {selectedClaim.documents.length === 0 && <span className="text-xs text-rose-500">No documents attached</span>}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-12 text-center">
            <div>
                <Icons.LayoutDashboard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a claim to view analysis</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                    ClaimSure intelligently triages claims to help you focus on what matters. 
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};