import React, { useState, useEffect } from 'react';
import { Claim, ClaimStatus } from './types';
import { analyzeClaim } from './services/aiService';
import { ClaimForm } from './components/ClaimForm';
import { OfficerDashboard } from './components/OfficerDashboard';
import { Icons } from './components/Icons';

// Mock Data
const MOCK_CLAIMS: Claim[] = [
  {
    id: 'CL-839210',
    claimantName: 'John Doe',
    policyNumber: 'POL-9921',
    type: 'Gadget' as any,
    incidentDate: '2023-10-15',
    incidentDescription: 'I dropped my iPhone 14 Pro Max while hiking. The screen is shattered.',
    location: 'Yosemite Park',
    documents: [{ name: 'screen_crack.jpg', type: 'image/jpeg', size: 2000 }],
    submissionDate: new Date(Date.now() - 86400000).toISOString(),
    status: ClaimStatus.ANALYZED,
    analysis: {
      completenessScore: 95,
      fraudRiskScore: 12,
      riskLevel: 'Low' as any,
      riskFactors: [],
      completenessIssues: [],
      recommendedQueue: 'Fast-Track' as any
    }
  },
  {
    id: 'CL-839215',
    claimantName: 'Jane Smith',
    policyNumber: 'POL-1123',
    type: 'Auto' as any,
    incidentDate: '2023-09-01',
    incidentDescription: 'Car was stolen. I don\'t know where I parked it exactly. Maybe near the bar.',
    location: 'Downtown',
    documents: [],
    submissionDate: new Date(Date.now() - 172800000).toISOString(),
    status: ClaimStatus.ANALYZED,
    analysis: {
      completenessScore: 40,
      fraudRiskScore: 85,
      riskLevel: 'High' as any,
      riskFactors: ['Delayed reporting: 45 days after incident.', 'Vague details regarding incident cause.', 'Missing visual evidence.'],
      completenessIssues: ['No supporting evidence uploaded.'],
      recommendedQueue: 'Investigation' as any
    }
  }
];

export default function App() {
  const [activeView, setActiveView] = useState<'customer' | 'officer'>('customer');
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  // Clear notification after 3s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClaimSubmit = async (claimData: Partial<Claim>) => {
    setIsProcessing(true);
    
    const newClaim: Claim = {
      id: `CL-${Math.floor(Math.random() * 900000) + 100000}`,
      claimantName: 'Current User', // Simulated
      policyNumber: `POL-${Math.floor(Math.random() * 9000)}`,
      submissionDate: new Date().toISOString(),
      status: ClaimStatus.SUBMITTED,
      documents: [],
      type: 'Gadget' as any,
      incidentDate: '',
      incidentDescription: '',
      location: '',
      ...claimData
    } as Claim;

    // AI Processing Simulation
    const analysis = await analyzeClaim(newClaim);
    
    const processedClaim = {
      ...newClaim,
      status: ClaimStatus.ANALYZED,
      analysis
    };

    setClaims(prev => [...prev, processedClaim]);
    setIsProcessing(false);
    setNotification({ msg: 'Claim submitted and analyzed successfully!', type: 'success' });
    
    // Auto switch to officer view to show the result in the demo
    setTimeout(() => {
        setActiveView('officer');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Icons.ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              ClaimSure
            </span>
          </div>

          <div className="flex items-center space-x-4">
             {/* Role Toggles for Demo Purpose */}
             <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
                <button 
                  onClick={() => setActiveView('customer')}
                  className={`px-4 py-1.5 rounded-md transition-all ${activeView === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Customer App
                </button>
                <button 
                  onClick={() => setActiveView('officer')}
                  className={`px-4 py-1.5 rounded-md transition-all ${activeView === 'officer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Officer Dashboard
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50/50 p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          
          {/* Notification Toast */}
          {notification && (
            <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-300">
              <div className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center">
                <Icons.CheckCircle className="w-5 h-5 mr-3" />
                {notification.msg}
              </div>
            </div>
          )}

          {activeView === 'customer' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">File a New Claim</h1>
                <p className="text-gray-500">AI-Assisted Instant Processing</p>
              </div>
              <ClaimForm onSubmit={handleClaimSubmit} isProcessing={isProcessing} />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 h-full">
              <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Claims Decision Support</h1>
                    <p className="text-gray-500 text-sm">Real-time triage and risk scoring</p>
                </div>
              </div>
              <OfficerDashboard claims={claims} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}