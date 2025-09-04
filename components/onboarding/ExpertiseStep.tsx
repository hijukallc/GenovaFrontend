import React from 'react';

interface ExpertiseData {
  areas: string[];
  sectors: string[];
}

interface Props {
  data: ExpertiseData;
  updateData: (data: Partial<ExpertiseData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const expertiseAreas = [
  'Strategic Planning', 'Financial Management', 'Operations Management',
  'Human Resources', 'Marketing & Sales', 'Technology & Digital',
  'Risk Management', 'Compliance & Legal', 'Mergers & Acquisitions',
  'International Business', 'Supply Chain', 'Customer Experience',
  'Innovation & R&D', 'Change Management', 'Leadership Development'
];

const sectors = [
  'Healthcare & Pharmaceuticals', 'Financial Services', 'Technology',
  'Manufacturing', 'Retail & Consumer Goods', 'Energy & Utilities',
  'Real Estate', 'Education', 'Government & Public Sector',
  'Non-Profit', 'Aerospace & Defense', 'Automotive',
  'Media & Entertainment', 'Telecommunications', 'Agriculture'
];

const ExpertiseStep: React.FC<Props> = ({ data, updateData, onNext, onPrev }) => {
  const toggleArea = (area: string) => {
    const newAreas = data.areas.includes(area)
      ? data.areas.filter(a => a !== area)
      : [...data.areas, area];
    updateData({ areas: newAreas });
  };

  const toggleSector = (sector: string) => {
    const newSectors = data.sectors.includes(sector)
      ? data.sectors.filter(s => s !== sector)
      : [...data.sectors, sector];
    updateData({ sectors: newSectors });
  };

  const isValid = data.areas.length > 0 && data.sectors.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Areas of Expertise</h2>
      
      <div className="space-y-8">
        {/* Expertise Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select your areas of expertise (choose at least one) *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expertiseAreas.map((area) => (
              <button
                key={area}
                onClick={() => toggleArea(area)}
                className={`p-3 text-left rounded-lg border-2 transition-colors ${
                  data.areas.includes(area)
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    data.areas.includes(area)
                      ? 'border-yellow-500 bg-yellow-500'
                      : 'border-gray-300'
                  }`}>
                    {data.areas.includes(area) && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{area}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Sectors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select your preferred industry sectors (choose at least one) *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => toggleSector(sector)}
                className={`p-3 text-left rounded-lg border-2 transition-colors ${
                  data.sectors.includes(sector)
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    data.sectors.includes(sector)
                      ? 'border-yellow-500 bg-yellow-500'
                      : 'border-gray-300'
                  }`}>
                    {data.sectors.includes(sector) && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{sector}</span>
                </div>
              </button>
            ))}
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
          disabled={!isValid}
          className={`px-6 py-2 rounded-md font-medium ${
            isValid
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ExpertiseStep;