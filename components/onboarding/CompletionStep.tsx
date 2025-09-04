import React from 'react';

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

interface Props {
  data: OnboardingData;
}

const CompletionStep: React.FC<Props> = ({ data }) => {
  const handleGoToDashboard = () => {
    // In a real app, this would navigate to the dashboard
    console.log('Navigating to dashboard with data:', data);
    alert('Profile created successfully! Redirecting to dashboard...');
  };

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        Welcome to GENOVA, {data.personalDetails.fullName.split(' ')[0]}!
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Your expert profile has been successfully created. You're now ready to connect with organizations 
        seeking your expertise and start making an impact.
      </p>

      {/* Profile Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-gray-600">{data.personalDetails.fullName}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Title:</span>
            <span className="ml-2 text-gray-600">{data.personalDetails.title}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>
            <span className="ml-2 text-gray-600">{data.personalDetails.location}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Availability:</span>
            <span className="ml-2 text-gray-600">
              {data.availability.isAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Expertise Areas:</span>
            <span className="ml-2 text-gray-600">{data.expertise.areas.join(', ')}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Preferred Sectors:</span>
            <span className="ml-2 text-gray-600">{data.expertise.sectors.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">What's Next?</h3>
        <ul className="text-left text-yellow-700 space-y-2">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Your profile will be reviewed by our team within 24 hours
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Once approved, your profile will be visible to potential clients
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            You'll receive notifications when clients express interest
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            You can update your profile and availability anytime from your dashboard
          </li>
        </ul>
      </div>

      <button
        onClick={handleGoToDashboard}
        className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default CompletionStep;