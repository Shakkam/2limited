"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadToBucket } from "@/lib/storage";

export async function createTrack(formData) {
  const supabase = await createClient();
  const title = formData.get("title");
  const subtitle_fr = formData.get("subtitle_fr") || null;
  const subtitle_en = formData.get("subtitle_en") || null;
  const audioFile = formData.get("audio");

  const src = await uploadToBucket(supabase, "music", audioFile, "");
  if (!src) throw new Error("Un fichier audio est requis.");

  const { count } = await supabase.from("tracks").select("id", { count: "exact", head: true });

  const { error } = await supabase
    .from("tracks")
    .insert({ title, subtitle_fr, subtitle_en, src, sort_order: count || 0 });
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/musique");
  revalidatePath("/music");
  redirect("/backoffice/musique");
}

export async function updateTrack(id, formData) {
  const supabase = await createClient();
  const fields = {
    title: formData.get("title"),
    subtitle_fr: formData.get("subtitle_fr") || null,
    subtitle_en: formData.get("subtitle_en") || null,
  };

  const audioFile = formData.get("audio");
  const newSrc = await uploadToBucket(supabase, "music", audioFile, "");
  if (newSrc) fields.src = newSrc;

  const { error } = await supabase.from("tracks").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/musique");
  revalidatePath("/music");
  redirect("/backoffice/musique");
}

export async function deleteTrack(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  const { error } = await supabase.from("tracks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/musique");
  revalidatePath("/music");
}

// Swaps this track's sort_order with its neighbor in `direction` (-1 up /
// +1 down) — simpler and more robust than drag-and-drop for a short list.
export async function moveTrack(formData) {
  const id = formData.get("id");
  const direction = Number(formData.get("direction"));
  const supabase = await createClient();

  const { data: tracks } = await supabase.from("tracks").select("id, sort_order").order("sort_order");
  if (!tracks) return;

  const index = tracks.findIndex((t) => t.id === id);
  const neighborIndex = index + direction;
  if (index === -1 || neighborIndex < 0 || neighborIndex >= tracks.length) return;

  const current = tracks[index];
  const neighbor = tracks[neighborIndex];

  await supabase.from("tracks").update({ sort_order: neighbor.sort_order }).eq("id", current.id);
  await supabase.from("tracks").update({ sort_order: current.sort_order }).eq("id", neighbor.id);

  revalidatePath("/backoffice/musique");
  revalidatePath("/music");
}
