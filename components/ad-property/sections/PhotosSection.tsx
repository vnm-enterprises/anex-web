/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Upload, X, Star } from "lucide-react";
import { useRef, ChangeEvent } from "react";

/**
 * Photo upload section with preview.
 */
export default function PhotosSection({
  data,
  onChange,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: {
   data: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    onChange("propertyImages", [...data.propertyImages, ...newUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = data.propertyImages.filter((_: any, i: number) => i !== index);
    onChange("propertyImages", newImages);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Photos</h2>

      <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary transition-colors">
        <Upload size={32} className="text-gray-400 mb-2" />
        <p className="text-sm text-center max-w-xs">
          <span className="text-primary font-bold">Click to upload</span> or drag & drop<br />
          <span className="text-gray-500 text-xs">PNG, JPG up to 10MB</span>
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
      </label>

      {data.propertyImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Preview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.propertyImages.map((url: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <img src={url} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-primary text-xs px-2 py-1 rounded text-black font-bold">
                    COVER
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Back
          </button>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary/90"
        >
          {isLastStep ? "Publish Listing" : "Next"}
        </button>
      </div>
    </div>
  );
}