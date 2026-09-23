"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadToBucket } from "@/lib/storage";

// Accepts multiple files at once (the upload input is `multiple`) so a
// whole concert's worth of photos can be added in one go, same as dropping
// them into public/images used to be — except this actually persists on
// Vercel's read-only filesystem and shows up without a redeploy.
export async function uploadPhotos(formData) {
  const supabase = await createClient();
  const files = formData.getAll("photos").filter((f) => f && f.size > 0);
  if (files.length === 0) return;

  const { count } = await supabase.from("photos").select("id", { count: "exact", head: true });
  let order = count || 0;

  for (const file of files) {
    const src = await uploadToBucket(supabase, "photos", file, "");
    const { error } = await supabase.from("photos").insert({ src, alt: "2-LIMITED", sort_order: order++ });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/backoffice/photos");
  revalidatePath("/media");
  revalidatePath("/music");
}

export async function updatePhotoAlt(formData) {
  const id = formData.get("id");
  const alt = formData.get("alt");
  const supabase = await createClient();
  const { error } = await supabase.from("photos").update({ alt }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/photos");
  revalidatePath("/media");
  revalidatePath("/music");
}

export async function deletePhoto(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/photos");
  revalidatePath("/media");
  revalidatePath("/music");
}
