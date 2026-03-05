import { Bundle, BundleDiscountType, Product } from '../types';
import { calculateBundleSummary, formatCurrency } from '../utils/pricing';

interface PricingSummaryCardProps {
  draft: Bundle;
  products: Product[];
  onChange: (bundle: Bundle) => void;
  disabled?: boolean;
}

export function PricingSummaryCard({ draft, products, onChange, disabled = false }: PricingSummaryCardProps) {
  const summary = calculateBundleSummary(draft, products);

  return (
    <section className="card form-section">
      <div className="section-header">
        <h3>Section 3 — Pricing</h3>
      </div>

      <div className="section-body">
        <div className="card inner-card">
          <div className="section-header compact">
            <h4>Pricing Summary</h4>
          </div>

          {draft.type === 'BUNDLE' && (
            <div className="section-grid">
              <label className="field">
                Bundle Discount Option
                <select
                  className="input"
                  disabled={disabled}
                  value={draft.discountType as BundleDiscountType}
                  onChange={(event) =>
                    onChange({
                      ...draft,
                      discountType: event.target.value as BundleDiscountType,
                      discountValue: event.target.value === 'NONE' ? 0 : draft.discountValue,
                    })
                  }
                >
                  <option value="NONE">None</option>
                  <option value="PERCENTAGE">Percentage Discount</option>
                  <option value="FIXED_BUNDLE_PRICE">Fixed Bundle Price</option>
                </select>
              </label>

              {draft.discountType !== 'NONE' && (
                <label className="field">
                  {draft.discountType === 'PERCENTAGE' ? 'Discount Percentage' : 'Fixed Bundle Price'}
                  <input
                    className="input"
                    type="number"
                    min={0}
                    disabled={disabled}
                    value={draft.discountValue}
                    onChange={(event) =>
                      onChange({ ...draft, discountValue: Math.max(0, Number(event.target.value) || 0) })
                    }
                  />
                </label>
              )}
            </div>
          )}

          <div className="price-grid-row">
            <div>
              <p className="subtle-text">Original total price</p>
              <strong>{formatCurrency(summary.originalTotalPrice)}</strong>
            </div>
            <div>
              <p className="subtle-text">Product discounts</p>
              <strong>{formatCurrency(summary.productDiscounts)}</strong>
            </div>
            <div>
              <p className="subtle-text">Bundle level discount</p>
              <strong>{formatCurrency(summary.bundleLevelDiscount)}</strong>
            </div>
            <div>
              <p className="subtle-text">Final bundle price</p>
              <strong className="highlight">{formatCurrency(summary.finalPrice)}</strong>
            </div>
            <div>
              <p className="subtle-text">Customer savings</p>
              <strong className="success">{formatCurrency(summary.savings)}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}