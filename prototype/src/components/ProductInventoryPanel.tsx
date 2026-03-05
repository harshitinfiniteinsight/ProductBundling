import { useState } from 'react';
import { Product } from '../types';

interface ProductInventoryPanelProps {
  products: Product[];
  selectedProductIds: number[];
  onProductSelect: (productId: number) => void;
  onProductDeselect: (productId: number) => void;
  maxProductsReached?: boolean;
}

export function ProductInventoryPanel({
  products,
  selectedProductIds,
  onProductSelect,
  onProductDeselect,
  maxProductsReached = false,
}: ProductInventoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleProductCheck = (productId: number) => {
    const isSelected = selectedProductIds.includes(productId);
    
    if (isSelected) {
      onProductDeselect(productId);
    } else {
      // Check if limit reached and show message
      if (maxProductsReached) {
        // Limit reached, do nothing
        return;
      }
      onProductSelect(productId);
    }
  };

  return (
    <div className="inventory-panel">
      {/* Header with Total Products */}
      <div className="panel-header">
        <h4>Select Products for this Bundle</h4>
        <span className="product-count">Total Products: {products.length}</span>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        <select
          className="input-small"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Search Row */}
      <div className="search-row">
        <input
          type="text"
          className="input-search"
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Max Products Warning */}
      {maxProductsReached && (
        <div className="max-products-warning">
          <span>⚠️</span>
          <div>
            <strong>Maximum bundle size reached (5 products).</strong>
            <p>To add another product, remove one from the selected list.</p>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => {
          const isSelected = selectedProductIds.includes(product.id);
          const isDisabled = maxProductsReached && !isSelected;
          return (
            <div
              key={product.id}
              className={`product-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            >
              <div className="product-card-header">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleProductCheck(product.id)}
                  className="product-checkbox"
                  disabled={isDisabled}
                />
              </div>
              <div className="product-card-body">
                <div className="product-placeholder">
                  <span>📦</span>
                </div>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-category">{product.category}</p>
                </div>
              </div>
              <div className="product-card-footer">
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state-text">
          <p>No products found matching your search.</p>
        </div>
      )}
    </div>
  );
}
