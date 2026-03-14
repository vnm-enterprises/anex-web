/**
 * Compresses an image and adds a watermark "annex.lk"
 */
export async function processImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max dimension 1200px for balance between quality and size
        if (width > height) {
          if (width > 1200) {
            height *= 1200 / width;
            width = 1200;
          }
        } else {
          if (height > 1200) {
            width *= 1200 / height;
            height = 1200;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Add Watermark
        const watermarkText = "annex.lk";
        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";

        // Draw shadow for visibility
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 4;
        ctx.fillText(watermarkText, width - 20, height - 20);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob failed"));
            }
          },
          "image/jpeg",
          0.7, // Compression quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
