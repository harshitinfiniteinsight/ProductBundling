import { useState } from 'react';
import { Bundle, BundleType } from '../types';

interface BundleBasicsStepProps {
  draft: Bundle;
  onChange: (bundle: Bundle) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function BundleBasicsStep({ draft, onChange, onNext, onCancel }: BundleBasicsStepProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  const handleTypeChange = (type: BundleType) => {
    onChange({
      ...draft,
      type,
      // Reset configuration when type changes
      items: [],
      bogoRule: undefined,
    });
  };

  const canProceed = draft.name.trim().length > 0;

  return (
    <section className="card form-section">
      <div className="section-header">
        <h3>Bundle Basics</h3>
      </div>

      <div className="section-body">
        {/* Bundle Name */}
        <div className="form-group">
          <label className="label">Bundle Name</label>
          <input
            type="text"
            className="input"
            placeholder="Enter bundle name"
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
          />
        </div>

        {/* Bundle Type */}
        <div className="form-group">
          <label className="label">Bundle Type</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="bundleType"
                checked={draft.type === 'BOGO'}
                onChange={() => handleTypeChange('BOGO')}
              />
              <span className="radio-label">
                BOGO
                <span className="info-icon" title="Customer buys a product in a specified quantity and receives another product free or discounted.">
                  ℹ️
                </span>
              </span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="bundleType"
                checked={draft.type === 'BUNDLE'}
                onChange={() => handleTypeChange('BUNDLE')}
              />
              <span className="radio-label">
                Product Bundle
                <span className="info-icon" title="Multiple complementary products grouped together and sold together with optional bundle discount.">
                  ℹ️
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Bundle Description */}
        <div className="form-group">
          <label className="label">Bundle Description</label>
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Description
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced Description
            </button>
          </div>

          {activeTab === 'basic' ? (
            <textarea
              className="textarea"
              rows={4}
              placeholder="Enter a simple description of this bundle"
              value={draft.descriptionBasic}
              onChange={(e) => onChange({ ...draft, descriptionBasic: e.target.value })}
            />
          ) : (
            <textarea
              className="textarea"
              rows={6}
              placeholder="Enter rich text description (HTML supported)"
              value={draft.descriptionAdvanced}
              onChange={(e) => onChange({ ...draft, descriptionAdvanced: e.target.value })}
            />
          )}
        </div>

        {/* Active Status */}
        <div className="form-group">
          <label className="toggle-row">
            Active
            <label className="switch">
              <input
                type="checkbox"
                checked={draft.status}
                onChange={(e) => onChange({ ...draft, status: e.target.checked })}
              />
              <span className="slider" />
            </label>
          </label>
        </div>

        {/* Actions */}
        <div className="step-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={onNext}
            disabled={!canProceed}
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
