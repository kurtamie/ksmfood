import "server-only";

import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
};

type GetGalleryItemsOptions = {
  includeDimensions?: boolean;
};

async function getImagePaths(dir: string): Promise<string[]> {
  let entries: Dirent[];

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

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

async function getImageDimensions(filePath: string) {
  const { default: sharp } = await import("sharp");
  const metadata = await sharp(filePath).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
  };
}

export async function getGalleryItems(
  relativeDir: string,
  options: GetGalleryItemsOptions = {},
): Promise<GalleryItem[]> {
  const targetDir = path.join(PUBLIC_ROOT, relativeDir);
  const files = await getImagePaths(targetDir);

  const items = await Promise.all(
    files.sort().map(async (filePath, index) => {
      const label = formatLabel(filePath) || `Gallery image ${index + 1}`;
      const dimensions = options.includeDimensions
        ? await getImageDimensions(filePath)
        : {};

      return {
        id: `${index + 1}`,
        src: filePath.replace(PUBLIC_ROOT, "").split(path.sep).join("/"),
        alt: label,
        caption: label,
        ...dimensions,
      };
    }),
  );

  return items;
}
