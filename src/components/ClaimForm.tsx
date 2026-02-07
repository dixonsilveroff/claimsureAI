/**
 * Enhanced ClaimForm Component
 * Features comprehensive validation, file upload management, and user guidance
 */

import React, { useState } from 'react';
import { ClaimType, Claim, DocumentMetadata } from '../types';
import { Icons } from './Icons';
import {
   validateIncidentDate,
   validateDescription,
   validateLocation,
   validateFileSize,
   validateFileType,
   getDescriptionQuality,
} from '../utils/validators';
import { DESCRIPTION_VALIDATION, FILE_UPLOAD } from '../config/constants';
import { formatFileSize } from '../utils/helpers';

interface ClaimFormProps {
   onSubmit: (claimData: Partial<Claim>) => void;
   isProcessing: boolean;
}

interface FormErrors {
   incidentDate?: string;
   incidentDescription?: string;
   location?: string;
   files?: string;
}

export const ClaimForm: React.FC<ClaimFormProps> = ({ onSubmit, isProcessing }) => {
   const [formData, setFormData] = useState({
      type: ClaimType.GADGET,
      incidentDate: '',
      incidentDescription: '',
      location: '',
   });

   const [files, setFiles] = useState<File[]>([]);
   const [errors, setErrors] = useState<FormErrors>({});
   const [touched, setTouched] = useState<Record<string, boolean>>({});

   // Real-time validation
   const validateField = (field: keyof typeof formData, value: string) => {
      let error: string | undefined;

      switch (field) {
         case 'incidentDate':
            const dateValidation = validateIncidentDate(value);
            error = dateValidation.error;
            break;
         case 'incidentDescription':
            if (value.length > 0 && value.length < DESCRIPTION_VALIDATION.MIN_LENGTH) {
               error = `${DESCRIPTION_VALIDATION.MIN_LENGTH - value.length} more characters needed`;
            }
            break;
         case 'location':
            if (value.length > 0 && value.length < 3) {
               error = 'Please provide more detail';
            }
            break;
      }

      setErrors((prev) => ({ ...prev, [field]: error }));
   };

   const handleChange = (field: keyof typeof formData, value: string) => {
      setFormData({ ...formData, [field]: value });
      if (touched[field]) {
         validateField(field, value);
      }
   };

   const handleBlur = (field: string) => {
      setTouched({ ...touched, [field]: true });
      if (field in formData) {
         validateField(field as keyof typeof formData, formData[field as keyof typeof formData]);
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const newFiles: File[] = Array.from(e.target.files);
         const allFiles: File[] = [...files, ...newFiles];

         // Validate file count
         if (allFiles.length > FILE_UPLOAD.MAX_FILES) {
            setErrors({
               ...errors,
               files: `Maximum ${FILE_UPLOAD.MAX_FILES} files allowed`,
            });
            return;
         }

         // Validate each file
         for (const file of newFiles) {
            const sizeValidation = validateFileSize(file);
            if (!sizeValidation.isValid) {
               setErrors({ ...errors, files: sizeValidation.error });
               return;
            }

            const typeValidation = validateFileType(file);
            if (!typeValidation.isValid) {
               setErrors({ ...errors, files: typeValidation.error });
               return;
            }
         }

         setFiles(allFiles);
         setErrors({ ...errors, files: undefined });
      }
   };

   const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
      setErrors({ ...errors, files: undefined });
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Perform final validation
      const dateValidation = validateIncidentDate(formData.incidentDate);
      const descriptionValidation = validateDescription(formData.incidentDescription);
      const locationValidation = validateLocation(formData.location);

      const newErrors: FormErrors = {
         incidentDate: dateValidation.error,
         incidentDescription: descriptionValidation.error,
         location: locationValidation.error,
      };

      setErrors(newErrors);

      // Check if there are any errors
      if (Object.values(newErrors).some((error) => error !== undefined)) {
         return;
      }

      // Convert files to DocumentMetadata
      const documents: DocumentMetadata[] = files.map((file) => ({
         name: file.name,
         type: file.type,
         size: file.size,
      }));

      onSubmit({
         ...formData,
         documents,
      });
   };

   if (isProcessing) {
      return (
         <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-pulse">
            <Icons.Brain className="w-20 h-20 text-blue-600 mb-6 animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">ClaimSure AI is Analyzing...</h3>
            <p className="text-gray-500">
               Verifying documents, checking policy limits, and assessing completeness.
            </p>
            <div className="mt-8 w-64 bg-gray-200 rounded-full h-2.5">
               <div className="bg-blue-600 h-2.5 rounded-full animate-[width_2s_ease-in-out_infinite]" style={{ width: '66%' }}></div>
            </div>
         </div>
      );
   }

   const descriptionQuality = getDescriptionQuality(formData.incidentDescription);
   const charCount = formData.incidentDescription.length;
   const charCountColor =
      charCount >= DESCRIPTION_VALIDATION.RECOMMENDED_LENGTH
         ? 'text-emerald-600'
         : charCount >= DESCRIPTION_VALIDATION.MIN_LENGTH
            ? 'text-blue-600'
            : 'text-amber-600';

   return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
         <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">New Claim Submission</h2>
            <p className="text-gray-500 mt-1">Please provide accurate details to speed up your claim.</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Claim Type */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
                  <select
                     className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                     value={formData.type}
                     onChange={(e) => handleChange('type', e.target.value as ClaimType)}
                  >
                     {Object.values(ClaimType).map((t) => (
                        <option key={t} value={t}>
                           {t}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Incident Date */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date</label>
                  <input
                     type="date"
                     required
                     max={new Date().toISOString().split('T')[0]}
                     className={`w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.incidentDate && touched.incidentDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                     value={formData.incidentDate}
                     onChange={(e) => handleChange('incidentDate', e.target.value)}
                     onBlur={() => handleBlur('incidentDate')}
                  />
                  {errors.incidentDate && touched.incidentDate && (
                     <p className="text-red-500 text-xs mt-1">{errors.incidentDate}</p>
                  )}
               </div>
            </div>

            {/* Location */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Incident Location</label>
               <input
                  type="text"
                  required
                  placeholder="e.g., 123 Main St, Springfield, IL"
                  className={`w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.location && touched.location ? 'border-red-500' : 'border-gray-300'
                     }`}
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  onBlur={() => handleBlur('location')}
               />
               {errors.location && touched.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
               )}
            </div>

            {/* Description */}
            <div>
               <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                     Description of Incident
                     <span className="text-xs text-gray-400 font-normal ml-2">(Be specific)</span>
                  </label>
                  <div className="flex items-center space-x-2">
                     <span className={`text-xs font-medium ${charCountColor}`}>{descriptionQuality}</span>
                     <span className="text-xs text-gray-400">
                        {charCount}/{DESCRIPTION_VALIDATION.MAX_LENGTH}
                     </span>
                  </div>
               </div>
               <textarea
                  required
                  rows={4}
                  maxLength={DESCRIPTION_VALIDATION.MAX_LENGTH}
                  placeholder="Describe what happened, when, and how... Include as many details as possible for faster processing."
                  className={`w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${errors.incidentDescription && touched.incidentDescription
                     ? 'border-red-500'
                     : 'border-gray-300'
                     }`}
                  value={formData.incidentDescription}
                  onChange={(e) => handleChange('incidentDescription', e.target.value)}
                  onBlur={() => handleBlur('incidentDescription')}
               />
               {errors.incidentDescription && touched.incidentDescription && (
                  <p className="text-red-500 text-xs mt-1">{errors.incidentDescription}</p>
               )}
            </div>

            {/* File Upload */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence & Documents
                  <span className="text-xs text-gray-400 font-normal ml-2">
                     ({files.length}/{FILE_UPLOAD.MAX_FILES})
                  </span>
               </label>
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors relative">
                  <input
                     type="file"
                     multiple
                     accept={FILE_UPLOAD.ALLOWED_TYPES.join(',')}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     onChange={handleFileChange}
                     disabled={files.length >= FILE_UPLOAD.MAX_FILES}
                  />
                  <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photos, police reports, or receipts</p>
                  <p className="text-xs text-gray-400 mt-1">
                     Max {FILE_UPLOAD.MAX_SIZE_MB}MB per file • {FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ').toUpperCase()}
                  </p>
               </div>

               {errors.files && <p className="text-red-500 text-xs mt-1">{errors.files}</p>}

               {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                     {files.map((file, idx) => (
                        <div
                           key={idx}
                           className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200"
                        >
                           <div className="flex items-center flex-1 min-w-0">
                              <Icons.CheckCircle className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                 ({formatFileSize(file.size)})
                              </span>
                           </div>
                           <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                           >
                              <Icons.AlertTriangle className="w-4 h-4" />
                           </button>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Submit Button */}
            <button
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={isProcessing}
            >
               <Icons.ShieldCheck className="w-5 h-5 mr-2" />
               Submit Claim for Assessment
            </button>

            {/* Demo Tips */}
            <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-3">
               <p className="text-xs text-blue-700 font-medium mb-1">💡 Demo Tips</p>
               <p className="text-xs text-blue-600">
                  Try keywords like "cash", "unknown", "night" to trigger fraud flags. Upload 0 files to
                  trigger completeness issues.
               </p>
            </div>
         </form>
      </div>
   );
};
