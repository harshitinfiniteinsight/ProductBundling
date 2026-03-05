import { useMemo, useState } from 'react';
import {
  BogoDiscountType,
  Bundle,
  BundleDiscountType,
  BundleItem,
  BundleType,
  Product,
} from '../types';
import { calculateBundleSummary, getProductById } from '../utils/pricing';
import { BundlePricingPreview } from './BundlePricingPreview';
import { BundleProductTable } from './BundleProductTable';
import { BundleTypeSwitcher } from './BundleTypeSwitcher';
import { ProductSelectorModal } from './ProductSelectorModal';

interface BundleFormWizardProps {
  products: Product[];
  initialBundle?: Bundle;
  onCancel: () => void;
  onSave: (bundle: Bundle, activate: boolean) => void;
}

const stepTitles = ['Bundle Basics', 'Bundle Configuration', 'Pricing Preview', 'Review & Save'];

const createDefaultDraft = (): Bundle => ({
  id: 0,
  name: '',
  type: 'BOGO',
  description: '',
  products: [],
  discountType: 'FREE',
  discountValue: 100,
  status: true,
  createdAt: new Date().toISOString(),
  bogoRule: {
    buyProductId: 1,
    buyQty: 1,
    getProductId: 2,
    getQty: 1,
    discountType: 'FREE',
    discountValue: 100,
  },
  bundleDiscount: {
    type: 'NONE',
    value: 0,
  },
});

export function BundleFormWizard({ products, initialBundle, onCancel, onSave }: BundleFormWizardProps) {
  const [step, setStep] = useState(1);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [draft, setDraft] = useState<Bundle>(initialBundle ? { ...initialBundle } : createDefaultDraft());

  const isEditing = Boolean(initialBundle);

  const summary = useMemo(() => calculateBundleSummary(draft, products), [draft, products]);

  const goNext = () => setStep((current) => Math.min(4, current + 1));
  const goBack = () => setStep((current) => Math.max(1, current - 1));

  const switchType = (nextType: BundleType) => {
    setDraft((prev) => ({
      ...prev,
      type: nextType,
      discountType: nextType === 'BOGO' ? 'FREE' : 'NONE',
      discountValue: nextType === 'BOGO' ? 100 : 0,
      products: nextType === 'BOGO' ? [] : prev.products,
      bogoRule:
        nextType === 'BOGO'
          ? prev.bogoRule ?? {
              buyProductId: 1,
              buyQty: 1,
              getProductId: 2,
              getQty: 1,
              discountType: 'FREE',
              discountValue: 100,
            }
          : undefined,
      bundleDiscount:
        nextType === 'BUNDLE'
          ? prev.bundleDiscount ?? {
              type: 'NONE',
              value: 0,
            }
          : undefined,
    }));
  };

  const addProducts = (productIds: number[]) => {
    setDraft((prev) => {
      const existing = new Set(prev.products.map((item) => item.productId));
      const nextItems: BundleItem[] = [...prev.products];
      productIds.forEach((productId) => {
        if (!existing.has(productId)) {
          nextItems.push({ productId, quantity: 1, individualDiscount: 0 });
        }
      });
      return { ...prev, products: nextItems };
    });
    setIsSelectorOpen(false);
  };

  const saveDraft = (activate: boolean) => {
    const nextDraft: Bundle = {
      ...draft,
      status: activate ? true : draft.status,
      createdAt: draft.createdAt || new Date().toISOString(),
      discountType:
        draft.type === 'BOGO'
          ? draft.bogoRule?.discountType ?? 'FREE'
          : draft.bundleDiscount?.type ?? 'NONE',
      discountValue:
        draft.type === 'BOGO'
          ? draft.bogoRule?.discountValue ?? 100
          : draft.bundleDiscount?.value ?? 0,
    };

    onSave(nextDraft, activate);
  };

  return (
    <div className="panel wizard-panel">
      <div className="row-between">
        <div>
          <p className="subtle-text">{isEditing ? 'Edit' : 'Create'} Product Bundle</p>
          <h2>{stepTitles[step - 1]}</h2>
        </div>
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <div className="stepper">
        {stepTitles.map((title, index) => {
          const currentStep = index + 1;
          return (
            <div key={title} className={`step ${currentStep <= step ? 'active' : ''}`}>
              <span className="step-index">{currentStep}</span>
              <span>{title}</span>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="form-grid">
          <label>
            Bundle Name
            <input
              className="input"
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Enter bundle name"
            />
          </label>

          <div>
            <span className="label-title">Bundle Type</span>
            <BundleTypeSwitcher value={draft.type} onChange={switchType} />
          </div>

          <label className="full-width">
            Description
            <textarea
              className="input"
              rows={4}
              value={draft.description}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Describe this bundle"
            />
          </label>

          <label className="toggle-row">
            Active
            <label className="switch">
              <input
                type="checkbox"
                checked={draft.status}
                onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.checked }))}
              />
              <span className="slider" />
            </label>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="config-block">
          {draft.type === 'BOGO' && draft.bogoRule && (
            <>
              <div className="form-grid">
                <label>
                  Buy Product
                  <select
                    className="input"
                    value={draft.bogoRule.buyProductId}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        bogoRule: {
                          ...prev.bogoRule!,
                          buyProductId: Number(event.target.value),
                        },
                      }))
                    }
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Buy Quantity (X)
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={draft.bogoRule.buyQty}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        bogoRule: {
                          ...prev.bogoRule!,
                          buyQty: Math.max(1, Number(event.target.value) || 1),
                        },
                      }))
                    }
                  />
                </label>

                <label>
                  Get Product
                  <select
                    className="input"
                    value={draft.bogoRule.getProductId}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        bogoRule: {
                          ...prev.bogoRule!,
                          getProductId: Number(event.target.value),
                        },
                      }))
                    }
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Get Quantity (Y)
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={draft.bogoRule.getQty}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        bogoRule: {
                          ...prev.bogoRule!,
                          getQty: Math.max(1, Number(event.target.value) || 1),
                        },
                      }))
                    }
                  />
                </label>

                <label>
                  Discount Type
                  <select
                    className="input"
                    value={draft.bogoRule.discountType}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        bogoRule: {
                          ...prev.bogoRule!,
                          discountType: event.target.value as BogoDiscountType,
                          discountValue: event.target.value === 'FREE' ? 100 : prev.bogoRule?.discountValue ?? 0,
                        },
                      }))
                    }
                  >
                    <option value="FREE">Free</option>
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed Discount</option>
                  </select>
                </label>

                {draft.bogoRule.discountType !== 'FREE' && (
                  <label>
                    Discount Value
                    <input
                      className="input"
                      type="number"
                      min={0}
                      value={draft.bogoRule.discountValue}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          bogoRule: {
                            ...prev.bogoRule!,
                            discountValue: Math.max(0, Number(event.target.value) || 0),
                          },
                        }))
                      }
                    />
                  </label>
                )}

                <label>
                  Limit per order (optional)
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={draft.bogoRule.limitPerOrder ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        bogoRule: {
                          ...prev.bogoRule!,
                          limitPerOrder: event.target.value ? Number(event.target.value) : undefined,
                        },
                      }))
                    }
                  />
                </label>
              </div>

              <div className="rule-banner">
                Buy {draft.bogoRule.buyQty}{' '}
                {getProductById(products, draft.bogoRule.buyProductId)?.name ?? 'Product'} → Get{' '}
                {draft.bogoRule.getQty}{' '}
                {getProductById(products, draft.bogoRule.getProductId)?.name ?? 'Product'}{' '}
                {draft.bogoRule.discountType === 'FREE'
                  ? 'Free'
                  : draft.bogoRule.discountType === 'PERCENTAGE'
                    ? `at ${draft.bogoRule.discountValue}% off`
                    : `at ${draft.bogoRule.discountValue} fixed discount`}
              </div>
            </>
          )}

          {draft.type === 'BUNDLE' && (
            <>
              <div className="row-between compact">
                <h3>Bundle Products</h3>
                <button type="button" className="primary-btn" onClick={() => setIsSelectorOpen(true)}>
                  + Add Products
                </button>
              </div>

              <BundleProductTable
                items={draft.products}
                products={products}
                onUpdate={(nextItems) => setDraft((prev) => ({ ...prev, products: nextItems }))}
              />

              <div className="form-grid">
                <label>
                  Bundle Discount Option
                  <select
                    className="input"
                    value={draft.bundleDiscount?.type ?? 'NONE'}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        bundleDiscount: {
                          type: event.target.value as BundleDiscountType,
                          value: prev.bundleDiscount?.value ?? 0,
                        },
                      }))
                    }
                  >
                    <option value="NONE">No Discount</option>
                    <option value="PERCENTAGE">% Discount</option>
                    <option value="FIXED_BUNDLE_PRICE">Fixed Bundle Price</option>
                  </select>
                </label>

                {draft.bundleDiscount?.type !== 'NONE' && (
                  <label>
                    {draft.bundleDiscount?.type === 'PERCENTAGE'
                      ? 'Discount Percentage'
                      : 'Fixed Bundle Price'}
                    <input
                      className="input"
                      type="number"
                      min={0}
                      value={draft.bundleDiscount?.value ?? 0}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          bundleDiscount: {
                            type: prev.bundleDiscount?.type ?? 'NONE',
                            value: Math.max(0, Number(event.target.value) || 0),
                          },
                        }))
                      }
                    />
                  </label>
                )}
              </div>

              <div className="rule-banner">
                Live final bundle price: <strong>${summary.finalPrice.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && <BundlePricingPreview bundleDraft={draft} products={products} />}

      {step === 4 && (
        <div className="review-panel">
          <h3>Review Bundle Details</h3>
          <ul className="review-list">
            <li>
              <strong>Bundle Name:</strong> {draft.name || 'Untitled'}
            </li>
            <li>
              <strong>Bundle Type:</strong> {draft.type === 'BOGO' ? 'BOGO' : 'Product Bundle'}
            </li>
            <li>
              <strong>Included Products:</strong>{' '}
              {draft.type === 'BOGO'
                ? `${getProductById(products, draft.bogoRule?.buyProductId ?? 0)?.name ?? 'N/A'} / ${getProductById(products, draft.bogoRule?.getProductId ?? 0)?.name ?? 'N/A'}`
                : `${draft.products.length} products`}
            </li>
            <li>
              <strong>Discount:</strong>{' '}
              {draft.type === 'BOGO'
                ? `${draft.bogoRule?.discountType} ${draft.bogoRule?.discountType === 'FREE' ? '' : draft.bogoRule?.discountValue}`
                : `${draft.bundleDiscount?.type ?? 'NONE'} ${draft.bundleDiscount?.value ?? ''}`}
            </li>
            <li>
              <strong>Status:</strong> {draft.status ? 'Active' : 'Inactive'}
            </li>
          </ul>
        </div>
      )}

      <div className="modal-actions">
        <button type="button" className="secondary-btn" onClick={goBack} disabled={step === 1}>
          Back
        </button>

        {step < 4 && (
          <button
            type="button"
            className="primary-btn"
            onClick={goNext}
            disabled={step === 1 && draft.name.trim().length === 0}
          >
            Next
          </button>
        )}

        {step === 4 && (
          <>
            <button type="button" className="secondary-btn" onClick={() => saveDraft(false)}>
              Save Bundle
            </button>
            <button type="button" className="primary-btn" onClick={() => saveDraft(true)}>
              Save & Activate
            </button>
          </>
        )}
      </div>

      {isSelectorOpen && (
        <ProductSelectorModal
          products={products}
          selectedProductIds={draft.products.map((item) => item.productId)}
          onClose={() => setIsSelectorOpen(false)}
          onAdd={addProducts}
        />
      )}
    </div>
  );
}