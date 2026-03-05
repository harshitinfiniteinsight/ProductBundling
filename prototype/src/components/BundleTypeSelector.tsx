import { BundleType } from '../types';

interface BundleTypeSelectorProps {
  value: BundleType;
  onChange: (value: BundleType) => void;
  disabled?: boolean;
}

export function BundleTypeSelector({ value, onChange, disabled = false }: BundleTypeSelectorProps) {
  return (
    <div>
      <p className="section-label">Bundle Type</p>
      <div className="radio-stack">
        <label className="radio-row">
          <input
            type="radio"
            name="bundleType"
            checked={value === 'BOGO'}
            onChange={() => onChange('BOGO')}
            disabled={disabled}
          />
          <span>BOGO</span>
          <span
            className="info-icon"
            title="Customer buys a product in a specified quantity and receives another product free or discounted."
          >
            i
          </span>
        </label>
        <label className="radio-row">
          <input
            type="radio"
            name="bundleType"
            checked={value === 'BUNDLE'}
            onChange={() => onChange('BUNDLE')}
            disabled={disabled}
          />
          <span>Product Bundle</span>
          <span
            className="info-icon"
            title="Multiple complementary products grouped together and sold with optional bundle discount."
          >
            i
          </span>
        </label>
      </div>
    </div>
  );
}