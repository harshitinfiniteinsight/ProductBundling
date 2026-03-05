import React from 'react';

export interface StepConfig {
  number: number;
  label: string;
}

interface BundleStepperProps {
  steps: StepConfig[];
  currentStep: number;
  completedSteps: number[];
}

export function BundleStepper({ steps, currentStep, completedSteps }: BundleStepperProps) {
  return (
    <div className="bundle-stepper">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.number);
        const isCurrent = currentStep === step.number;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.number}>
            <div className={`step-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-circle">
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="step-number">{step.number}</span>
                )}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            {!isLast && <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
