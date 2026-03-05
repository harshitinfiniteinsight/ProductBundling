import { Bundle, Product } from '../types';
import { calculateBundleSummary } from '../utils/pricing';
import { BundleOfferPreviewCard } from './BundleOfferPreviewCard';

interface BundlePreviewStepProps {
  draft: Bundle;
  products: Product[];
  onBack: () => void;
  onSaveDraft: () => void;
  onSaveActivate: () => void;
}

export function BundlePreviewStep({
  draft,
  products,
  onBack,
  onSaveDraft,
  onSaveActivate,
}: BundlePreviewStepProps) {
  const summary = calculateBundleSummary(draft, products);

  // Prepare product data for the offer card
  const offerProducts = draft.type === 'BOGO' && draft.bogoRule
    ? [
        {
          id: draft.bogoRule.buyProductId,
          name: products.find((p) => p.id === draft.bogoRule!.buyProductId)?.name || 'Product',
          quantity: draft.bogoRule.buyQuantity,
          hasDiscount: false,
          discountPercent: 0,
          image: undefined, // Products don't have images in mock data yet
        },
        {
          id: draft.bogoRule.getProductId,
          name: products.find((p) => p.id === draft.bogoRule!.getProductId)?.name || 'Product',
          quantity: draft.bogoRule.getQuantity,
          hasDiscount: true,
          discountPercent: draft.bogoRule.discountType === 'FREE' 
            ? 100 
            : draft.bogoRule.discountType === 'PERCENTAGE'
            ? draft.bogoRule.discountValue
            : 0,
          image: undefined, // Products don't have images in mock data yet
        },
      ]
    : draft.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          id: item.productId,
          name: product?.name || 'Product',
          quantity: item.quantity,
          hasDiscount: item.individualDiscount > 0,
          discountPercent: item.individualDiscount,
          image: undefined, // Products don't have images in mock data yet
        };
      });

  return (
    <div className="preview-step">
      {/* Storefront Preview Card */}
      <section className="card form-section">
        <div className="section-header">
          <h3>Bundle Preview</h3>
          <p className="section-helper-text">This is how your bundle will appear to customers.</p>
        </div>

        <div className="section-body">
          <BundleOfferPreviewCard
            bundleName={draft.name}
            products={offerProducts}
            bundlePrice={summary.finalPrice}
            originalPrice={summary.originalTotalPrice}
            savings={summary.savings}
            description={draft.descriptionBasic}
            showHeader={draft.displayHeader}
            showFooter={draft.displayFooter}
            logoUrl={draft.logoUrl}
            businessName={draft.businessName}
            businessAddress={draft.businessAddress}
            businessPhone={draft.businessPhone}
            buttonLabel={draft.buttonLabel || 'Pay Now'}
          />
        </div>
      </section>

      {/* Summary Section */}
      <section className="card form-section">
        <div className="section-header">
          <h3>Bundle Summary</h3>
        </div>

        <div className="section-body">
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Bundle Type:</span>
              <span className="summary-value">{draft.type === 'BOGO' ? 'BOGO' : 'Product Bundle'}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Status:</span>
              <span className={`summary-value ${draft.status ? 'active' : 'inactive'}`}>
                {draft.status ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Products:</span>
              <span className="summary-value">
                {draft.type === 'BOGO' 
                  ? `${draft.bogoRule ? 2 : 0} products`
                  : `${draft.items.length} product${draft.items.length !== 1 ? 's' : ''}`
                }
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Original Price:</span>
              <span className="summary-value">${summary.originalTotalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Final Price:</span>
              <span className="summary-value final">${summary.finalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Total Savings:</span>
              <span className="summary-value savings">${summary.savings.toFixed(2)}</span>
            </div>
          </div>

          {draft.type === 'BOGO' && draft.bogoRule && (
            <div className="bogo-rule-summary">
              <h4>BOGO Rule:</h4>
              <p>
                Buy {draft.bogoRule.buyQuantity}x{' '}
                {products.find((p) => p.id === draft.bogoRule!.buyProductId)?.name} → Get{' '}
                {draft.bogoRule.getQuantity}x{' '}
                {products.find((p) => p.id === draft.bogoRule!.getProductId)?.name}{' '}
                {draft.bogoRule.discountType === 'FREE' && 'Free'}
                {draft.bogoRule.discountType === 'PERCENTAGE' && `at ${draft.bogoRule.discountValue}% off`}
                {draft.bogoRule.discountType === 'FIXED' && `at $${draft.bogoRule.discountValue.toFixed(2)} off`}
              </p>
              {draft.bogoRule.limitPerOrder && (
                <p className="limit-info">Limit: {draft.bogoRule.limitPerOrder} per order</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <section className="card form-section">
        <div className="section-body">
          <div className="step-actions">
            <button type="button" className="secondary-btn" onClick={onBack}>
              ← Back
            </button>
            <div className="actions-right">
              <button type="button" className="secondary-btn" onClick={onSaveDraft}>
                Save Draft
              </button>
              <button type="button" className="primary-btn" onClick={onSaveActivate}>
                Save & Activate Bundle
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
