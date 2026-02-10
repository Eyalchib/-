
export interface QuestionnaireData {
  // Business Details
  businessName: string;
  oneLineDescription: string;
  businessGoal: string;

  // Vision and Values
  vision: string;
  coreValues: string;
  uniqueSellingPoint: string;
  mainMessage: string;
  desiredEmotion: string;

  // Target Audience
  targetAudience: string;
  idealClientProfile: string;
  clientChallenges: string;

  // Design and Style
  preferredStyle: string;
  likedDesigns: string;
  brandColors: string;
  avoidColors: string;
  fontTypes: string;
  vibeScale: string; // "emotional" | "professional" | "balanced"

  // Additional Info
  productsServices: string;
  currentChallenges: string;
  existingLogo: string;
  existingLogoDetails: string;
  professionalsInvolved: string;
  decisionMakers: string;
  inspirationMaterials: string;
}

export type StepKey = 'welcome' | 'business' | 'vision' | 'audience' | 'style' | 'additional' | 'summary';

// New types for Studio Dashboard
export type SubmissionStatus = 'new' | 'in_progress' | 'completed';

export interface Submission extends QuestionnaireData {
  id: string;
  submittedAt: string;
  status: SubmissionStatus;
}
