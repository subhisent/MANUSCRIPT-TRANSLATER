export type PageType = 'dashboard' | 'upload' | 'scan' | 'research' | 'voice' | 'report';
export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'zh' | 'ta' | 'te';
export type DocType =
  | 'land_doc'
  | 'property_record'
  | 'village_account'
  | 'tax_record'
  | 'genealogy'
  | 'palm_leaf'
  | 'sculpture'
  | 'copper_plate'
  | 'Field Scan'
  | string;

export interface User {
  id: string;
  email: string;
  name: string;
  profilePic?: string;
}

export interface ScanRecord {
  id: string;
  type: DocType;
  timestamp: string;
  originalText: string;
  language?: string;
  imageUrl?: string;
  translatedText?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
  /** @deprecated Prefer `type` — kept for localStorage compatibility */
  fileName?: string;
  category?: string;
  uploadDate?: string;
  sourceText?: string;
}

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  language: string;
  confidence: number;
}

export interface ResearchData {
  id: string;
  title: string;
  description: string;
  relatedRecords: string[];
  createdDate: string;
}
