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
}

export interface CampaignFormat {
  id: string;
  name: string;
  description: string;
  details: string[];
  icon: string;
  image?: string;
}
