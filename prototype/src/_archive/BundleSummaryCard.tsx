import { BundleType } from '../types';
import { PriceSummary } from '../types';
import { formatCurrency } from '../utils/pricing';

interface BundleSummaryCardProps {
  name: string;
  type: BundleType;
  status: boolean;
  summary: PriceSummary;
}

export function BundleSummaryCard({ name, type, status, summary }: BundleSummaryCardProps) {
  return (
    <div className="card summary-card">
      <h4>{name || 'Untitled Bundle'}</h4>
      <div className="chip-row">
        <span className="chip">{type === 'BOGO' ? 'BOGO' : 'Product Bundle'}</span>
        <span className={`chip ${status ? 'active' : 'inactive'}`}>{status ? 'Active' : 'Inactive'}</span>
      </div>

      <div className="price-grid">
        <div>
          <p className="subtle-text">Original</p>
          <strong>{formatCurrency(summary.totalOriginal)}</strong>
        </div>
        <div>
          <p className="subtle-text">After item discounts</p>
          <strong>{formatCurrency(summary.afterItemDiscounts)}</strong>
        </div>
        <div>
          <p className="subtle-text">Final price</p>
          <strong className="highlight">{formatCurrency(summary.finalPrice)}</strong>
        </div>
        <div>
          <p className="subtle-text">Customer savings</p>
          <strong className="success">{formatCurrency(summary.savings)}</strong>
        </div>
      </div>
    </div>
  );
}