import { Product, BogoDiscountType } from '../types';

interface BogoPreviewCardProps {
  buyProduct: Product | undefined;
  buyQuantity: number;
  getProduct: Product | undefined;
  getQuantity: number;
  discountType: BogoDiscountType;
  discountValue: number;
}

export function BogoPreviewCard({
  buyProduct,
  buyQuantity,
  getProduct,
  getQuantity,
  discountType,
  discountValue,
}: BogoPreviewCardProps) {
  const isEmpty = !buyProduct || !getProduct;

  // Calculate pricing
  const originalPrice = getProduct ? getProduct.price * getQuantity : 0;
  
  const getDiscountedPrice = (): number => {
    if (discountType === 'FREE') {
      return 0;
    } else if (discountType === 'PERCENTAGE') {
      return originalPrice * (1 - discountValue / 100);
    } else {
      // Fixed discount
      return Math.max(0, originalPrice - discountValue);
    }
  };

  const discountedPrice = getDiscountedPrice();

  const getDiscountLabel = (): string => {
    if (discountType === 'FREE') {
      return 'FREE';
    } else if (discountType === 'PERCENTAGE') {
      return `${discountValue}% OFF`;
    } else {
      return `$${discountValue.toFixed(2)} OFF`;
    }
  };

  if (isEmpty) {
    return (
      <div className="bogo-preview-card empty-state">
        <p>Select products to see price preview.</p>
      </div>
    );
  }

  return (
    <div className="bogo-preview-card">
      <h4 className="preview-card-title">Live Offer Preview</h4>

      {/* Visual Preview */}
      <div className="preview-card-visual">
        {/* BUY Section */}
        <div className="preview-section buy-section">
          <div className="section-label">BUY</div>
          <div className="product-icon">📦</div>
          <div className="product-name">{buyProduct?.name}</div>
          <div className="quantity-badge">Qty: {buyQuantity}</div>
        </div>

        {/* Arrow */}
        <div className="preview-arrow">→</div>

        {/* GET Section */}
        <div className="preview-section get-section">
          <div className="section-label">GET</div>
          <div className="product-icon">📦</div>
          <div className="product-name">{getProduct?.name}</div>
          <div className="quantity-badge">Qty: {getQuantity}</div>
        </div>

        {/* Arrow */}
        <div className="preview-arrow">→</div>

        {/* REWARD Section with Pricing */}
        <div className="preview-section reward-section">
          <div className="section-label">REWARD</div>
          <div className="reward-pricing">
            <div className="original-price">${originalPrice.toFixed(2)}</div>
            <div className="discounted-price">${discountedPrice.toFixed(2)}</div>
            <div className="discount-badge">{getDiscountLabel()}</div>
          </div>
        </div>
      </div>

      {/* Summary Text */}
      <div className="preview-card-summary">
        <p>
          Customers will see:
          <br />
          <span className="summary-highlight">
            Buy {buyQuantity} {buyProduct?.name} → Get {getQuantity} {getProduct?.name}
            <br />
            ${originalPrice.toFixed(2)} → ${discountedPrice.toFixed(2)} ({getDiscountLabel()})
          </span>
        </p>
      </div>
    </div>
  );
}
