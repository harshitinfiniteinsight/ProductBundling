import { BundleType } from '../types';

interface BundleTypeSwitcherProps {
  value: BundleType;
  onChange: (type: BundleType) => void;
}

export function BundleTypeSwitcher({ value, onChange }: BundleTypeSwitcherProps) {
  return (
    <div className="type-switcher">
      <button
        type="button"
        className={`type-pill ${value === 'BOGO' ? 'active' : ''}`}
        onClick={() => onChange('BOGO')}
      >
        BOGO
      </button>
      <button
        type="button"
        className={`type-pill ${value === 'BUNDLE' ? 'active' : ''}`}
        onClick={() => onChange('BUNDLE')}
      >
        Product Bundle
      </button>
    </div>
  );
}