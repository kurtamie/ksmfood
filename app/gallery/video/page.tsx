const videos = [
  {
    id: "rmIiFeabygg",
    title: "KSM Katering Video 1",
    autoplay: true,
  },
  {
    id: "pkv7Z8l-TlA",
    title: "KSM Katering Video 2",
  },
  {
    id: "UABi-TNBLPE",
    title: "KSM Katering Video 3",
  },
  {
    id: "scUiOk_RidU",
    title: "KSM Katering Video 4",
  },
  {
    id: "nxJ3_mBdZI8",
    title: "KSM Katering Video 5",
  },
  {
    id: "iQDYsD61bWY",
    title: "KSM Katering Video 6",
  },
  {
    id: "u-QRfa0B8H0",
    title: "KSM Katering Video 7",
  },
  {
    id: "iExIKmDi4EE",
    title: "KSM Katering Video 8",
  },
  {
    id: "14sXRU2yVJ8",
    title: "KSM Katering Video 9",
  },
];

function getEmbedUrl(id: string, autoplay = false) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });

  if (autoplay) {
    params.set("autoplay", "1");
    params.set("mute", "1");
    params.set("controls", "1");
    params.set("playsinline", "1");
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export default async function GalleryVideoPage() {
  const [featuredVideo, ...gridVideos] = videos;

  return (
    <main className="w-full overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="space-y-4 sm:space-y-6">
          <div className="overflow-hidden rounded-2xl bg-neutral-950 shadow-sm">
            <iframe
              title={featuredVideo.title}
              src={getEmbedUrl(featuredVideo.id, featuredVideo.autoplay)}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {gridVideos.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-2xl bg-neutral-950 shadow-sm"
              >
                <iframe
                  title={video.title}
                  src={getEmbedUrl(video.id)}
                  className="aspect-video w-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
