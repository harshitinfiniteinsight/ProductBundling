import { Bundle, BundleItem, Product } from '../types';
import { calculateItemLineTotal, formatCurrency, getProductById } from '../utils/pricing';

interface BundleProductTableProps {
  draft: Bundle;
  products: Product[];
  onChange: (bundle: Bundle) => void;
  disabled?: boolean;
}

export function BundleProductsTable({
  draft,
  products,
  onChange,
  disabled = false,
}: BundleProductTableProps) {
  const items = draft.items;

  const applyItems = (nextItems: BundleItem[]) => onChange({ ...draft, items: nextItems });

  const updateItem = (index: number, key: 'quantity' | 'individualDiscount', value: number) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    applyItems(next);
  };

  const removeItem = (index: number) => {
    applyItems(items.filter((_, currentIndex) => currentIndex !== index));
  };

  const addItem = (productId: number) => {
    if (items.some((item) => item.productId === productId)) {
      return;
    }
    applyItems([...items, { productId, quantity: 1, individualDiscount: 0 }]);
  };

  return (
    <div className="card inner-card">
      <div className="row-between compact">
        <h4>Bundle Products</h4>
        <select
          className="input select-inline"
          disabled={disabled}
          onChange={(event) => {
            if (event.target.value) {
              addItem(Number(event.target.value));
              event.currentTarget.value = '';
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Add product
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <div className="empty-box">No products added yet. Use Add product to start.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Individual Discount</th>
              <th>Final Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = getProductById(products, item.productId);
              const lineTotal = calculateItemLineTotal(item, products);
              return (
                <tr key={`${item.productId}-${index}`}>
                  <td className="table-strong">{product?.name ?? 'Unknown Product'}</td>
                  <td>
                    <input
                      className="table-input"
                      type="number"
                      min={1}
                      disabled={disabled}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, 'quantity', Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="table-input"
                      type="number"
                      min={0}
                      max={100}
                      disabled={disabled}
                      value={item.individualDiscount}
                      onChange={(event) =>
                        updateItem(
                          index,
                          'individualDiscount',
                          Math.min(100, Math.max(0, Number(event.target.value) || 0)),
                        )
                      }
                    />
                  </td>
                  <td>{formatCurrency(lineTotal.final)}</td>
                  <td>
                    <button
                      type="button"
                      className="link-btn danger"
                      disabled={disabled}
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}