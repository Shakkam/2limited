import data from "@/data/content.json";
import FadeUp from "@/components/FadeUp";
import AudioPlayer from "@/components/AudioPlayer";

export const metadata = { title: "Music | 2-LIMITED" };

export default function Music() {
  const { albums } = data;
  const tracks = data.tracks || [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-64 pt-24 bg-zinc-950 relative flex items-end px-10 pb-8 border-b border-zinc-900">
        <div>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Discography</p>
          <h1 className="text-3xl font-black tracking-widest text-white">MUSIC</h1>
        </div>
      </div>

      {/* Tracks */}
      {tracks.length > 0 && (
        <div className="px-10 pt-12">
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-5">Covers & Recordings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {tracks.map((track, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <AudioPlayer src={track.src} title={track.title} subtitle={track.subtitle} />
              </FadeUp>
            ))}
          </div>
        </div>
      )}

      {/* Albums */}
      <div className="px-10 py-12">
        {albums.length === 0 ? (
          <p className="text-zinc-700 text-xs tracking-widest uppercase">
            Albums coming soon
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <div key={album.id} className="group">
                <div className="aspect-square bg-zinc-900 mb-4 overflow-hidden relative">
                  {album.cover ? (
                    <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-zinc-700 text-xs tracking-widest">Cover</p>
                    </div>
                  )}
                </div>
                <p className="text-white text-sm font-bold tracking-widest">{album.title}</p>
                <p className="text-zinc-600 text-xs tracking-widest mt-1">{album.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
