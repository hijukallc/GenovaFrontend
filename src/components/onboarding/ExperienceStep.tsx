import React, { useState } from 'react';

interface ExperienceData {
  careerHistory: string;
  credentials: File[];
}

interface Props {
  data: ExperienceData;
  updateData: (data: Partial<ExperienceData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ExperienceStep: React.FC<Props> = ({ data, updateData, onNext, onPrev }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(
        file => file.type === 'application/pdf' || file.type.startsWith('image/')
      );
      updateData({ credentials: [...data.credentials, ...newFiles] });
    }
  };

  const removeFile = (index: number) => {
    const newCredentials = data.credentials.filter((_, i) => i !== index);
    updateData({ credentials: newCredentials });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const isValid = data.careerHistory.trim().length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Professional Experience</h2>
      
      <div className="space-y-6">
        {/* Career History */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Career History Summary *
          </label>
          <textarea
            value={data.careerHistory}
            onChange={(e) => updateData({ careerHistory: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Provide a chronological overview of your career highlights, key positions held, major accomplishments, and notable projects or initiatives you led..."
          />
        </div>

        {/* Credentials Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credentials & Certifications
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragOver ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload credentials, certificates, or diplomas
                </span>
                <span className="mt-2 block text-sm text-gray-500">
                  PDF or image files up to 10MB each
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Uploaded Files */}
          {data.credentials.length > 0 && (
            <div className="mt-4 space-y-2">
              {data.credentials.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
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

export default ExperienceStep;