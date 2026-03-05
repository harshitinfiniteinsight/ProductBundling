import { useState } from 'react';

export function BundleAppearanceSection() {
  const [themeBackgroundColor, setThemeBackgroundColor] = useState('#FFFFFF');
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState('#ff5a2c');
  const [buttonFontColor, setButtonFontColor] = useState('#FFFFFF');
  const [linkHighlightColor, setLinkHighlightColor] = useState('#0066FF');
  const [showProductBoxes, setShowProductBoxes] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);

  return (
    <section className="card form-section">
      <div className="section-header">
        <h3>Bundle Appearance</h3>
        <p className="section-description">
          Customize colors and fonts to match your website's look and feel, so the bundle blends seamlessly into your storefront.
        </p>
      </div>

      <div className="section-body">
        {/* Color Pickers Row 1 */}
        <div className="color-picker-row">
          <div className="color-picker-group">
            <label className="label">
              Theme Background Color
              <span className="info-icon" title="Background color for the bundle theme">ℹ️</span>
            </label>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="color-picker"
                value={themeBackgroundColor}
                onChange={(e) => setThemeBackgroundColor(e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={themeBackgroundColor}
                onChange={(e) => setThemeBackgroundColor(e.target.value)}
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="color-picker-group">
            <label className="label">
              Button Background Color
              <span className="info-icon" title="Background color for buttons">ℹ️</span>
            </label>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="color-picker"
                value={buttonBackgroundColor}
                onChange={(e) => setButtonBackgroundColor(e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={buttonBackgroundColor}
                onChange={(e) => setButtonBackgroundColor(e.target.value)}
                placeholder="#ff5a2c"
              />
            </div>
          </div>
        </div>

        {/* Color Pickers Row 2 */}
        <div className="color-picker-row">
          <div className="color-picker-group">
            <label className="label">
              Button Font Color
              <span className="info-icon" title="Text color for buttons">ℹ️</span>
            </label>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="color-picker"
                value={buttonFontColor}
                onChange={(e) => setButtonFontColor(e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={buttonFontColor}
                onChange={(e) => setButtonFontColor(e.target.value)}
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="color-picker-group">
            <label className="label">
              Link / Highlight Color
              <span className="info-icon" title="Color for links and highlights">ℹ️</span>
            </label>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="color-picker"
                value={linkHighlightColor}
                onChange={(e) => setLinkHighlightColor(e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={linkHighlightColor}
                onChange={(e) => setLinkHighlightColor(e.target.value)}
                placeholder="#0066FF"
              />
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="collapsible-sections">
          {/* Product Boxes */}
          <div className="collapsible-section">
            <button
              type="button"
              className="collapsible-header"
              onClick={() => setShowProductBoxes(!showProductBoxes)}
            >
              <span>Product Boxes</span>
              <span className="chevron">{showProductBoxes ? '▼' : '▶'}</span>
            </button>
            {showProductBoxes && (
              <div className="collapsible-content">
                <div className="form-group">
                  <label className="label">Product Box Style</label>
                  <select className="input">
                    <option>Default</option>
                    <option>Bordered</option>
                    <option>Shadowed</option>
                    <option>Minimal</option>
                  </select>
                </div>
                <div className="color-picker-group">
                  <label className="label">Product Box Background Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      className="color-picker"
                      defaultValue="#F9FAFB"
                    />
                    <input
                      type="text"
                      className="color-text-input"
                      defaultValue="#F9FAFB"
                      placeholder="#F9FAFB"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Font Family */}
          <div className="collapsible-section">
            <button
              type="button"
              className="collapsible-header"
              onClick={() => setShowFontFamily(!showFontFamily)}
            >
              <span>Font Family</span>
              <span className="chevron">{showFontFamily ? '▼' : '▶'}</span>
            </button>
            {showFontFamily && (
              <div className="collapsible-content">
                <div className="form-group">
                  <label className="label">Primary Font</label>
                  <select className="input">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Lato</option>
                    <option>Montserrat</option>
                    <option>Poppins</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Heading Font</label>
                  <select className="input">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Lato</option>
                    <option>Montserrat</option>
                    <option>Poppins</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
