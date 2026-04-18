import Masonry from "@/components/Masonry";
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGE_ROOT = path.join(process.cwd(), "public", "images");
const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

type MasonryItem = {
  id: string;
  img: string;
  height: number;
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

async function buildMasonryItems(): Promise<MasonryItem[]> {
  const files = await getImagePaths(IMAGE_ROOT);

  const items = await Promise.all(
    files.sort().map(async (filePath, index) => {
      const metadata = await sharp(filePath).metadata();
      const aspectRatio =
        metadata.width && metadata.height
          ? metadata.height / metadata.width
          : 1;
      const scaledHeight = Math.round(
        Math.min(Math.max(aspectRatio * 760, 320), 960),
      );
      const relativePath = filePath
        .replace(path.join(process.cwd(), "public"), "")
        .split(path.sep)
        .join("/");

      return {
        id: `${index + 1}`,
        img: relativePath,
        height: scaledHeight,
      };
    }),
  );

  return items;
}

export default async function GalleryEventPage() {
  const items = await buildMasonryItems();

  return (
    <main className="w-full overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover={false}
        />
      </div>
    </main>
  );
}
