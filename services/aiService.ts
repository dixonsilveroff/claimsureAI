import { AnalysisResult, Claim, Queue, RiskLevel } from '../types';

/**
 * Simulates the AI analysis engine. 
 * In a real app, this would call a Python backend with NLP/CV models.
 * Here we use deterministic heuristics to demonstrate the concept.
 */
export const analyzeClaim = async (claim: Claim): Promise<AnalysisResult> => {
  // Simulate network latency for AI processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let riskScore = 10; // Base low risk
  let completenessScore = 100;
  const riskFactors: string[] = [];
  const completenessIssues: string[] = [];
  
  const descLower = claim.incidentDescription.toLowerCase();
  
  // --- 1. NLP / Narrative Analysis ---

  // Length check
  if (claim.incidentDescription.length < 50) {
    completenessScore -= 20;
    completenessIssues.push("Incident description is too brief.");
  }

  // Keyword Analysis (Risk Triggers)
  if (descLower.includes("cash") || descLower.includes("money")) {
    riskScore += 30;
    riskFactors.push("High-risk asset claimed (Cash/Currency).");
  }

  if (descLower.includes("unknown") || descLower.includes("don't know")) {
    riskScore += 15;
    riskFactors.push("Vague details regarding incident cause.");
  }

  if (descLower.includes("night") || descLower.includes("2am") || descLower.includes("3am")) {
    riskScore += 10;
    riskFactors.push("Incident occurred during high-risk hours.");
  }

  // Sentiment/Tone (Simulated)
  if (descLower.includes("immediately") || descLower.includes("urgent")) {
    riskScore += 5; // Slight bump for pressure tactics
  }

  // --- 2. Metadata & Document Analysis ---

  // Document count check
  if (claim.documents.length === 0) {
    completenessScore -= 40;
    completenessIssues.push("No supporting evidence uploaded.");
    riskScore += 20; // Lack of proof increases risk
    riskFactors.push("Missing visual evidence.");
  } else if (claim.documents.length === 1) {
    completenessScore -= 10;
    completenessIssues.push("Low evidence count (only 1 document).");
  }

  // Date Logic
  const incidentDate = new Date(claim.incidentDate);
  const submissionDate = new Date();
  const diffTime = Math.abs(submissionDate.getTime() - incidentDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays > 30) {
    riskScore += 25;
    riskFactors.push(`Delayed reporting: ${diffDays} days after incident.`);
  }
  
  if (diffDays < 1) {
    // Reporting same day is usually good, but sometimes suspicious if *too* fast for complex claims
    // We'll leave it neutral for this MVP.
  }

  // --- 3. Final Scoring & Routing ---

  // Cap scores
  riskScore = Math.min(Math.max(riskScore, 0), 99);
  completenessScore = Math.min(Math.max(completenessScore, 0), 100);

  // Determine Risk Level
  let riskLevel = RiskLevel.LOW;
  if (riskScore >= 70) riskLevel = RiskLevel.HIGH;
  else if (riskScore >= 40) riskLevel = RiskLevel.MEDIUM;

  // Determine Queue
  let recommendedQueue = Queue.STANDARD;
  
  if (completenessScore > 80 && riskLevel === RiskLevel.LOW) {
    recommendedQueue = Queue.FAST_TRACK;
  } else if (riskLevel === RiskLevel.HIGH || riskScore > 65) {
    recommendedQueue = Queue.INVESTIGATION;
  } else if (completenessScore < 60) {
    // Low completeness usually goes to standard review to request info
    recommendedQueue = Queue.STANDARD; 
  }

  return {
    completenessScore,
    fraudRiskScore: riskScore,
    riskLevel,
    riskFactors,
    completenessIssues,
    recommendedQueue
  };
};