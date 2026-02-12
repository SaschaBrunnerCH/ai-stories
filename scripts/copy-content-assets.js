import { copyFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, extname } from "path";

// Image extensions to copy
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

function copyImages(contentDir, publicDir, label) {
  // Ensure public dir exists
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  if (!existsSync(contentDir)) {
    console.log(`No images to copy from ${label} (missing: ${contentDir})`);
    return;
  }

  // Get all files from content dir (top-level only)
  const files = readdirSync(contentDir);

  // Filter and copy image files
  const imageFiles = files.filter((file) =>
    IMAGE_EXTENSIONS.includes(extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log(`No images to copy from ${label}`);
    return;
  }

  imageFiles.forEach((file) => {
    const src = join(contentDir, file);
    const dest = join(publicDir, file);
    copyFileSync(src, dest);
    console.log(`Copied (${label}): ${file}`);
  });

  console.log(`\nCopied ${imageFiles.length} image(s) to ${publicDir}`);
}

copyImages("./content/ai-stories", "./public/ai-stories", "content/ai-stories");
