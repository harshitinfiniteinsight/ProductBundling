import { Bundle, Product, BundleDiscountType } from '../types';
import { calculateBundleSummary } from '../utils/pricing';

interface BundlePricingStepProps {
  draft: Bundle;
  products: Product[];
  onChange: (bundle: Bundle) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BundlePricingStep({ draft, products, onChange, onNext, onBack }: BundlePricingStepProps) {
  // Check if any products have individual discounts
  const hasProductDiscounts = draft.items.some((item) => item.individualDiscount > 0);
  
  // Check if bundle-level discount will override product discounts
  const showOverrideWarning =
    hasProductDiscounts &&
    (draft.discountType === 'PERCENTAGE' || draft.discountType === 'FIXED_BUNDLE_PRICE');

  // Skip pricing for BOGO bundles (pricing is in the rule)
  if (draft.type === 'BOGO') {
    return (
      <section className="card form-section">
        <div className="section-header">
          <h3>Pricing</h3>
        </div>

        <div className="section-body">
          <div className="info-box">
            <p>BOGO bundle pricing is configured in the BOGO rule. No additional bundle-level discount needed.</p>
          </div>

          {renderPricingSummary(draft, products, hasProductDiscounts)}

          {/* Actions */}
          <div className="step-actions">
            <button type="button" className="secondary-btn" onClick={onBack}>
              ← Back
            </button>
            <button type="button" className="primary-btn" onClick={onNext}>
              Next →
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleDiscountTypeChange = (discountType: BundleDiscountType) => {
    let defaultValue = 0;
    if (discountType === 'PERCENTAGE') {
      defaultValue = 10;
    } else if (discountType === 'FIXED_BUNDLE_PRICE') {
      const summary = calculateBundleSummary(draft, products);
      defaultValue = summary.finalPrice * 0.9; // Default to 10% off
    }

    onChange({
      ...draft,
      discountType,
      discountValue: defaultValue,
    });
  };

  return (
    <section className="card form-section">
      <div className="section-header">
        <h3>Bundle Pricing</h3>
      </div>

      <div className="section-body">
        {/* Bundle Discount Type */}
        <div className="form-group">
          <label className="label">Bundle Discount Type</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="bundleDiscountType"
                checked={draft.discountType === 'NONE'}
                onChange={() => handleDiscountTypeChange('NONE')}
              />
              <span className="radio-label">None</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="bundleDiscountType"
                checked={draft.discountType === 'PERCENTAGE'}
                onChange={() => handleDiscountTypeChange('PERCENTAGE')}
              />
              <span className="radio-label">Percentage Discount</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="bundleDiscountType"
                checked={draft.discountType === 'FIXED_BUNDLE_PRICE'}
                onChange={() => handleDiscountTypeChange('FIXED_BUNDLE_PRICE')}
              />
              <span className="radio-label">Fixed Bundle Price</span>
            </label>
          </div>
        </div>

        {/* Override Warning */}
        {showOverrideWarning && (
          <div className="discount-override-warning">
            <span className="warning-icon">⚠️</span>
            <div className="warning-content">
              <p className="warning-title">Bundle Discount Notice</p>
              <p className="warning-text">
                Applying a bundle-level discount will replace any individual product discounts you set earlier.
              </p>
              <p className="warning-subtext">
                The final price will be calculated using the bundle discount instead of the individual product discounts.
              </p>
            </div>
          </div>
        )}

        {/* Discount Value Input */}
        {draft.discountType === 'PERCENTAGE' && (
          <div className="form-group">
            <label className="label">Discount Percentage</label>
            <input
              type="number"
              className="input"
              min="0"
              max="100"
              value={draft.discountValue}
              onChange={(e) => onChange({ ...draft, discountValue: Number(e.target.value) })}
            />
          </div>
        )}

        {draft.discountType === 'FIXED_BUNDLE_PRICE' && (
          <div className="form-group">
            <label className="label">Fixed Bundle Price ($)</label>
            <input
              type="number"
              className="input"
              min="0"
              step="0.01"
              value={draft.discountValue}
              onChange={(e) => onChange({ ...draft, discountValue: Number(e.target.value) })}
            />
          </div>
        )}

        {/* Pricing Summary */}
        {renderPricingSummary(draft, products, hasProductDiscounts)}

        {/* Actions */}
        <div className="step-actions">
          <button type="button" className="secondary-btn" onClick={onBack}>
            ← Back
          </button>
          <button type="button" className="primary-btn" onClick={onNext}>
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}

function renderPricingSummary(draft: Bundle, products: Product[], hasProductDiscounts: boolean) {
  const summary = calculateBundleSummary(draft, products);

  return (
    <div className="pricing-summary-card">
      <h4>Pricing Summary</h4>
      <div className="pricing-row">
        <span>Original Total Price:</span>
        <span>${summary.originalTotalPrice.toFixed(2)}</span>
      </div>
      {summary.productDiscounts > 0 && (
        <div className="pricing-row discount">
          <span>Product Level Discounts:</span>
          <span>-${summary.productDiscounts.toFixed(2)}</span>
        </div>
      )}
      {summary.bundleLevelDiscount > 0 && (
        <div className="pricing-row discount">
          <span>Bundle Discount:</span>
          <span>-${summary.bundleLevelDiscount.toFixed(2)}</span>
        </div>
      )}
      <div className="pricing-row total">
        <span>Final Bundle Price:</span>
        <span className="final-price">${summary.finalPrice.toFixed(2)}</span>
      </div>
      {summary.savings > 0 && (
        <div className="savings-badge">
          Customer Saves: ${summary.savings.toFixed(2)} ({((summary.savings / summary.originalTotalPrice) * 100).toFixed(0)}%)
        </div>
      )}
    </div>
  );
}
