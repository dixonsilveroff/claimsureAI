/**
 * Helper utilities for ClaimSure application
 */

import { RiskLevel, Queue } from '../types';
import { RISK_THRESHOLDS, QUEUE_RULES } from '../config/constants';

/**
 * Determine risk level from risk score
 */
export const getRiskLevel = (riskScore: number): RiskLevel => {
   if (riskScore >= RISK_THRESHOLDS.HIGH_MIN) {
      return RiskLevel.HIGH;
   } else if (riskScore >= RISK_THRESHOLDS.LOW_MAX + 1) {
      return RiskLevel.MEDIUM;
   } else {
      return RiskLevel.LOW;
   }
};

/**
 * Determine recommended queue based on scores
 */
export const getRecommendedQueue = (
   completenessScore: number,
   riskScore: number,
   riskLevel: RiskLevel
): Queue => {
   if (
      completenessScore >= QUEUE_RULES.FAST_TRACK_MIN_COMPLETENESS &&
      riskLevel === RiskLevel.LOW
   ) {
      return Queue.FAST_TRACK;
   } else if (riskLevel === RiskLevel.HIGH || riskScore >= QUEUE_RULES.INVESTIGATION_MIN_RISK) {
      return Queue.INVESTIGATION;
   } else {
      return Queue.STANDARD;
   }
};

/**
 * Calculate days between two dates
 */
export const getDaysBetween = (date1: Date, date2: Date): number => {
   const diffTime = Math.abs(date2.getTime() - date1.getTime());
   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format date to locale string
 */
export const formatDate = (dateString: string): string => {
   try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
      });
   } catch {
      return dateString;
   }
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString: string): string => {
   try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   } catch {
      return dateString;
   }
};

/**
 * Format time only
 */
export const formatTime = (dateString: string): string => {
   try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
         hour: '2-digit',
         minute: '2-digit',
      });
   } catch {
      return dateString;
   }
};

/**
 * Generate random claim ID
 */
export const generateClaimId = (): string => {
   return `CL-${Math.floor(Math.random() * 900000) + 100000}`;
};

/**
 * Generate random policy number
 */
export const generatePolicyNumber = (): string => {
   return `POL-${Math.floor(Math.random() * 9000) + 1000}`;
};

/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
   if (bytes === 0) return '0 Bytes';

   const k = 1024;
   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
   const i = Math.floor(Math.log(bytes) / Math.log(k));

   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
   if (text.length <= maxLength) return text;
   return text.substring(0, maxLength) + '...';
};

/**
 * Get score interpretation
 */
export const getScoreInterpretation = (score: number, isRiskScore: boolean = false): string => {
   if (isRiskScore) {
      // For risk scores, higher is worse
      if (score >= 70) return 'High Risk';
      if (score >= 40) return 'Medium Risk';
      return 'Low Risk';
   } else {
      // For completeness scores, higher is better
      if (score >= 90) return 'Excellent';
      if (score >= 80) return 'Good';
      if (score >= 60) return 'Fair';
      return 'Poor';
   }
};

/**
 * Get color class for risk level
 */
export const getRiskColorClass = (riskLevel: RiskLevel): string => {
   switch (riskLevel) {
      case RiskLevel.LOW:
         return 'emerald';
      case RiskLevel.MEDIUM:
         return 'amber';
      case RiskLevel.HIGH:
         return 'rose';
      default:
         return 'gray';
   }
};

/**
 * Get color class for queue
 */
export const getQueueColorClass = (queue: Queue): string => {
   switch (queue) {
      case Queue.FAST_TRACK:
         return 'emerald';
      case Queue.STANDARD:
         return 'blue';
      case Queue.INVESTIGATION:
         return 'rose';
      default:
         return 'gray';
   }
};

/**
 * Check if a string contains any keywords from array
 */
export const containsAnyKeyword = (text: string, keywords: readonly string[]): boolean => {
   const lowerText = text.toLowerCase();
   return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

/**
 * Count keyword matches in text
 */
export const countKeywordMatches = (text: string, keywords: readonly string[]): number => {
   const lowerText = text.toLowerCase();
   return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;
};
