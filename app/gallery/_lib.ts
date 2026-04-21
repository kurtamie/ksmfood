import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

async function getImagePaths(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getImagePaths(fullPath);
      }

      return IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
        ? [fullPath]
        : [];
    }),
  );

  return nested.flat();
}

function formatLabel(filePath: string) {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getGalleryItems(
  relativeDir: string,
): Promise<GalleryItem[]> {
  const targetDir = path.join(PUBLIC_ROOT, relativeDir);
  const files = await getImagePaths(targetDir);

  return files.sort().map((filePath, index) => {
    const label = formatLabel(filePath) || `Gallery image ${index + 1}`;

    return {
      id: `${index + 1}`,
      src: filePath.replace(PUBLIC_ROOT, "").split(path.sep).join("/"),
      alt: label,
      caption: label,
    };
  });
}
