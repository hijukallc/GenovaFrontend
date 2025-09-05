import React from 'react';

interface AvailabilityData {
  isAvailable: boolean;
  calendar: string;
}

interface Props {
  data: AvailabilityData;
  updateData: (data: Partial<AvailabilityData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AvailabilityStep: React.FC<Props> = ({ data, updateData, onNext, onPrev }) => {
  const availabilityOptions = [
    { value: 'immediately', label: 'Available Immediately', desc: 'Ready to start projects right away' },
    { value: '1-2weeks', label: '1-2 Weeks Notice', desc: 'Need some time to wrap up current commitments' },
    { value: '1month', label: '1 Month Notice', desc: 'Have ongoing commitments to complete first' },
    { value: 'flexible', label: 'Flexible Timeline', desc: 'Open to discussing project timelines' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Availability & Preferences</h2>
      
      <div className="space-y-8">
        {/* Availability Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Are you currently available for consulting projects? *
          </label>
          <div className="flex items-center space-x-8">
            <button
              onClick={() => updateData({ isAvailable: true })}
              className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                data.isAvailable
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                data.isAvailable ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {data.isAvailable && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-semibold">Yes, I'm Available</div>
                <div className="text-sm opacity-75">Ready to take on new projects</div>
              </div>
            </button>

            <button
              onClick={() => updateData({ isAvailable: false })}
              className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                !data.isAvailable
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                !data.isAvailable ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
              }`}>
                {!data.isAvailable && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-semibold">Not Currently Available</div>
                <div className="text-sm opacity-75">Building profile for future opportunities</div>
              </div>
            </button>
          </div>
        </div>

        {/* Availability Timeline */}
        {data.isAvailable && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              When can you start new projects?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availabilityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData({ calendar: option.value })}
                  className={`p-4 text-left rounded-lg border-2 transition-colors ${
                    data.calendar === option.value
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-1 ${
                      data.calendar === option.value
                        ? 'border-yellow-500 bg-yellow-500'
                        : 'border-gray-300'
                    }`}>
                      {data.calendar === option.value && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm opacity-75 mt-1">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Project Preferences */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Engagement Types</h4>
              <ul className="space-y-1">
                <li>• Strategic consulting</li>
                <li>• Board advisory roles</li>
                <li>• Interim executive positions</li>
                <li>• Project-based consulting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Typical Duration</h4>
              <ul className="space-y-1">
                <li>• Short-term (1-3 months)</li>
                <li>• Medium-term (3-12 months)</li>
                <li>• Long-term (12+ months)</li>
                <li>• Ongoing advisory</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-slate-900 text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800"
        >
          Complete Profile
        </button>
      </div>
    </div>
  );
};

export default AvailabilityStep;