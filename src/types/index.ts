export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum ClaimStatus {
  SUBMITTED = 'Submitted',
  ANALYZED = 'Analyzed',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum Queue {
  FAST_TRACK = 'Fast-Track',
  STANDARD = 'Standard Review',
  INVESTIGATION = 'Investigation'
}

export enum ClaimType {
  AUTO = 'Auto',
  HOME = 'Home',
  GADGET = 'Gadget',
  TRAVEL = 'Travel'
}

export interface DocumentMetadata {
  name: string;
  type: string;
  size: number;
}

export interface AnalysisResult {
  completenessScore: number; // 0-100
  fraudRiskScore: number; // 0-100
  riskLevel: RiskLevel;
  riskFactors: string[];
  completenessIssues: string[];
  recommendedQueue: Queue;
}

export interface Claim {
  id: string;
  claimantName: string;
  policyNumber: string;
  type: ClaimType;
  incidentDate: string;
  incidentDescription: string;
  location: string;
  documents: DocumentMetadata[];
  submissionDate: string;
  status: ClaimStatus;
  analysis?: AnalysisResult;
}