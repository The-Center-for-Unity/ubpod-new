export interface Position {
  x: number;
  y: number;
}

export type FocusLevel = 'none' | 'barely' | 'low' | 'moderate' | 'balanced' | 'strong' | 'high' | 'very high' | 'maximal';

export interface DomainFocus {
  discovery: FocusLevel;
  connection: FocusLevel;
  wisdom: FocusLevel;
}

export interface ProjectLink {
  url: string;
  label: string;
}

export type Provider = {
  id: string;
  recordId: string;  // Airtable's internal record ID
  name: string;
  description: string;
  color: string;
  permissionGranted: boolean;
};

export interface Project {
  id: string;
  recordId: string;  // Airtable's internal record ID
  name: string;
  shortDescription: string;
  longDescription: string;
  position?: Position;
  affinities: {
    discovery: number;
    connection: number;
    wisdom: number;
  };
  focus: DomainFocus;
  status: "development" | "active" | "planning";
  links?: ProjectLink[];
  tags: string[];
  providerId: string;
  seekerFriendliness: number; // 1-5 rating
  websiteUrl?: string; // Optional URL to the project's website
  permissionGranted: boolean;
}

export type Domain = {
  id: string;
  recordId: string;  // Airtable's internal record ID
  name: string;
  color: string;
  description: string;
};