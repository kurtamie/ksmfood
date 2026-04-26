import { getGalleryItems } from "@/app/gallery/_lib";
import TestimonialGalleryGrid from "@/components/gallery/testimonial-gallery-grid";

export default async function GalleryTestimonialPage() {
  const items = await getGalleryItems("images/gallery/testimonial", {
    includeDimensions: true,
  });

  return (
    <main className="w-full overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <TestimonialGalleryGrid items={items} />
      </div>
    </main>
  );
}
