/**
 * Validation utilities for ClaimSure application
 */

import { FILE_UPLOAD, DATE_VALIDATION, DESCRIPTION_VALIDATION } from '../config/constants';

export interface ValidationResult {
   isValid: boolean;
   error?: string;
}

/**
 * Validate file size
 */
export const validateFileSize = (file: File): ValidationResult => {
   if (file.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
      return {
         isValid: false,
         error: `File "${file.name}" exceeds maximum size of ${FILE_UPLOAD.MAX_SIZE_MB}MB`,
      };
   }
   return { isValid: true };
};

/**
 * Validate file type
 */
export const validateFileType = (file: File): ValidationResult => {
   if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(extension)) {
         return {
            isValid: false,
            error: `File type not allowed. Accepted: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`,
         };
      }
   }
   return { isValid: true };
};

/**
 * Validate multiple files
 */
export const validateFiles = (files: File[]): ValidationResult => {
   if (files.length > FILE_UPLOAD.MAX_FILES) {
      return {
         isValid: false,
         error: `Maximum ${FILE_UPLOAD.MAX_FILES} files allowed`,
      };
   }

   for (const file of files) {
      const sizeValidation = validateFileSize(file);
      if (!sizeValidation.isValid) return sizeValidation;

      const typeValidation = validateFileType(file);
      if (!typeValidation.isValid) return typeValidation;
   }

   return { isValid: true };
};

/**
 * Validate incident date
 */
export const validateIncidentDate = (dateString: string): ValidationResult => {
   if (!dateString) {
      return {
         isValid: false,
         error: 'Incident date is required',
      };
   }

   const incidentDate = new Date(dateString);
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   // Check for future dates
   if (incidentDate > today) {
      return {
         isValid: false,
         error: 'Incident date cannot be in the future',
      };
   }

   // Check for dates too far in the past
   const maxPastDate = new Date();
   maxPastDate.setDate(maxPastDate.getDate() - DATE_VALIDATION.MAX_DAYS_PAST);

   if (incidentDate < maxPastDate) {
      return {
         isValid: false,
         error: `Incident date cannot be more than ${DATE_VALIDATION.MAX_DAYS_PAST} days in the past`,
      };
   }

   return { isValid: true };
};

/**
 * Validate incident description
 */
export const validateDescription = (description: string): ValidationResult => {
   if (!description || description.trim().length === 0) {
      return {
         isValid: false,
         error: 'Incident description is required',
      };
   }

   if (description.length < DESCRIPTION_VALIDATION.MIN_LENGTH) {
      return {
         isValid: false,
         error: `Description must be at least ${DESCRIPTION_VALIDATION.MIN_LENGTH} characters (currently ${description.length})`,
      };
   }

   if (description.length > DESCRIPTION_VALIDATION.MAX_LENGTH) {
      return {
         isValid: false,
         error: `Description must not exceed ${DESCRIPTION_VALIDATION.MAX_LENGTH} characters`,
      };
   }

   return { isValid: true };
};

/**
 * Validate location
 */
export const validateLocation = (location: string): ValidationResult => {
   if (!location || location.trim().length === 0) {
      return {
         isValid: false,
         error: 'Incident location is required',
      };
   }

   if (location.trim().length < 3) {
      return {
         isValid: false,
         error: 'Please provide a more specific location',
      };
   }

   return { isValid: true };
};

/**
 * Check if description meets recommended length
 */
export const isDescriptionWellDetailed = (description: string): boolean => {
   return description.length >= DESCRIPTION_VALIDATION.RECOMMENDED_LENGTH;
};

/**
 * Get description quality feedback
 */
export const getDescriptionQuality = (description: string): string => {
   const length = description.length;

   if (length < DESCRIPTION_VALIDATION.VERY_SHORT_THRESHOLD) {
      return 'Too brief';
   } else if (length < DESCRIPTION_VALIDATION.MIN_LENGTH) {
      return 'Brief';
   } else if (length < DESCRIPTION_VALIDATION.RECOMMENDED_LENGTH) {
      return 'Adequate';
   } else if (length < DESCRIPTION_VALIDATION.MAX_LENGTH * 0.7) {
      return 'Good';
   } else {
      return 'Detailed';
   }
};

/**
 * Validate entire claim form
 */
export interface ClaimFormData {
   type: string;
   incidentDate: string;
   incidentDescription: string;
   location: string;
   files?: File[];
}

export const validateClaimForm = (formData: ClaimFormData): ValidationResult => {
   const dateValidation = validateIncidentDate(formData.incidentDate);
   if (!dateValidation.isValid) return dateValidation;

   const descriptionValidation = validateDescription(formData.incidentDescription);
   if (!descriptionValidation.isValid) return descriptionValidation;

   const locationValidation = validateLocation(formData.location);
   if (!locationValidation.isValid) return locationValidation;

   if (formData.files) {
      const filesValidation = validateFiles(formData.files);
      if (!filesValidation.isValid) return filesValidation;
   }

   return { isValid: true };
};
