/**
 * Main Application Component
 * Enhanced with better state management, error handling, and new structure
 */

import React, { useState, useEffect } from 'react';
import { Claim, ClaimStatus } from './types';
import { analyzeClaim } from './services/aiService';
import { ClaimForm } from './components/ClaimForm';
import { OfficerDashboard } from './components/OfficerDashboard';
import { Icons } from './components/Icons';
import { MOCK_CLAIMS } from './data/mockClaims';
import { ANIMATION } from './config/constants';
import { generateClaimId, generatePolicyNumber } from './utils/helpers';
import { getRandomClaimantName } from './data/mockClaims';

export default function App() {
   const [activeView, setActiveView] = useState<'customer' | 'officer'>('customer');
   const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
   const [isProcessing, setIsProcessing] = useState(false);
   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(
      null
   );

   // Clear notification after configured duration
   useEffect(() => {
      if (notification) {
         const timer = setTimeout(() => setNotification(null), ANIMATION.NOTIFICATION_DURATION);
         return () => clearTimeout(timer);
      }
   }, [notification]);

   const handleClaimSubmit = async (claimData: Partial<Claim>) => {
      setIsProcessing(true);

      try {
         const newClaim: Claim = {
            id: generateClaimId(),
            claimantName: getRandomClaimantName(),
            policyNumber: generatePolicyNumber(),
            submissionDate: new Date().toISOString(),
            status: ClaimStatus.SUBMITTED,
            documents: [],
            type: claimData.type!,
            incidentDate: claimData.incidentDate!,
            incidentDescription: claimData.incidentDescription!,
            location: claimData.location!,
            ...claimData,
         } as Claim;

         // AI Processing
         const analysis = await analyzeClaim(newClaim);

         const processedClaim = {
            ...newClaim,
            status: ClaimStatus.ANALYZED,
            analysis,
         };

         setClaims((prev) => [...prev, processedClaim]);
         setNotification({ msg: 'Claim submitted and analyzed successfully!', type: 'success' });

         // Auto switch to officer view to show the result
         setTimeout(() => {
            setActiveView('officer');
         }, ANIMATION.AUTO_SWITCH_DELAY);
      } catch (error) {
         setNotification({
            msg: 'Error processing claim. Please try again.',
            type: 'error',
         });
         console.error('Error analyzing claim:', error);
      } finally {
         setIsProcessing(false);
      }
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
                        className={`px-4 py-1.5 rounded-md transition-all ${activeView === 'customer'
                           ? 'bg-white text-blue-600 shadow-sm'
                           : 'text-gray-500 hover:text-gray-700'
                           }`}
                     >
                        Customer App
                     </button>
                     <button
                        onClick={() => setActiveView('officer')}
                        className={`px-4 py-1.5 rounded-md transition-all ${activeView === 'officer'
                           ? 'bg-white text-blue-600 shadow-sm'
                           : 'text-gray-500 hover:text-gray-700'
                           }`}
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
                     <div
                        className={`${notification.type === 'success'
                           ? 'bg-emerald-600'
                           : notification.type === 'error'
                              ? 'bg-rose-600'
                              : 'bg-blue-600'
                           } text-white px-6 py-4 rounded-xl shadow-xl flex items-center`}
                     >
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
