import { createClient } from "@/lib/supabase/server";
import MusicClient from "./MusicClient";

export const metadata = { title: "Music | 2-LIMITED" };

function mapTrack(row) {
  return {
    title: row.title,
    subtitle: row.subtitle_fr || row.subtitle_en ? { fr: row.subtitle_fr, en: row.subtitle_en } : null,
    src: row.src,
  };
}

export default async function Music() {
  const supabase = await createClient();
  const [{ data: trackRows }, { data: photoRows }] = await Promise.all([
    supabase.from("tracks").select("*").order("sort_order"),
    supabase.from("photos").select("*").order("sort_order"),
  ]);

  const tracks = (trackRows || []).map(mapTrack);
  const photos = photoRows || [];

  return <MusicClient tracks={tracks} photos={photos} />;
}
