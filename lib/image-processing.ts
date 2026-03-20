/**
 * Compresses an image and adds an Annex.lk watermark.
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

        // Watermark sizing scales with image dimensions for consistent visibility.
        const watermarkText = "Annex.lk";
        const diagonalSize = Math.max(28, Math.round(width * 0.055));
        const cornerSize = Math.max(18, Math.round(width * 0.025));

        // 1) Diagonal center watermark similar to marketplace style.
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((-20 * Math.PI) / 180);
        ctx.font = `900 ${diagonalSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
        ctx.lineWidth = Math.max(2, Math.round(diagonalSize * 0.08));
        ctx.strokeText(watermarkText, 0, 0);
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();

        // 2) Corner watermark as an additional anti-crop marker.
        ctx.save();
        ctx.font = `800 ${cornerSize}px sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
        ctx.lineWidth = Math.max(1.5, Math.round(cornerSize * 0.08));
        ctx.strokeText(watermarkText, width - 18, height - 14);
        ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
        ctx.fillText(watermarkText, width - 18, height - 14);
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob failed"));
            }
          },
          "image/jpeg",
          0.72,
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
