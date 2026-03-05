import { useState } from 'react';
import { Bundle, Product } from '../types';
import { BundleStepper, StepConfig } from './BundleStepper';
import { BundleDetailsStep } from './BundleDetailsStep';
import { BundleConfigurationStep } from './BundleConfigurationStep';
import { BundlePricingStep } from './BundlePricingStep';
import { BundlePreviewStep } from './BundlePreviewStep';

interface CreateBundlePageProps {
  draft: Bundle;
  products: Product[];
  mode: 'create' | 'edit' | 'view';
  onChange: (bundle: Bundle) => void;
  onBack: () => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onSaveActivate: () => void;
}

const STEPS: StepConfig[] = [
  { number: 1, label: 'Bundle Details' },
  { number: 2, label: 'Bundle Configuration' },
  { number: 3, label: 'Pricing' },
  { number: 4, label: 'Preview & Save' },
];

export function CreateBundlePage({
  draft,
  products,
  onChange,
  onBack,
  onCancel,
  onSaveDraft,
  onSaveActivate,
}: CreateBundlePageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCompletedSteps([...new Set([...completedSteps, currentStep])]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      onCancel();
    }
  };

  return (
    <div>
      <header className="topbar">
        <div>
          <button type="button" className="back-link" onClick={onBack}>
            ← Back to Manage Bundles
          </button>
          <h1>Create Product Bundle</h1>
        </div>
      </header>

      {/* Stepper */}
      <div className="stepper-container">
        <BundleStepper steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Step Content */}
      <div className="form-flow">
        {currentStep === 1 && (
          <BundleDetailsStep
            draft={draft}
            onChange={onChange}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 2 && (
          <BundleConfigurationStep
            draft={draft}
            products={products}
            onChange={onChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <BundlePricingStep
            draft={draft}
            products={products}
            onChange={onChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <BundlePreviewStep
            draft={draft}
            products={products}
            onBack={handleBack}
            onSaveDraft={onSaveDraft}
            onSaveActivate={onSaveActivate}
          />
        )}
      </div>
    </div>
  );
}