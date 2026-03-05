

interface BundleOfferPreviewCardProps {
  bundleName: string;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    hasDiscount: boolean;
    discountPercent?: number;
    image?: string;
  }>;
  bundlePrice: number;
  originalPrice: number;
  savings: number;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  logoUrl?: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  buttonLabel?: string;
}

export function BundleOfferPreviewCard({
  bundleName,
  products,
  bundlePrice,
  originalPrice,
  savings,
  description,
  showHeader = false,
  showFooter = false,
  logoUrl,
  businessName,
  businessAddress,
  businessPhone,
  buttonLabel = 'Pay Now',
}: BundleOfferPreviewCardProps) {
  return (
    <div className="bundle-offer-card">
      {/* Header Section */}
      {showHeader && (
        <div className="bundle-card-header">
          {logoUrl ? (
            <img src={logoUrl} alt="Business Logo" className="business-logo" />
          ) : (
            <div className="business-name-fallback">{businessName || 'Business Name'}</div>
          )}
        </div>
      )}

      {/* Bundle Name */}
      <h2 className="offer-title">{bundleName || 'Untitled Bundle'}</h2>

      {/* Product Images Row */}
      <div className="product-images-row">
        {products.map((product, index) => (
          <div key={product.id} className="product-image-group">
            <div className="product-image-wrapper">
              {product.image ? (
                <img src={product.image} alt={product.name} className="product-image" />
              ) : (
                <div className="product-image-placeholder">
                  <span>📦</span>
                </div>
              )}
            </div>
            {index < products.length - 1 && <span className="plus-icon">+</span>}
          </div>
        ))}
      </div>

      {/* Product Names */}
      <div className="product-names">
        {products.map((product, index) => (
          <span key={product.id} className="product-name-item">
            {product.quantity > 1 && `${product.quantity}x `}
            {product.name}
            {product.hasDiscount && product.discountPercent && product.discountPercent > 0 && (
              <span className="discount-tag"> ({product.discountPercent}% off)</span>
            )}
            {index < products.length - 1 && <span className="separator"> • </span>}
          </span>
        ))}
      </div>

      {/* Bundle Price */}
      <div className="offer-pricing">
        <div className="price-label">Bundle Price</div>
        <div className="current-price">${bundlePrice.toFixed(2)}</div>
        {savings > 0 && (
          <div className="regular-price">Regular price ${originalPrice.toFixed(2)}</div>
        )}
      </div>

      {/* Savings Badge */}
      {savings > 0 && (
        <div className="savings-badge">
          Save ${savings.toFixed(2)}
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="offer-description">
          <p>{description}</p>
        </div>
      )}

      {/* Checkout Button */}
      <button className="offer-checkout-button">{buttonLabel}</button>

      {/* Footer Section */}
      {showFooter && (
        <div className="bundle-card-footer">
          {businessName && <p className="footer-business-name">{businessName}</p>}
          {businessAddress && <p className="footer-business-address">{businessAddress}</p>}
          {businessPhone && <p className="footer-business-phone">📞 {businessPhone}</p>}
        </div>
      )}
    </div>
  );
}
