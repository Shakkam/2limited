import data from "@/data/content.json";

export const metadata = { title: "Tour | 2-LIMITED" };

export default function Tour() {
  const { tour } = data;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-64 pt-24 bg-zinc-950 relative flex items-end px-10 pb-8 border-b border-zinc-900">
        <div>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Live</p>
          <h1 className="text-3xl font-black tracking-widest text-white">TOUR</h1>
        </div>
      </div>

      {/* Dates */}
      <div className="px-10 py-12 max-w-2xl">
        {tour.length === 0 ? (
          <p className="text-zinc-700 text-xs tracking-widest uppercase">
            No dates announced yet
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-900">
            {tour.map((show, i) => (
              <div key={i} className="py-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                  <div className="text-center w-14">
                    <p className="text-white text-xs font-bold tracking-widest">{show.month}</p>
                    <p className="text-white text-3xl font-black">{show.day}</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold tracking-widest">{show.venue}</p>
                    <p className="text-zinc-600 text-xs tracking-widest mt-1">{show.city}, {show.country}</p>
                  </div>
                </div>
                {show.ticketUrl && (
                  <a
                    href={show.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white text-white text-[10px] font-bold tracking-widest px-5 py-2 hover:bg-white hover:text-black transition-colors shrink-0"
                  >
                    TICKETS
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
