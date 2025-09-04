import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import PersonalDetailsStep from './onboarding/PersonalDetailsStep.tsx';
import ExperienceStep from './onboarding/ExperienceStep.tsx';
import ExpertiseStep from './onboarding/ExpertiseStep.tsx';
import AvailabilityStep from './onboarding/AvailabilityStep.tsx';
import CompletionStep from './onboarding/CompletionStep.tsx';

interface OnboardingData {
  personalDetails: {
    fullName: string;
    title: string;
    location: string;
    biography: string;
    profilePhoto: File | null;
  };
  experience: {
    careerHistory: string;
    credentials: File[];
  };
  expertise: {
    areas: string[];
    sectors: string[];
  };
  availability: {
    isAvailable: boolean;
    calendar: string;
  };
}

const OnboardingFlow: React.FC = () => {
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    personalDetails: {
      fullName: '',
      title: '',
      location: '',
      biography: '',
      profilePhoto: null,
    },
    experience: {
      careerHistory: '',
      credentials: [],
    },
    expertise: {
      areas: [],
      sectors: [],
    },
    availability: {
      isAvailable: false,
      calendar: '',
    },
  });

  const steps = [
    'Personal Details',
    'Experience',
    'Expertise',
    'Availability',
    'Complete'
  ];

  const updateData = (section: keyof OnboardingData, newData: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...newData }
    }));
  };

  const nextStep = () => {
    trackEvent('onboarding_step_completed', { step: currentStep, stepName: steps[currentStep - 1] });
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };
  const prevStep = () => {
    trackEvent('onboarding_step_back', { step: currentStep, stepName: steps[currentStep - 1] });
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > index + 1
                      ? 'bg-yellow-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > index + 1 ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <PersonalDetailsStep
              data={data.personalDetails}
              updateData={(newData) => updateData('personalDetails', newData)}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <ExperienceStep
              data={data.experience}
              updateData={(newData) => updateData('experience', newData)}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 3 && (
            <ExpertiseStep
              data={data.expertise}
              updateData={(newData) => updateData('expertise', newData)}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 4 && (
            <AvailabilityStep
              data={data.availability}
              updateData={(newData) => updateData('availability', newData)}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 5 && (
            <CompletionStep data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
export { OnboardingFlow };