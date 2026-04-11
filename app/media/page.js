import data from "@/data/content.json";
import FadeUp from "@/components/FadeUp";
import PhotoGallery from "@/components/PhotoGallery";

export const metadata = { title: "Media | 2-LIMITED" };

export default function Media() {
  const { videos, photos } = data;

  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/images/background-media.jpg')", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Hero */}
      <div className="h-64 pt-24 bg-zinc-950 relative flex items-end px-10 pb-8 border-b border-zinc-900">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Watch & See</p>
          <h1 className="text-3xl font-black tracking-widest text-white">MEDIA</h1>
        </FadeUp>
      </div>

      {/* Videos */}
      <div className="px-10 py-12 border-b border-zinc-900">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-8">Videos</p>
        </FadeUp>
        {videos.length === 0 ? (
          <p className="text-zinc-700 text-xs tracking-widest uppercase">Videos coming soon</p>
        ) : (
          <div className="flex flex-col gap-12 max-w-3xl mx-auto">
            {videos.map((video, i) => (
              <FadeUp key={video.id} delay={i * 0.1}>
                <div className="aspect-video w-full bg-zinc-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-white text-sm font-bold tracking-widest mt-4">{video.title}</p>
                <p className="text-zinc-600 text-xs tracking-widest mt-1">{video.year}</p>
              </FadeUp>
            ))}
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="px-10 py-12">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-8">Photos</p>
        </FadeUp>
        {photos.length === 0 ? (
          <p className="text-zinc-700 text-xs tracking-widest uppercase">Photos coming soon</p>
        ) : (
          <PhotoGallery photos={photos} />
        )}
      </div>
    </div>
  );
}
