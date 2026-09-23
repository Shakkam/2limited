import { createClient } from "@/lib/supabase/server";
import ShowsClient from "./ShowsClient";

export const metadata = { title: "Concerts | 2-LIMITED" };

// Reads straight from Supabase (not data/content.json) so a show added or
// edited in the backoffice appears here immediately — no redeploy needed.
function mapShow(row) {
  return {
    date: row.date,
    time: row.time,
    city: row.city,
    venue: row.venue,
    note: row.note_fr || row.note_en ? { fr: row.note_fr, en: row.note_en } : null,
    ticketUrl: row.ticket_url,
    posterSrc: row.poster_src,
  };
}

export default async function Tour() {
  const supabase = await createClient();
  const { data } = await supabase.from("shows").select("*").order("date");
  const shows = (data || []).map(mapShow);

  return <ShowsClient shows={shows} />;
}
