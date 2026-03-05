import { Bundle, Product } from '../types';
import { calculateBundleSummary, formatCurrency, getProductById } from '../utils/pricing';
import { BundleSummaryCard } from './BundleSummaryCard';

interface BundlePricingPreviewProps {
  bundleDraft: Bundle;
  products: Product[];
}

export function BundlePricingPreview({ bundleDraft, products }: BundlePricingPreviewProps) {
  const summary = calculateBundleSummary(bundleDraft, products);

  return (
    <div className="preview-layout">
      <BundleSummaryCard
        name={bundleDraft.name}
        type={bundleDraft.type}
        status={bundleDraft.status}
        summary={summary}
      />

      <div className="card">
        <h4>Customer View Preview</h4>
        <div className="customer-preview">
          <p className="customer-title">{bundleDraft.name || 'Your Bundle Name'}</p>
          <p className="subtle-text">{bundleDraft.description || 'Bundle description appears here.'}</p>

          {bundleDraft.type === 'BOGO' && bundleDraft.bogoRule ? (
            <p className="rule-banner">
              Buy {bundleDraft.bogoRule.buyQty}{' '}
              {getProductById(products, bundleDraft.bogoRule.buyProductId)?.name ?? 'Product'} → Get{' '}
              {bundleDraft.bogoRule.getQty}{' '}
              {getProductById(products, bundleDraft.bogoRule.getProductId)?.name ?? 'Product'}{' '}
              {bundleDraft.bogoRule.discountType === 'FREE'
                ? 'Free'
                : bundleDraft.bogoRule.discountType === 'PERCENTAGE'
                  ? `at ${bundleDraft.bogoRule.discountValue}% off`
                  : `at ${formatCurrency(bundleDraft.bogoRule.discountValue)} off`}
            </p>
          ) : (
            <ul className="preview-list">
              {bundleDraft.products.map((item) => (
                <li key={`${item.productId}-${item.quantity}`}>
                  {item.quantity} × {getProductById(products, item.productId)?.name ?? 'Unknown Product'}
                </li>
              ))}
            </ul>
          )}

          <div className="preview-price-row">
            <span>Bundle Price</span>
            <strong>{formatCurrency(summary.finalPrice)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}