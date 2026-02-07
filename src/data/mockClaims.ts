/**
 * Mock data for ClaimSure demo
 * Diverse, realistic claim scenarios for testing all aspects of the AI analysis
 */

import { Claim, ClaimStatus, ClaimType, RiskLevel, Queue } from '../types';

/**
 * Pre-analyzed mock claims showcasing various scenarios
 */
export const MOCK_CLAIMS: Claim[] = [
   // ========================================
   // LOW RISK - FAST TRACK EXAMPLES
   // ========================================
   {
      id: 'CL-839210',
      claimantName: 'John Doe',
      policyNumber: 'POL-9921',
      type: ClaimType.GADGET,
      incidentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
      incidentDescription:
         'I accidentally dropped my iPhone 14 Pro Max while hiking on the Mist Trail at Yosemite National Park. The screen is completely shattered and the device will not turn on. The incident occurred around 2 PM on a sunny afternoon. I have photos of the damaged device and my hiking permit from that day.',
      location: 'Yosemite National Park, Mist Trail, California',
      documents: [
         { name: 'shattered_screen_closeup.jpg', type: 'image/jpeg', size: 2048000 },
         { name: 'device_full_view.jpg', type: 'image/jpeg', size: 1856000 },
         { name: 'hiking_permit.pdf', type: 'application/pdf', size: 245000 },
      ],
      submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: ClaimStatus.ANALYZED,
      analysis: {
         completenessScore: 95,
         fraudRiskScore: 12,
         riskLevel: RiskLevel.LOW,
         riskFactors: [],
         completenessIssues: [],
         recommendedQueue: Queue.FAST_TRACK,
      },
   },

   {
      id: 'CL-742388',
      claimantName: 'Emily Davis',
      policyNumber: 'POL-5521',
      type: ClaimType.AUTO,
      incidentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
      incidentDescription:
         'My vehicle was involved in a minor collision at the intersection of 5th Avenue and Main Street. Another driver ran a red light and collided with the rear passenger side of my 2022 Honda Accord. The police were called to the scene and filed a report. The other driver accepted fault. Damage is limited to the rear bumper and right tail light.',
      location: '5th Avenue & Main Street, Springfield, IL',
      documents: [
         { name: 'police_report_20240202.pdf', type: 'application/pdf', size: 512000 },
         { name: 'damage_rear_bumper.jpg', type: 'image/jpeg', size: 1920000 },
         { name: 'damage_tail_light.jpg', type: 'image/jpeg', size: 1650000 },
         { name: 'other_driver_insurance.jpg', type: 'image/jpeg', size: 980000 },
      ],
      submissionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: ClaimStatus.ANALYZED,
      analysis: {
         completenessScore: 98,
         fraudRiskScore: 8,
         riskLevel: RiskLevel.LOW,
         riskFactors: [],
         completenessIssues: [],
         recommendedQueue: Queue.FAST_TRACK,
      },
   },

   // ========================================
   // MEDIUM RISK - STANDARD REVIEW EXAMPLES
   // ========================================
   {
      id: 'CL-856129',
      claimantName: 'Michael Johnson',
      policyNumber: 'POL-3344',
      type: ClaimType.TRAVEL,
      incidentDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 40 days ago
      incidentDescription:
         "My luggage was lost during my flight from New York to Paris. I don't know exactly where it was lost but it never arrived at the baggage claim. The airline said they would track it but I haven't heard back. It contained my laptop and some clothes.",
      location: 'Charles de Gaulle Airport, Paris',
      documents: [
         { name: 'boarding_pass.pdf', type: 'application/pdf', size: 156000 },
      ],
      submissionDate: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      status: ClaimStatus.ANALYZED,
      analysis: {
         completenessScore: 55,
         fraudRiskScore: 45,
         riskLevel: RiskLevel.MEDIUM,
         riskFactors: [
            'Delayed reporting: 40 days after incident.',
            'Vague details regarding incident cause.',
            'Claim indicates high-value or total loss.',
         ],
         completenessIssues: [
            'Low evidence count (only 1 document).',
            'Description lacks specific details.',
         ],
         recommendedQueue: Queue.STANDARD,
      },
   },

   {
      id: 'CL-923451',
      claimantName: 'Sarah Williams',
      policyNumber: 'POL-7788',
      type: ClaimType.HOME,
      incidentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days ago
      incidentDescription:
         'Water damage occurred in my basement. I noticed it around 3am when I heard dripping sounds. Not sure what caused it, maybe a pipe burst or something. The damage is pretty bad.',
      location: '742 Evergreen Terrace, Springfield',
      documents: [
         { name: 'photo1.jpg', type: 'image/jpeg', size: 1024000 },
         { name: 'photo2.jpg', type: 'image/jpeg', size: 980000 },
      ],
      submissionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: ClaimStatus.ANALYZED,
      analysis: {
         completenessScore: 60,
         fraudRiskScore: 42,
         riskLevel: RiskLevel.MEDIUM,
         riskFactors: [
            'Incident occurred during high-risk hours.',
            'Vague details regarding incident cause.',
            'Documents have generic filenames (potential stock images).',
         ],
         completenessIssues: [
            'Incident description is too brief.',
            'Description lacks specific details.',
         ],
         recommendedQueue: Queue.STANDARD,
      },
   },

   // ========================================
   // HIGH RISK - INVESTIGATION EXAMPLES
   // ========================================
   {
      id: 'CL-839215',
      claimantName: 'Jane Smith',
      policyNumber: 'POL-1123',
      type: ClaimType.AUTO,
      incidentDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 65 days ago
      incidentDescription:
         "My car was stolen. I parked it somewhere downtown, maybe near the bar I don't remember exactly. I had a lot of cash in the glove compartment, around $5000. This is urgent I need the money immediately.",
      location: 'Downtown, near some bars',
      documents: [],
      submissionDate: new Date(Date.now() - 63 * 24 * 60 * 60 * 1000).toISOString(),
      status: ClaimStatus.ANALYZED,
      analysis: {
         completenessScore: 25,
         fraudRiskScore: 92,
         riskLevel: RiskLevel.HIGH,
         riskFactors: [
            'High-risk asset claimed (Cash/Currency).',
            'Vague details regarding incident cause.',
            'Claim shows urgency pressure indicators.',
            'Missing visual evidence or documentation.',
            'Significantly delayed reporting: 65 days after incident.',
            'Location description is vague or suspicious.',
         ],
         completenessIssues: [
            'Incident description is too brief.',
            'No supporting evidence uploaded.',
            'Description lacks specific details.',
            'Location lacks specificity.',
            'Auto claims typically require at least 2 documents.',
         ],
         recommendedQueue: Queue.INVESTIGATION,
      },
   },

   {
      id: 'CL-745632',
      claimantName: 'Robert Martinez',
      policyNumber: 'POL-2211',
      type: ClaimType.GADGET,
      incidentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      incidentDescription:
         'My brand new MacBook Pro was completely destroyed in a fire at night around 2am in a parking lot alley. Total loss, need replacement immediately. Very expensive device.',
      location: 'Parking lot alley',
      documents: [
         { name: 'image.jpg', type: 'image/jpeg', size: 512000 },
      ],
      submissionDate: new Date().toISOString(),
      status: ClaimStatus.ANALYZED,
      analysis: {
         completenessScore: 35,
         fraudRiskScore: 78,
         riskLevel: RiskLevel.HIGH,
         riskFactors: [
            'Incident occurred during high-risk hours.',
            'Claim shows urgency pressure indicators.',
            'Claim indicates high-value or total loss.',
            'Documents have generic filenames (potential stock images).',
            'Incident occurred in high-risk location.',
            'Location description is vague or suspicious.',
         ],
         completenessIssues: [
            'Incident description is extremely brief.',
            'Low evidence count (only 1 document).',
            'Location lacks specificity.',
         ],
         recommendedQueue: Queue.INVESTIGATION,
      },
   },
];

/**
 * Get random mock claimant name
 */
export const getRandomClaimantName = (): string => {
   const names = [
      'Alice Thompson',
      'Bob Richardson',
      'Carol Martinez',
      'David Lee',
      'Emma Wilson',
      'Frank Anderson',
      'Grace Taylor',
      'Henry Moore',
   ];
   return names[Math.floor(Math.random() * names.length)];
};
