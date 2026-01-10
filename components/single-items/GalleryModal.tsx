import { X } from "lucide-react";

export default function GalleryModal({
  images,
  onClose,
}: {
  images: string[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-semibold">
              All photos
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80"
            >
              <X size={24} />
            </button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-64 object-cover rounded-xl"
                alt=""
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
