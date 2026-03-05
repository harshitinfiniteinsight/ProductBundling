import { Bundle } from '../types';

interface BundleTableProps {
  bundles: Bundle[];
  onStatusChange: (id: number, status: boolean) => void;
  onView: (bundle: Bundle) => void;
  onEdit: (bundle: Bundle) => void;
}

export function BundleTable({ bundles, onStatusChange, onView, onEdit }: BundleTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Bundle Name</th>
          <th>Bundle Type</th>
          <th>Bundle Discount</th>
          <th>Products Count</th>
          <th>Created On</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bundles.map((bundle) => (
          <tr key={bundle.id}>
            <td>{bundle.id}</td>
            <td>{bundle.name}</td>
            <td>
              <span className="chip">{bundle.type === 'BOGO' ? 'BOGO' : 'Bundle'}</span>
            </td>
            <td>
              {bundle.type === 'BOGO'
                ? `${bundle.discountType} ${bundle.discountType === 'FREE' ? '' : bundle.discountValue}`
                : bundle.bundleDiscount?.type === 'PERCENTAGE'
                  ? `${bundle.bundleDiscount.value}%`
                  : bundle.bundleDiscount?.type === 'FIXED_BUNDLE_PRICE'
                    ? `$${bundle.bundleDiscount.value}`
                    : 'No discount'}
            </td>
            <td>{bundle.type === 'BOGO' ? 2 : bundle.products.length}</td>
            <td>{new Date(bundle.createdAt).toLocaleString()}</td>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={bundle.status}
                  onChange={(event) => onStatusChange(bundle.id, event.target.checked)}
                />
                <span className="slider" />
              </label>
            </td>
            <td>
              <div className="icon-actions">
                <button type="button" className="icon-btn" onClick={() => onView(bundle)}>
                  👁
                </button>
                <button type="button" className="icon-btn" onClick={() => onEdit(bundle)}>
                  ✎
                </button>
                <button type="button" className="icon-btn">
                  ⋮
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}