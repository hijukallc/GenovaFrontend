import React, { useState } from 'react';

interface PersonalDetailsData {
  fullName: string;
  title: string;
  location: string;
  biography: string;
  profilePhoto: File | null;
}

interface Props {
  data: PersonalDetailsData;
  updateData: (data: Partial<PersonalDetailsData>) => void;
  onNext: () => void;
}

const PersonalDetailsStep: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ profilePhoto: file });
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isValid = data.fullName && data.title && data.location && data.biography;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Details</h2>
      
      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        {/* Professional Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title *
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., Former CEO, Retired CFO, Senior Marketing Director"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="City, State/Country"
          />
        </div>

        {/* Biography */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Biography *
          </label>
          <textarea
            value={data.biography}
            onChange={(e) => updateData({ biography: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Describe your professional background, key achievements, and what makes you an expert in your field..."
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
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

export default PersonalDetailsStep;