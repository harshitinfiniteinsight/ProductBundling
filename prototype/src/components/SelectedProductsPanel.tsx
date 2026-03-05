import { useState } from 'react';
import { Product, BundleItem } from '../types';

interface SelectedProductsPanelProps {
  products: Product[];
  selectedItems: BundleItem[];
  onProductRemove: (productId: number) => void;
  onUpdateItem: (productId: number, updates: Partial<BundleItem>) => void;
}

export function SelectedProductsPanel({
  products,
  selectedItems,
  onProductRemove,
  onUpdateItem,
}: SelectedProductsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter selected products based on search
  const filteredItems = selectedItems.filter((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return false;
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="selected-panel">
      {/* Header with Total Selected */}
      <div className="panel-header">
        <h4>Selected Products</h4>
        <span className="product-count">Total Selected: {selectedItems.length} / 5</span>
      </div>

      {/* Search Row */}
      {selectedItems.length > 0 && (
        <div className="search-row">
          <input
            type="text"
            className="input-search"
            placeholder="Search selected products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Selected Products List */}
      {selectedItems.length === 0 ? (
        <div className="empty-state">
          <p>No products selected yet. Select products from the left panel to add them to this bundle.</p>
        </div>
      ) : (
        <div className="selected-products-list">
          {filteredItems.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;

            const discountAmount =
              (product.price * item.individualDiscount) / 100;
            const discountedPrice = product.price - discountAmount;
            const finalPrice = discountedPrice * item.quantity;

            return (
              <div key={item.productId} className="selected-product-card">
                <div className="card-header">
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => onProductRemove(item.productId)}
                    title="Remove product from bundle"
                  >
                    ✕
                  </button>
                </div>

                <div className="card-body">
                  <div className="product-placeholder">
                    <span>📦</span>
                  </div>
                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-base-price">
                      ${product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div className="card-footer">
                  {/* Quantity */}
                  <div className="form-row">
                    <label className="small-label">Qty</label>
                    <input
                      type="number"
                      className="input-small"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(item.productId, {
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  {/* Individual Discount */}
                  <div className="form-row">
                    <label className="small-label">Discount %</label>
                    <input
                      type="number"
                      className="input-small"
                      min="0"
                      max="100"
                      value={item.individualDiscount}
                      onChange={(e) =>
                        onUpdateItem(item.productId, {
                          individualDiscount: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  {/* Final Price */}
                  <div className="form-row">
                    <label className="small-label">Final</label>
                    <p className="final-price">${finalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
