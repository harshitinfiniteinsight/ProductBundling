import { Bundle, BundleItem, PriceSummary, Product } from '../types';

const round = (value: number) => Math.round(value * 100) / 100;

export const getProductById = (products: Product[], productId: number) =>
  products.find((product) => product.id === productId);

export const calculateItemLineTotal = (
  item: BundleItem,
  products: Product[],
): { original: number; final: number } => {
  const product = getProductById(products, item.productId);
  if (!product) {
    return { original: 0, final: 0 };
  }

  const original = product.price * item.quantity;
  const discounted = original * (1 - item.individualDiscount / 100);

  return {
    original: round(original),
    final: round(discounted),
  };
};

export const calculateBundleSummary = (
  bundle: Pick<Bundle, 'type' | 'items' | 'bogoRule' | 'discountType' | 'discountValue'>,
  products: Product[],
): PriceSummary => {
  if (bundle.type === 'BOGO' && bundle.bogoRule) {
    const buyProduct = getProductById(products, bundle.bogoRule.buyProductId);
    const getProduct = getProductById(products, bundle.bogoRule.getProductId);
    if (!buyProduct || !getProduct) {
      return {
        originalTotalPrice: 0,
        productDiscounts: 0,
        bundleLevelDiscount: 0,
        finalPrice: 0,
        savings: 0,
      };
    }

    const buyTotal = buyProduct.price * bundle.bogoRule.buyQuantity;
    const getTotal = getProduct.price * bundle.bogoRule.getQuantity;
    const totalOriginal = round(buyTotal + getTotal);

    let bundleLevelDiscount = 0;
    if (bundle.bogoRule.discountType === 'FREE') {
      bundleLevelDiscount = getTotal;
    } else if (bundle.bogoRule.discountType === 'PERCENTAGE') {
      bundleLevelDiscount = getTotal * (bundle.bogoRule.discountValue / 100);
    } else {
      bundleLevelDiscount = Math.min(
        getTotal,
        bundle.bogoRule.discountValue * bundle.bogoRule.getQuantity,
      );
    }

    const finalPrice = Math.max(0, totalOriginal - bundleLevelDiscount);

    return {
      originalTotalPrice: round(totalOriginal),
      productDiscounts: 0,
      bundleLevelDiscount: round(bundleLevelDiscount),
      finalPrice: round(finalPrice),
      savings: round(bundleLevelDiscount),
    };
  }

  const lineTotals = bundle.items.map((item) => calculateItemLineTotal(item, products));
  const totalOriginal = lineTotals.reduce((sum, line) => sum + line.original, 0);
  const afterItemDiscounts = lineTotals.reduce((sum, line) => sum + line.final, 0);
  const productDiscounts = Math.max(0, totalOriginal - afterItemDiscounts);

  let finalPrice = afterItemDiscounts;
  if (bundle.discountType === 'PERCENTAGE') {
    finalPrice = afterItemDiscounts * (1 - bundle.discountValue / 100);
  }
  if (bundle.discountType === 'FIXED_BUNDLE_PRICE') {
    finalPrice = bundle.discountValue;
  }

  const bundleLevelDiscount = Math.max(0, afterItemDiscounts - finalPrice);
  const savings = Math.max(0, totalOriginal - finalPrice);

  return {
    originalTotalPrice: round(totalOriginal),
    productDiscounts: round(productDiscounts),
    bundleLevelDiscount: round(bundleLevelDiscount),
    finalPrice: round(finalPrice),
    savings: round(savings),
  };
};

export const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
