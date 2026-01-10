"use client";

export default function PhotosSection() {
  return (
    <section className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded bg-primary/10 text-primary">
          <span className="material-symbols-outlined">add_a_photo</span>
        </div>
        <h2 className="text-xl font-bold">Photos</h2>
      </div>

      {/* Upload */}
      <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer">
        <span className="material-symbols-outlined text-4xl mb-2">
          cloud_upload
        </span>
        <p className="text-sm">
          <span className="text-primary font-bold">Click to upload</span>{" "}
          or drag & drop
        </p>
        <input type="file" multiple className="hidden" />
      </label>

      {/* Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXqtkpBsw5T26e_GrOnVR_MlA9X7nBx25mRF5qAYZ-ppRlFTGx52BTJUaJUm1leF1TlfurvDfyA2gKjc5lixfGV7yuIWwhM-bQURcAShigfGBTrRTxArMh8Q6MhF43TCKz7vQl7kQGChIwa-M-1WWjDZiyxzxf4jiLMEOVV8wh_B2Z3ZL05oMa78wM3k-8_QjxHhjWQQGIuqIQPA1XGbgsx8k8BSqGkyA3bGNNNTJn5nEcPqsVrKraKl9LGxZTQcUECrBof94Y53c"
            className="w-full h-full object-cover"
            alt=""
          />
          <span className="absolute top-2 left-2 bg-primary text-xs px-2 rounded text-black">
            COVER
          </span>
        </div>
      </div>
    </section>
  );
}
