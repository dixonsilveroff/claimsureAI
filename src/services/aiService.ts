/**
 * Enhanced AI Service for ClaimSure
 * Simulates intelligent fraud detection and completeness assessment
 * with sophisticated NLP, temporal, and contextual analysis
 */

import { AnalysisResult, Claim, ClaimType } from '../types';
import {
   RISK_ADJUSTMENTS,
   COMPLETENESS_DEDUCTIONS,
   HIGH_RISK_KEYWORDS,
   CLAIM_TYPE_RULES,
   DESCRIPTION_VALIDATION,
   DATE_VALIDATION,
   ANIMATION,
} from '../config/constants';
import {
   getRiskLevel,
   getRecommendedQueue,
   getDaysBetween,
   containsAnyKeyword,
   countKeywordMatches,
} from '../utils/helpers';

/**
 * Main claim analysis function
 * Simulates AI-powered fraud detection and triage
 */
export const analyzeClaim = async (claim: Claim): Promise<AnalysisResult> => {
   // Simulate AI processing time
   await new Promise((resolve) => setTimeout(resolve, ANIMATION.PROCESSING_SIMULATION));

   let riskScore = 10; // Base low risk
   let completenessScore = 100;
   const riskFactors: string[] = [];
   const completenessIssues: string[] = [];

   const descLower = claim.incidentDescription.toLowerCase();
   const locationLower = claim.location.toLowerCase();

   // =====================================
   // 1. NLP / NARRATIVE ANALYSIS
   // =====================================

   // Description length check
   if (claim.incidentDescription.length < DESCRIPTION_VALIDATION.VERY_SHORT_THRESHOLD) {
      completenessScore -= COMPLETENESS_DEDUCTIONS.VERY_SHORT_DESCRIPTION;
      completenessIssues.push('Incident description is extremely brief.');
   } else if (claim.incidentDescription.length < DESCRIPTION_VALIDATION.MIN_LENGTH) {
      completenessScore -= COMPLETENESS_DEDUCTIONS.SHORT_DESCRIPTION;
      completenessIssues.push('Incident description is too brief.');
   }

   // Cash/Money-related claims = HIGH RISK
   if (containsAnyKeyword(descLower, HIGH_RISK_KEYWORDS.CASH_RELATED)) {
      riskScore += RISK_ADJUSTMENTS.CASH_CLAIM;
      riskFactors.push('High-risk asset claimed (Cash/Currency).');
   }

   // Vague details = RISK
   const vagueMatches = countKeywordMatches(descLower, HIGH_RISK_KEYWORDS.VAGUE_DETAILS);
   if (vagueMatches > 0) {
      riskScore += RISK_ADJUSTMENTS.VAGUE_DETAILS * Math.min(vagueMatches, 2);
      riskFactors.push('Vague details regarding incident cause.');
      completenessScore -= COMPLETENESS_DEDUCTIONS.INCOMPLETE_NARRATIVE;
      completenessIssues.push('Description lacks specific details.');
   }

   // High-risk time mentions
   if (containsAnyKeyword(descLower, HIGH_RISK_KEYWORDS.HIGH_RISK_TIMES)) {
      riskScore += RISK_ADJUSTMENTS.HIGH_RISK_HOURS;
      riskFactors.push('Incident occurred during high-risk hours.');
   }

   // Urgency/pressure tactics
   if (containsAnyKeyword(descLower, HIGH_RISK_KEYWORDS.URGENCY_INDICATORS)) {
      riskScore += RISK_ADJUSTMENTS.URGENCY_PRESSURE;
      riskFactors.push('Claim shows urgency pressure indicators.');
   }

   // Emotional language (can indicate desperation/fraud)
   if (containsAnyKeyword(descLower, HIGH_RISK_KEYWORDS.EMOTIONAL)) {
      riskScore += RISK_ADJUSTMENTS.EMOTIONAL_LANGUAGE;
   }

   // High-value claims
   if (containsAnyKeyword(descLower, HIGH_RISK_KEYWORDS.HIGH_VALUE)) {
      riskScore += RISK_ADJUSTMENTS.HIGH_VALUE_CLAIM;
      riskFactors.push('Claim indicates high-value or total loss.');
   }

   // =====================================
   // 2. CLAIM TYPE VALIDATION
   // =====================================

   const claimTypeRule = CLAIM_TYPE_RULES[claim.type];
   if (claimTypeRule) {
      // Check if description contains expected keywords for this claim type
      const hasExpectedKeywords = containsAnyKeyword(descLower, claimTypeRule.REQUIRED_KEYWORDS);
      if (!hasExpectedKeywords) {
         riskScore += RISK_ADJUSTMENTS.INCONSISTENT_NARRATIVE;
         riskFactors.push(`Claim labeled as ${claim.type} but description doesn't match claim type.`);
      }
   }

   // =====================================
   // 3. DOCUMENT ANALYSIS
   // =====================================

   if (claim.documents.length === 0) {
      completenessScore -= COMPLETENESS_DEDUCTIONS.NO_DOCUMENTS;
      completenessIssues.push('No supporting evidence uploaded.');
      riskScore += RISK_ADJUSTMENTS.NO_DOCUMENTS;
      riskFactors.push('Missing visual evidence or documentation.');
   } else if (claim.documents.length === 1) {
      completenessScore -= COMPLETENESS_DEDUCTIONS.SINGLE_DOCUMENT;
      completenessIssues.push('Low evidence count (only 1 document).');
      riskScore += RISK_ADJUSTMENTS.SINGLE_DOCUMENT;
   }

   // Check for generic filenames (could indicate stock photos)
   const genericFilenames = ['image', 'photo', 'picture', 'document', 'file', 'scan'];
   const hasGenericFilenames = claim.documents.some((doc) =>
      genericFilenames.some((generic) => doc.name.toLowerCase().includes(generic))
   );
   if (hasGenericFilenames && claim.documents.length > 0) {
      riskScore += RISK_ADJUSTMENTS.GENERIC_FILENAMES;
      riskFactors.push('Documents have generic filenames (potential stock images).');
   }

   // Check minimum documents for claim type
   if (claimTypeRule && claim.documents.length < claimTypeRule.MIN_DOCUMENTS) {
      completenessIssues.push(`${claim.type} claims typically require at least ${claimTypeRule.MIN_DOCUMENTS} documents.`);
   }

   // =====================================
   // 4. TEMPORAL ANALYSIS
   // =====================================

   const incidentDate = new Date(claim.incidentDate);
   const submissionDate = new Date();
   const daysSinceIncident = getDaysBetween(incidentDate, submissionDate);

   // Delayed reporting
   if (daysSinceIncident > 90) {
      riskScore += RISK_ADJUSTMENTS.DELAYED_REPORTING_90_DAYS;
      riskFactors.push(`Severely delayed reporting: ${daysSinceIncident} days after incident.`);
   } else if (daysSinceIncident > 60) {
      riskScore += RISK_ADJUSTMENTS.DELAYED_REPORTING_60_DAYS;
      riskFactors.push(`Significantly delayed reporting: ${daysSinceIncident} days after incident.`);
   } else if (daysSinceIncident > DATE_VALIDATION.DELAYED_REPORTING_THRESHOLD) {
      riskScore += RISK_ADJUSTMENTS.DELAYED_REPORTING_30_DAYS;
      riskFactors.push(`Delayed reporting: ${daysSinceIncident} days after incident.`);
   }

   // Same-day reporting of high-value claims can be suspicious
   if (daysSinceIncident === 0 && containsAnyKeyword(descLower, HIGH_RISK_KEYWORDS.HIGH_VALUE)) {
      riskScore += RISK_ADJUSTMENTS.SAME_DAY_HIGH_VALUE;
   }

   // =====================================
   // 5. LOCATION ANALYSIS
   // =====================================

   // Vague location
   if (containsAnyKeyword(locationLower, HIGH_RISK_KEYWORDS.VAGUE_LOCATIONS)) {
      riskScore += RISK_ADJUSTMENTS.VAGUE_LOCATION;
      riskFactors.push('Location description is vague or suspicious.');
      completenessScore -= COMPLETENESS_DEDUCTIONS.VAGUE_LOCATION;
      completenessIssues.push('Location lacks specificity.');
   }

   // Very short location
   if (claim.location.trim().length < 5) {
      completenessScore -= COMPLETENESS_DEDUCTIONS.MISSING_LOCATION;
      completenessIssues.push('Location information incomplete.');
   }

   // High-risk location keywords
   const highRiskLocations = ['alley', 'abandoned', 'dark'];
   if (containsAnyKeyword(locationLower, highRiskLocations)) {
      riskScore += RISK_ADJUSTMENTS.HIGH_RISK_LOCATION;
      riskFactors.push('Incident occurred in high-risk location.');
   }

   // =====================================
   // 6. HISTORICAL PATTERNS (SIMULATED)
   // =====================================

   // Randomly simulate some claims being from repeat claimants (10% chance)
   if (Math.random() < 0.1) {
      riskScore += RISK_ADJUSTMENTS.REPEAT_CLAIMANT;
      riskFactors.push('Claimant has submitted multiple claims recently.');
   }

   // Simulate new policy risk (5% chance)
   if (Math.random() < 0.05) {
      riskScore += RISK_ADJUSTMENTS.NEW_POLICY;
      riskFactors.push('Policy is newly issued (less than 90 days old).');
   }

   // =====================================
   // 7. FINAL SCORING & ROUTING
   // =====================================

   // Cap scores within valid ranges
   riskScore = Math.min(Math.max(riskScore, 0), 99);
   completenessScore = Math.min(Math.max(completenessScore, 0), 100);

   // Determine risk level and recommended queue
   const riskLevel = getRiskLevel(riskScore);
   const recommendedQueue = getRecommendedQueue(completenessScore, riskScore, riskLevel);

   return {
      completenessScore,
      fraudRiskScore: riskScore,
      riskLevel,
      riskFactors,
      completenessIssues,
      recommendedQueue,
   };
};
