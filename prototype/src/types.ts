export type BundleType = 'BOGO' | 'BUNDLE';

export type BogoDiscountType = 'FREE' | 'PERCENTAGE' | 'FIXED';
export type BundleDiscountType = 'NONE' | 'PERCENTAGE' | 'FIXED_BUNDLE_PRICE';
export type DiscountType = BogoDiscountType | BundleDiscountType;

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface BundleItem {
  productId: number;
  quantity: number;
  individualDiscount: number;
}

export interface BogoRule {
  buyProductId: number;
  buyQuantity: number;
  getProductId: number;
  getQuantity: number;
  discountType: BogoDiscountType;
  discountValue: number;
  limitPerOrder?: number;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface Bundle {
  id: number;
  name: string;
  type: BundleType;
  descriptionBasic: string;
  descriptionAdvanced: string;
  items: BundleItem[];
  discountType: DiscountType;
  discountValue: number;
  status: boolean;
  createdAt: string;
  bogoRule?: BogoRule;
  displayHeader?: boolean;
  displayFooter?: boolean;
  logoUrl?: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  buttonLabel?: string;
}

export interface PriceSummary {
  originalTotalPrice: number;
  productDiscounts: number;
  bundleLevelDiscount: number;
  finalPrice: number;
  savings: number;
}