import data from "@/data/content.json";

export const metadata = { title: "Videos | 2-LIMITED" };

export default function Videos() {
  const { videos } = data;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-64 pt-24 bg-zinc-950 relative flex items-end px-10 pb-8 border-b border-zinc-900">
        <div>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Watch</p>
          <h1 className="text-3xl font-black tracking-widest text-white">VIDEOS</h1>
        </div>
      </div>

      {/* Videos */}
      <div className="px-10 py-12 max-w-3xl flex flex-col gap-12">
        {videos.length === 0 ? (
          <p className="text-zinc-700 text-xs tracking-widest uppercase">
            Videos coming soon
          </p>
        ) : (
          videos.map((video) => (
            <div key={video.id}>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
