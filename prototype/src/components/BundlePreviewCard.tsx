import { Bundle, Product } from '../types';
import { calculateBundleSummary, formatCurrency, getProductById } from '../utils/pricing';

interface BundlePreviewCardProps {
  draft: Bundle;
  products: Product[];
}

export function BundlePreviewCard({ draft, products }: BundlePreviewCardProps) {
  const summary = calculateBundleSummary(draft, products);

  return (
    <section className="card form-section">
      <div className="section-header">
        <h3>Section 4 — Preview</h3>
      </div>

      <div className="section-body">
        <div className="card inner-card">
          <div className="section-header compact">
            <h4>Customer View Preview</h4>
          </div>

          <div className="storefront-card">
            <div className="row-between">
              <h4>{draft.name || 'Bundle Name'}</h4>
              <span className="savings-badge">Save {formatCurrency(summary.savings)}</span>
            </div>
            <p className="subtle-text">{draft.descriptionBasic || 'Bundle description preview.'}</p>

            <ul className="preview-list">
              {draft.type === 'BOGO' && draft.bogoRule ? (
                <li>
                  Buy {draft.bogoRule.buyQuantity}{' '}
                  {getProductById(products, draft.bogoRule.buyProductId)?.name ?? 'Product'} and get{' '}
                  {draft.bogoRule.getQuantity}{' '}
                  {getProductById(products, draft.bogoRule.getProductId)?.name ?? 'Product'}
                </li>
              ) : (
                draft.items.map((item, index) => (
                  <li key={`${item.productId}-${index}`}>
                    {item.quantity} × {getProductById(products, item.productId)?.name ?? 'Product'}
                  </li>
                ))
              )}
            </ul>

            <div className="price-line">
              <span className="striked">{formatCurrency(summary.originalTotalPrice)}</span>
              <strong>{formatCurrency(summary.finalPrice)}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}