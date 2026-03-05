import { useState } from 'react';

interface BundleDescriptionTabsProps {
  descriptionBasic: string;
  descriptionAdvanced: string;
  onChangeBasic: (value: string) => void;
  onChangeAdvanced: (value: string) => void;
  disabled?: boolean;
}

export function BundleDescriptionTabs({
  descriptionBasic,
  descriptionAdvanced,
  onChangeBasic,
  onChangeAdvanced,
  disabled = false,
}: BundleDescriptionTabsProps) {
  const [tab, setTab] = useState<'basic' | 'advanced'>('basic');

  return (
    <div>
      <p className="section-label">Bundle Description</p>
      <div className="tab-row">
        <button
          type="button"
          className={`tab-btn ${tab === 'basic' ? 'active' : ''}`}
          onClick={() => setTab('basic')}
        >
          Basic Description
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === 'advanced' ? 'active' : ''}`}
          onClick={() => setTab('advanced')}
        >
          Advanced Description
        </button>
      </div>

      {tab === 'basic' ? (
        <textarea
          className="input"
          rows={4}
          value={descriptionBasic}
          disabled={disabled}
          onChange={(event) => onChangeBasic(event.target.value)}
          placeholder="Add a short bundle description"
        />
      ) : (
        <div className="rich-editor-wrap">
          <div className="rich-toolbar">
            <button type="button" className="toolbar-btn" disabled>
              B
            </button>
            <button type="button" className="toolbar-btn" disabled>
              I
            </button>
            <button type="button" className="toolbar-btn" disabled>
              • List
            </button>
            <button type="button" className="toolbar-btn" disabled>
              Link
            </button>
          </div>
          <textarea
            className="input rich-editor"
            rows={7}
            value={descriptionAdvanced}
            disabled={disabled}
            onChange={(event) => onChangeAdvanced(event.target.value)}
            placeholder="Rich text HTML/markup demo field"
          />
        </div>
      )}
    </div>
  );
}