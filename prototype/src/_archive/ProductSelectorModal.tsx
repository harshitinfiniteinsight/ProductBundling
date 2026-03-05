import { useMemo, useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/pricing';

interface ProductSelectorModalProps {
  products: Product[];
  selectedProductIds: number[];
  onClose: () => void;
  onAdd: (productIds: number[]) => void;
}

export function ProductSelectorModal({
  products,
  selectedProductIds,
  onClose,
  onAdd,
}: ProductSelectorModalProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = search.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  const toggleProduct = (productId: number) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const availableCount = products.length - selectedProductIds.length;

  return (
    <div className="overlay">
      <div className="modal-card product-modal">
        <div className="modal-header">
          <h3>Select Products</h3>
          <button type="button" className="ghost-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="subtle-text">{availableCount} products available to add</p>

        <input
          className="input"
          placeholder="Search products by name or category"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="selector-list">
          {filteredProducts.map((product) => {
            const isAlreadyAdded = selectedProductIds.includes(product.id);
            const isSelected = selectedIds.includes(product.id);
            return (
              <label
                key={product.id}
                className={`selector-item ${isAlreadyAdded ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isAlreadyAdded}
                  onChange={() => toggleProduct(product.id)}
                />
                <div>
                  <div className="selector-title">{product.name}</div>
                  <div className="subtle-text">
                    {product.category} • {formatCurrency(product.price)}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={() => onAdd(selectedIds)}
            disabled={selectedIds.length === 0}
          >
            Add Selected ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}