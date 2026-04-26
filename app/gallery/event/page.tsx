import GalleryGrid from "@/components/gallery/gallery-grid";
import { getGalleryItems } from "@/app/gallery/_lib";

export default async function GalleryEventPage() {
  const items = await getGalleryItems("images/gallery/event");

  return (
    <main className="w-full overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <GalleryGrid items={items} showCaption={false}/>
      </div>
    </main>
  );
}
