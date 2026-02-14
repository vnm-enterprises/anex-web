/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import api from "@/lib/api";

export type UploadedPhoto = {
  uploadId: string;
  url: string;
};

interface PhotoUploadZoneProps {
  onUpload: (photos: UploadedPhoto[]) => void;
  onRemove: (index: number) => void;
  previews: string[];
  currentCount: number;
  minFiles: number;
  maxFiles: number;
  error: string | null;
  purpose?: "LISTING_IMAGE" | "USER_AVATAR";
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const PhotoUploadZone = ({
  onUpload,
  onRemove,
  previews,
  currentCount,
  minFiles,
  maxFiles,
  error,
  purpose = "LISTING_IMAGE",
}: PhotoUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadSingleFile = async (file: File): Promise<UploadedPhoto> => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      throw new Error("Only JPG, PNG, WEBP files are allowed");
    }

    const presign = await api.post("/uploads/presign", {
      purpose,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });

    const { uploadId, uploadUrl, fileUrl } = presign.data;

    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error("Failed to upload to storage");
    }

    const etag = putRes.headers.get("etag") ?? undefined;

    await api.post("/uploads/complete", {
      uploadId,
      etag,
    });

    return {
      uploadId,
      url: fileUrl,
    };
  };

  const handleFiles = async (files: FileList) => {
    const filesArray = Array.from(files);

    if (filesArray.length + currentCount > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploadError(null);

    try {
      const uploaded: UploadedPhoto[] = [];
      for (const file of filesArray) {
        const result = await uploadSingleFile(file);
        uploaded.push(result);
      }

      onUpload(uploaded);
    } catch (err: any) {
      console.error("Upload error:", err);
      const message = err.response?.data?.error || err.message || "Upload failed. Please try again.";
      setUploadError(message);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
          ${isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
          }}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-300">
          <span className="text-primary font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to configured server limit</p>
      </div>

      {(uploadError || error) && (
        <div className="text-red-500 text-sm flex items-center gap-1">
          <X size={14} />
          {uploadError || error}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {previews.map((url, index) => (
            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden">
              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                  COVER
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {currentCount} of {maxFiles} files uploaded
        {currentCount < minFiles && <span className="text-red-500 ml-2">({minFiles - currentCount} more required)</span>}
      </div>
    </div>
  );
};

export default PhotoUploadZone;
