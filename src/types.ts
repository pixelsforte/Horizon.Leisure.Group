export interface ChallengeItem {
  number: string;
  text: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  darkTheme?: boolean;
}

export interface PartnershipModel {
  id: string;
  modelNumber: string;
  title: string;
  percentage: string;
  badge?: string;
  subtitle: string;
  bullets: string[];
}

export interface DifferencePillar {
  number: string;
  title: string;
  description: string;
}

export interface CareerExperience {
  role: string;
  company: string;
  years: string;
}

export interface DirectorProfile {
  name: string;
  title: string;
  imageUrl: string;
  experience: CareerExperience[];
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  description: string;
  tags: string[];
}

export interface EventTab {
  id: string;
  label: string;
  title: string;
  description: string;
  imageUrl: string;
  tagline: string;
  offers: string[];
}

export interface ClientLogo {
  id: string;
  shortName: string;
  fullName: string;
  category: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
