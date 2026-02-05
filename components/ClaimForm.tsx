import React, { useState } from 'react';
import { ClaimType, Claim, ClaimStatus } from '../types';
import { Icons } from './Icons';

interface ClaimFormProps {
  onSubmit: (claimData: Partial<Claim>) => void;
  isProcessing: boolean;
}

export const ClaimForm: React.FC<ClaimFormProps> = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    type: ClaimType.GADGET,
    incidentDate: '',
    incidentDescription: '',
    location: '',
  });
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((f: File) => f.name);
      setFileNames(prev => [...prev, ...names]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      documents: fileNames.map(name => ({ name, type: 'image/jpeg', size: 1024 })),
    });
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-pulse">
        <Icons.Brain className="w-20 h-20 text-blue-600 mb-6 animate-bounce" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">ClaimSure AI is Analyzing...</h3>
        <p className="text-gray-500">Verifying documents, checking policy limits, and assessing completeness.</p>
        <div className="mt-8 w-64 bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full w-2/3 animate-[width_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">New Claim Submission</h2>
        <p className="text-gray-500 mt-1">Please provide accurate details to speed up your claim.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
            <select 
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as ClaimType})}
            >
              {Object.values(ClaimType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date</label>
            <input 
              type="date" 
              required
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.incidentDate}
              onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Incident Location</label>
          <input 
            type="text" 
            required
            placeholder="e.g., 123 Main St, Springfield"
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description of Incident 
            <span className="text-xs text-gray-400 font-normal ml-2">(Be specific)</span>
          </label>
          <textarea 
            required
            rows={4}
            placeholder="Describe what happened, when, and how..."
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.incidentDescription}
            onChange={(e) => setFormData({...formData, incidentDescription: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Evidence & Documents</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors relative">
            <input 
              type="file" 
              multiple 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload photos, police reports, or receipts</p>
          </div>
          {fileNames.length > 0 && (
            <ul className="mt-3 space-y-1">
              {fileNames.map((name, idx) => (
                <li key={idx} className="flex items-center text-sm text-green-600">
                  <Icons.CheckCircle className="w-4 h-4 mr-2" />
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <Icons.ShieldCheck className="w-5 h-5 mr-2" />
          Submit Claim for Assessment
        </button>
        
        <div className="text-center">
            <p className="text-xs text-gray-400 mt-2">
                Tip for Demo: Try keywords like "cash", "unknown", "night" to trigger fraud flags. 
                Upload 0 files to trigger completeness flags.
            </p>
        </div>
      </form>
    </div>
  );
};