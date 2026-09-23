import { createClient } from "@/lib/supabase/server";
import MediaClient from "./MediaClient";

export const metadata = { title: "Media | 2-LIMITED" };

export default async function Media() {
  const supabase = await createClient();
  const { data: photos } = await supabase.from("photos").select("*").order("sort_order");

  return <MediaClient photos={photos || []} />;
}
