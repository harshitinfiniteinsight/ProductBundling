import { BundleType } from '../types';

interface BundleTypeInfoProps {
  bundleType: BundleType;
}

export function BundleTypeInfo({ bundleType }: BundleTypeInfoProps) {
  if (bundleType === 'BOGO') {
    return (
      <div key="bogo" className="bundle-type-info" role="status" aria-live="polite">
        <div className="bundle-type-info-icon" aria-hidden="true">
          ℹ
        </div>
        <div className="bundle-type-info-content">
          <h4>BOGO (Buy X Get Y)</h4>
          <p>
            This bundle allows customers to receive a free or discounted product when they purchase another product in a
            specified quantity.
          </p>
          <p className="bundle-type-info-examples">
            Buy 2 Coca-Cola → Get 1 Coca-Cola Free
            <br />
            Buy 1 Pizza → Get 50% off Garlic Bread
          </p>
          <p>This is commonly used for promotional offers and volume discounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div key="bundle" className="bundle-type-info" role="status" aria-live="polite">
      <div className="bundle-type-info-icon" aria-hidden="true">
        ℹ
      </div>
      <div className="bundle-type-info-content">
        <h4>Product Bundle</h4>
        <p>This bundle groups multiple complementary products together and sells them as a single package.</p>
        <p className="bundle-type-info-examples">
          Burger + Fries + Coke Combo
          <br />
          Camera + Memory Card + Bag
        </p>
        <p>You can optionally apply discounts to individual items or the entire bundle.</p>
      </div>
    </div>
  );
}
