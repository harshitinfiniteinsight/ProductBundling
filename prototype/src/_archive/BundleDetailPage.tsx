import { Bundle, Product } from '../types';
import { formatCurrency, getProductById } from '../utils/pricing';

interface BundleDetailPageProps {
  bundle: Bundle;
  products: Product[];
  onBack: () => void;
  onEdit: (bundle: Bundle) => void;
  onDuplicate: (bundle: Bundle) => void;
  onArchive: (bundle: Bundle) => void;
  onStatusChange: (id: number, status: boolean) => void;
}

export function BundleDetailPage({
  bundle,
  products,
  onBack,
  onEdit,
  onDuplicate,
  onArchive,
  onStatusChange,
}: BundleDetailPageProps) {
  return (
    <div className="panel">
      <div className="row-between">
        <div>
          <p className="subtle-text">Bundle Detail</p>
          <h2>{bundle.name}</h2>
        </div>
        <button type="button" className="secondary-btn" onClick={onBack}>
          ← Back to listing
        </button>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h4>Bundle Information</h4>
          <p>
            <strong>Type:</strong> {bundle.type}
          </p>
          <p>
            <strong>Description:</strong> {bundle.description}
          </p>
          <p>
            <strong>Created:</strong> {new Date(bundle.createdAt).toLocaleString()}
          </p>
          <div className="status-row">
            <strong>Status:</strong>
            <label className="switch">
              <input
                type="checkbox"
                checked={bundle.status}
                onChange={(event) => onStatusChange(bundle.id, event.target.checked)}
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="card">
          <h4>Discount Rules</h4>
          {bundle.type === 'BOGO' && bundle.bogoRule ? (
            <p>
              Buy {bundle.bogoRule.buyQty} {getProductById(products, bundle.bogoRule.buyProductId)?.name} →
              Get {bundle.bogoRule.getQty} {getProductById(products, bundle.bogoRule.getProductId)?.name}{' '}
              {bundle.bogoRule.discountType === 'FREE'
                ? 'Free'
                : bundle.bogoRule.discountType === 'PERCENTAGE'
                  ? `at ${bundle.bogoRule.discountValue}% off`
                  : `at ${formatCurrency(bundle.bogoRule.discountValue)} off`}
            </p>
          ) : (
            <p>
              {bundle.bundleDiscount?.type === 'PERCENTAGE'
                ? `${bundle.bundleDiscount.value}% bundle discount`
                : bundle.bundleDiscount?.type === 'FIXED_BUNDLE_PRICE'
                  ? `Fixed bundle price ${formatCurrency(bundle.bundleDiscount.value)}`
                  : 'No bundle-level discount'}
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h4>Products Included</h4>
        {bundle.type === 'BUNDLE' ? (
          <ul className="preview-list">
            {bundle.products.map((item, index) => (
              <li key={`${item.productId}-${index}`}>
                {item.quantity} × {getProductById(products, item.productId)?.name ?? 'Unknown Product'}
              </li>
            ))}
          </ul>
        ) : (
          <p className="subtle-text">BOGO bundles are configured through buy/get rules.</p>
        )}
      </div>

      <div className="modal-actions">
        <button type="button" className="primary-btn" onClick={() => onEdit(bundle)}>
          Edit
        </button>
        <button type="button" className="secondary-btn" onClick={() => onDuplicate(bundle)}>
          Duplicate Bundle
        </button>
        <button type="button" className="secondary-btn danger" onClick={() => onArchive(bundle)}>
          Archive Bundle
        </button>
      </div>
    </div>
  );
}