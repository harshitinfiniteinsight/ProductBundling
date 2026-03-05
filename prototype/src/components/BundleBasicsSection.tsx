import { Bundle } from '../types';
import { BundleDescriptionTabs } from './BundleDescriptionTabs';
import { BundleTypeSelector } from './BundleTypeSelector';

interface BundleBasicsSectionProps {
  draft: Bundle;
  onChange: (bundle: Bundle) => void;
  disabled?: boolean;
}

export function BundleBasicsSection({ draft, onChange, disabled = false }: BundleBasicsSectionProps) {
  return (
    <section className="card form-section">
      <div className="section-header">
        <h3>Section 1 — Bundle Basics</h3>
      </div>

      <div className="section-body">
        <label className="field">
          Bundle Name
          <input
            className="input"
            value={draft.name}
            disabled={disabled}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="Enter bundle name"
          />
        </label>

        <BundleTypeSelector
          value={draft.type}
          disabled={disabled}
          onChange={(nextType) =>
            onChange({
              ...draft,
              type: nextType,
              discountType: nextType === 'BOGO' ? 'FREE' : 'NONE',
              discountValue: nextType === 'BOGO' ? 100 : 0,
              items: nextType === 'BOGO' ? [] : draft.items,
              bogoRule:
                nextType === 'BOGO'
                  ? draft.bogoRule ?? {
                      buyProductId: 1,
                      buyQuantity: 1,
                      getProductId: 2,
                      getQuantity: 1,
                      discountType: 'FREE',
                      discountValue: 100,
                    }
                  : undefined,
            })
          }
        />

        <BundleDescriptionTabs
          descriptionBasic={draft.descriptionBasic}
          descriptionAdvanced={draft.descriptionAdvanced}
          disabled={disabled}
          onChangeBasic={(value) => onChange({ ...draft, descriptionBasic: value })}
          onChangeAdvanced={(value) => onChange({ ...draft, descriptionAdvanced: value })}
        />

        <label className="toggle-row">
          Active
          <label className="switch">
            <input
              type="checkbox"
              checked={draft.status}
              disabled={disabled}
              onChange={(event) => onChange({ ...draft, status: event.target.checked })}
            />
            <span className="slider" />
          </label>
        </label>
      </div>
    </section>
  );
}