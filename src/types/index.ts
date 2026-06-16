export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  featured: boolean;
  shortDescription: string;
  description: string;
  price: number | null;
  priceLabel: string;
  specs: Record<string, string>;
  certifications: string[];
  color: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  quantity: number;
  priceLabel: string;
  color: string;
  image?: string;
}

export interface PresentationOption {
  id: string;
  name: string;
}

export interface FlowPackVariant {
  id: string;
  name: string;
  description: string;
  details: string[];
  productIds: string[];
}

export interface ConfigOptionChoice {
  id: string;
  name: string;
}

export interface ConfigOption {
  id: string;
  label: string;
  type: "single" | "multiple";
  required?: boolean;
  choices: ConfigOptionChoice[];
}

export interface CampaignFormat {
  id: string;
  name: string;
  description: string;
  details: string[];
  icon: string;
  image?: string;
  productIds?: string[];
  presentationOptions?: PresentationOption[];
  variants?: FlowPackVariant[];
  configOptions?: ConfigOption[];
}

export interface FoilProductSpec {
  widthMm: number;
  lengthMm: string;
  thicknessMicron: number;
  lubricantMg: string;
  wrapper: string;
  deposit: boolean;
  material: string;
}

export interface CampaignData {
  formats: CampaignFormat[];
  baseProducts: { id: string; name: string }[];
  foilSpecs?: Record<string, FoilProductSpec>;
}
