import { Bundle, BogoDiscountType, Product } from '../types';
import { getProductById } from '../utils/pricing';

interface BOGORuleCardProps {
  draft: Bundle;
  products: Product[];
  onChange: (bundle: Bundle) => void;
  disabled?: boolean;
}

export function BOGORuleCard({ draft, products, onChange, disabled = false }: BOGORuleCardProps) {
  if (!draft.bogoRule) {
    return null;
  }

  const rule = draft.bogoRule;

  const updateRule = (patch: Partial<typeof rule>) => {
    onChange({
      ...draft,
      bogoRule: {
        ...rule,
        ...patch,
      },
      discountType: patch.discountType ?? rule.discountType,
      discountValue: patch.discountValue ?? rule.discountValue,
    });
  };

  return (
    <div className="card inner-card">
      <div className="section-header compact">
        <h4>BOGO Rule</h4>
      </div>
      <div className="section-grid">
        <label className="field">
          Buy Product
          <input
            className="input"
            list="products-list"
            disabled={disabled}
            value={getProductById(products, rule.buyProductId)?.name ?? ''}
            onChange={(event) => {
              const found = products.find((product) => product.name === event.target.value);
              if (found) {
                updateRule({ buyProductId: found.id });
              }
            }}
          />
        </label>

        <label className="field">
          Buy Quantity
          <input
            className="input"
            type="number"
            min={1}
            disabled={disabled}
            value={rule.buyQuantity}
            onChange={(event) => updateRule({ buyQuantity: Math.max(1, Number(event.target.value) || 1) })}
          />
        </label>

        <label className="field">
          Get Product
          <input
            className="input"
            list="products-list"
            disabled={disabled}
            value={getProductById(products, rule.getProductId)?.name ?? ''}
            onChange={(event) => {
              const found = products.find((product) => product.name === event.target.value);
              if (found) {
                updateRule({ getProductId: found.id });
              }
            }}
          />
        </label>

        <label className="field">
          Get Quantity
          <input
            className="input"
            type="number"
            min={1}
            disabled={disabled}
            value={rule.getQuantity}
            onChange={(event) => updateRule({ getQuantity: Math.max(1, Number(event.target.value) || 1) })}
          />
        </label>

        <label className="field">
          Discount Type
          <select
            className="input"
            value={rule.discountType}
            disabled={disabled}
            onChange={(event) =>
              updateRule({
                discountType: event.target.value as BogoDiscountType,
                discountValue: event.target.value === 'FREE' ? 100 : rule.discountValue,
              })
            }
          >
            <option value="FREE">Free</option>
            <option value="PERCENTAGE">Percentage Discount</option>
            <option value="FIXED">Fixed Discount</option>
          </select>
        </label>

        {rule.discountType !== 'FREE' && (
          <label className="field">
            Discount Value
            <input
              className="input"
              type="number"
              min={0}
              disabled={disabled}
              value={rule.discountValue}
              onChange={(event) => updateRule({ discountValue: Math.max(0, Number(event.target.value) || 0) })}
            />
          </label>
        )}

        <label className="field">
          Limit per order (optional)
          <input
            className="input"
            type="number"
            min={1}
            disabled={disabled}
            value={rule.limitPerOrder ?? ''}
            onChange={(event) =>
              updateRule({ limitPerOrder: event.target.value ? Number(event.target.value) : undefined })
            }
          />
        </label>

        <label className="field">
          Schedule Start
          <input
            className="input"
            type="date"
            disabled={disabled}
            value={rule.scheduleStart ?? ''}
            onChange={(event) => updateRule({ scheduleStart: event.target.value || undefined })}
          />
        </label>

        <label className="field">
          Schedule End
          <input
            className="input"
            type="date"
            disabled={disabled}
            value={rule.scheduleEnd ?? ''}
            onChange={(event) => updateRule({ scheduleEnd: event.target.value || undefined })}
          />
        </label>
      </div>

      <datalist id="products-list">
        {products.map((product) => (
          <option key={product.id} value={product.name} />
        ))}
      </datalist>

      <div className="rule-banner">
        Buy {rule.buyQuantity} {getProductById(products, rule.buyProductId)?.name ?? 'Product'} → Get{' '}
        {rule.getQuantity} {getProductById(products, rule.getProductId)?.name ?? 'Product'}{' '}
        {rule.discountType === 'FREE'
          ? 'Free'
          : rule.discountType === 'PERCENTAGE'
            ? `at ${rule.discountValue}% off`
            : `at $${rule.discountValue} off`}
      </div>
    </div>
  );
}