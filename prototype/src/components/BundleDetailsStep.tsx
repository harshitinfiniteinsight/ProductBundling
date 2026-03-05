import { useState } from 'react';
import { Bundle, BundleType } from '../types';
import { BundleAppearanceSection } from './BundleAppearanceSection';
import { BundleTypeInfo } from './BundleTypeInfo';

interface BundleDetailsStepProps {
  draft: Bundle;
  onChange: (bundle: Bundle) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function BundleDetailsStep({ draft, onChange, onNext, onCancel }: BundleDetailsStepProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [displayHeader, setDisplayHeader] = useState(true);
  const [displayFooter, setDisplayFooter] = useState(true);
  const [buttonLabel, setButtonLabel] = useState(draft.buttonLabel || 'Pay Now');
  const [allowRefund, setAllowRefund] = useState(false);

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
    <div className="step-container">
      {/* Bundle Details Card */}
      <section className="card form-section">
        <div className="section-header">
          <h3>Bundle Details</h3>
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
            <p className="field-helper-text">
              Give your bundle a clear name that helps customers understand the offer. This name may also be displayed on the storefront.
            </p>
            <div className="field-helper-examples">
              <strong>Examples:</strong>
              <ul>
                {draft.type === 'BOGO' ? (
                  <>
                    <li>Buy 2 Coke Get 1 Free</li>
                    <li>Buy 1 Shirt Get 50% Off</li>
                    <li>2 for 1 Pizza Night</li>
                  </>
                ) : (
                  <>
                    <li>Burger Combo Deal</li>
                    <li>Office Essentials Bundle</li>
                    <li>Camera Starter Pack</li>
                  </>
                )}
              </ul>
            </div>
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

            <BundleTypeInfo key={draft.type} bundleType={draft.type} />
          </div>

          {/* Bundle Description */}
          <div className="form-group">
            <div className="label-with-action">
              <label className="label">Bundle Description</label>
              <button type="button" className="ai-generate-btn">
                ✨ Generate with AI
              </button>
            </div>
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

          {/* Display Settings */}
          <div className="form-group">
            <label className="label">Display Settings</label>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={displayHeader}
                  onChange={(e) => {
                    setDisplayHeader(e.target.checked);
                    onChange({ ...draft, displayHeader: e.target.checked });
                  }}
                />
                <span className="checkbox-label">Display Header</span>
              </label>

              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={displayFooter}
                  onChange={(e) => {
                    setDisplayFooter(e.target.checked);
                    onChange({ ...draft, displayFooter: e.target.checked });
                  }}
                />
                <span className="checkbox-label">Display Footer</span>
              </label>
            </div>
          </div>

          {/* Button Name */}
          <div className="form-group">
            <label className="label">Button Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter button text"
              maxLength={30}
              value={buttonLabel}
              onChange={(e) => {
                const value = e.target.value;
                setButtonLabel(value);
                // Update draft with button label
                onChange({
                  ...draft,
                  buttonLabel: value || 'Pay Now',
                });
              }}
            />
            <p className="field-helper-text">
              This text will appear on the checkout button that customers click to start the payment process.
            </p>
          </div>

          {/* Allow Refund */}
          <div className="form-group">
            <label className="toggle-row">
              Allow Refund
              <label className="switch">
                <input
                  type="checkbox"
                  checked={allowRefund}
                  onChange={(e) => setAllowRefund(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </label>
            <p className="helper-text">
              Restricting refunds on bundles helps avoid partial returns, since items purchased as part of a bundle are treated as one package.
            </p>
          </div>
        </div>
      </section>

      {/* Bundle Appearance Card */}
      <BundleAppearanceSection />

      {/* Actions */}
      <div className="step-actions-bottom">
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
  );
}
