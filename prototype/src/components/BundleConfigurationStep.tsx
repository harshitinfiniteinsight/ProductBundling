import { useState } from 'react';
import { Bundle, Product, BogoDiscountType, BundleItem } from '../types';
import { ProductSelectorModal } from './ProductSelectorModal';
import { BogoPreviewCard } from './BogoPreviewCard';
import { ProductInventoryPanel } from './ProductInventoryPanel';
import { SelectedProductsPanel } from './SelectedProductsPanel';

interface BundleConfigurationStepProps {
  draft: Bundle;
  products: Product[];
  onChange: (bundle: Bundle) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BundleConfigurationStep({
  draft,
  products,
  onChange,
  onNext,
  onBack,
}: BundleConfigurationStepProps) {
  const [showProductModal, setShowProductModal] = useState(false);

  if (draft.type === 'BOGO') {
    return <BOGOConfiguration draft={draft} products={products} onChange={onChange} onNext={onNext} onBack={onBack} />;
  } else {
    return (
      <ProductBundleConfiguration
        draft={draft}
        products={products}
        onChange={onChange}
        onNext={onNext}
        onBack={onBack}
        showProductModal={showProductModal}
        setShowProductModal={setShowProductModal}
      />
    );
  }
}

// BOGO Configuration Component
function BOGOConfiguration({
  draft,
  products,
  onChange,
  onNext,
  onBack,
}: {
  draft: Bundle;
  products: Product[];
  onChange: (bundle: Bundle) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const bogoRule = draft.bogoRule || {
    buyProductId: 0,
    buyQuantity: 1,
    getProductId: 0,
    getQuantity: 1,
    discountType: 'FREE' as BogoDiscountType,
    discountValue: 100,
  };

  const updateBogoRule = (updates: Partial<typeof bogoRule>) => {
    onChange({
      ...draft,
      bogoRule: { ...bogoRule, ...updates },
    });
  };

  const buyProduct = products.find((p) => p.id === bogoRule.buyProductId);
  const getProduct = products.find((p) => p.id === bogoRule.getProductId);

  const canProceed = bogoRule.buyProductId > 0 && bogoRule.getProductId > 0 && bogoRule.buyQuantity > 0 && bogoRule.getQuantity > 0;

  return (
    <section className="card form-section">
      <div className="section-header">
        <h3>BOGO Rule</h3>
        <p className="section-helper-text">
          Define the Buy X Get Y offer by selecting the product customers must purchase and the product they will receive as a reward. You can choose whether the reward is free, discounted, or offered at a fixed price.
        </p>
        <p className="section-helper-example">
          Example: Buy 2 Coke → Get 1 Coke Free
        </p>
      </div>

      <div className="section-body">
        {/* Buy Product */}
        <div className="form-group">
          <label className="label">Buy Product</label>
          <select
            className="input"
            value={bogoRule.buyProductId}
            onChange={(e) => updateBogoRule({ buyProductId: Number(e.target.value) })}
          >
            <option value={0}>Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Buy Quantity */}
        <div className="form-group">
          <label className="label">Buy Quantity</label>
          <input
            type="number"
            className="input"
            min="1"
            value={bogoRule.buyQuantity}
            onChange={(e) => updateBogoRule({ buyQuantity: Number(e.target.value) })}
          />
        </div>

        {/* Get Product */}
        <div className="form-group">
          <label className="label">Get Product</label>
          <select
            className="input"
            value={bogoRule.getProductId}
            onChange={(e) => updateBogoRule({ getProductId: Number(e.target.value) })}
          >
            <option value={0}>Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Get Quantity */}
        <div className="form-group">
          <label className="label">Get Quantity</label>
          <input
            type="number"
            className="input"
            min="1"
            value={bogoRule.getQuantity}
            onChange={(e) => updateBogoRule({ getQuantity: Number(e.target.value) })}
          />
        </div>

        {/* Discount Type */}
        <div className="form-group">
          <label className="label">Discount Type</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="bogoDiscountType"
                checked={bogoRule.discountType === 'FREE'}
                onChange={() => updateBogoRule({ discountType: 'FREE', discountValue: 100 })}
              />
              <span className="radio-label">Free</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="bogoDiscountType"
                checked={bogoRule.discountType === 'PERCENTAGE'}
                onChange={() => updateBogoRule({ discountType: 'PERCENTAGE', discountValue: 50 })}
              />
              <span className="radio-label">Percentage Discount</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="bogoDiscountType"
                checked={bogoRule.discountType === 'FIXED'}
                onChange={() => updateBogoRule({ discountType: 'FIXED', discountValue: 1 })}
              />
              <span className="radio-label">Fixed Discount</span>
            </label>
          </div>
        </div>

        {/* Discount Value (if not FREE) */}
        {bogoRule.discountType !== 'FREE' && (
          <div className="form-group">
            <label className="label">
              {bogoRule.discountType === 'PERCENTAGE' ? 'Discount Percentage' : 'Discount Amount ($)'}
            </label>
            <input
              type="number"
              className="input"
              min="0"
              max={bogoRule.discountType === 'PERCENTAGE' ? '100' : undefined}
              value={bogoRule.discountValue}
              onChange={(e) => updateBogoRule({ discountValue: Number(e.target.value) })}
            />
          </div>
        )}

        {/* Optional Fields */}
        <div className="form-group">
          <label className="label">Limit per Order (Optional)</label>
          <input
            type="number"
            className="input"
            min="1"
            placeholder="No limit"
            value={bogoRule.limitPerOrder || ''}
            onChange={(e) => updateBogoRule({ limitPerOrder: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        {/* Live Preview */}
        <BogoPreviewCard
          buyProduct={buyProduct}
          buyQuantity={bogoRule.buyQuantity}
          getProduct={getProduct}
          getQuantity={bogoRule.getQuantity}
          discountType={bogoRule.discountType}
          discountValue={bogoRule.discountValue}
        />

        {/* Actions */}
        <div className="step-actions">
          <button type="button" className="secondary-btn" onClick={onBack}>
            ← Back
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

// Product Bundle Configuration Component
function ProductBundleConfiguration({
  draft,
  products,
  onChange,
  onNext,
  onBack,
  showProductModal,
  setShowProductModal,
}: {
  draft: Bundle;
  products: Product[];
  onChange: (bundle: Bundle) => void;
  onNext: () => void;
  onBack: () => void;
  showProductModal: boolean;
  setShowProductModal: (show: boolean) => void;
}) {
  const handleProductSelect = (productId: number) => {
    const existingItem = draft.items.find((item) => item.productId === productId);
    if (!existingItem) {
      // Check if limit reached
      if (draft.items.length >= 5) {
        return; // Prevent adding more than 5 products
      }
      // Add new item
      onChange({
        ...draft,
        items: [...draft.items, { productId, quantity: 1, individualDiscount: 0 }],
      });
    }
  };

  const handleProductDeselect = (productId: number) => {
    onChange({
      ...draft,
      items: draft.items.filter((item) => item.productId !== productId),
    });
  };

  const handleUpdateItem = (productId: number, updates: Partial<BundleItem>) => {
    onChange({
      ...draft,
      items: draft.items.map((item) =>
        item.productId === productId ? { ...item, ...updates } : item
      ),
    });
  };

  const canProceed = draft.items.length > 0;
  const selectedProductIds = draft.items.map((item) => item.productId);
  const maxProductsReached = draft.items.length >= 5;

  return (
    <>
      <section className="card form-section">
        <div className="section-header">
          <h3>Bundle Products</h3>
          <p className="section-helper-text">
            Add the products that will be included in this bundle. Customers will be able to purchase these items together as a single bundle. You can optionally apply discounts to individual products or the entire bundle.
          </p>
          <p className="section-helper-text">
            You can add up to 5 products to a bundle and define their quantities.
          </p>
        </div>

        <div className="section-body">
          {/* Two-Panel Layout */}
          <div className="two-panel-layout">
            {/* Left Panel - Product Inventory */}
            <ProductInventoryPanel
              products={products}
              selectedProductIds={selectedProductIds}
              onProductSelect={handleProductSelect}
              onProductDeselect={handleProductDeselect}
              maxProductsReached={maxProductsReached}
            />

            {/* Right Panel - Selected Products */}
            <SelectedProductsPanel
              products={products}
              selectedItems={draft.items}
              onProductRemove={handleProductDeselect}
              onUpdateItem={handleUpdateItem}
            />
          </div>

          {/* Actions */}
          <div className="step-actions">
            <button type="button" className="secondary-btn" onClick={onBack}>
              ← Back
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

      {showProductModal && (
        <ProductSelectorModal
          products={products}
          selectedProductIds={selectedProductIds}
          onSelect={() => {}}
          onClose={() => setShowProductModal(false)}
        />
      )}
    </>
  );
}
