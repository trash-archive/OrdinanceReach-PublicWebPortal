export type OrdinanceStatus = 'active' | 'amended' | 'repealed';

export type OrdinanceCategory =
  | 'Health & Sanitation'
  | 'Traffic & Transport'
  | 'Environment'
  | 'Business & Permits'
  | 'Public Safety'
  | 'Education & Youth'
  | 'Housing & Land Use'
  | 'Social Welfare';

export interface ResponsibleOffice {
  id: string;
  name: string;
  acronym: string;
}

export interface AmendmentRecord {
  date: string;
  description: string;
  ordinanceRef?: string;
}

export interface Ordinance {
  id: string;
  number: string;
  title: string;
  category: OrdinanceCategory;
  status: OrdinanceStatus;
  dateEnacted: string;
  dateAmended?: string;
  author: string;
  aiSummary: string;
  fullText: string;
  responsibleOffices: ResponsibleOffice[];
  affectedSectors: string[];
  amendments?: AmendmentRecord[];
  keywords: string[];
}

export interface CategoryMeta {
  label: OrdinanceCategory;
  icon: string;
  count: number;
}
