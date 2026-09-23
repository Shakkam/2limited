"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadToBucket } from "@/lib/storage";

function fieldsFromForm(formData) {
  return {
    date: formData.get("date"),
    time: formData.get("time") || null,
    city: formData.get("city"),
    venue: formData.get("venue") || null,
    note_fr: formData.get("note_fr") || null,
    note_en: formData.get("note_en") || null,
    ticket_url: formData.get("ticket_url") || null,
  };
}

export async function createShow(formData) {
  const supabase = await createClient();
  const fields = fieldsFromForm(formData);

  const posterFile = formData.get("poster");
  const posterSrc = await uploadToBucket(supabase, "photos", posterFile, "posters/");

  const { error } = await supabase.from("shows").insert({ ...fields, poster_src: posterSrc });
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/concerts");
  revalidatePath("/tour");
  redirect("/backoffice/concerts");
}

export async function updateShow(id, formData) {
  const supabase = await createClient();
  const fields = fieldsFromForm(formData);

  const posterFile = formData.get("poster");
  const newPosterSrc = await uploadToBucket(supabase, "photos", posterFile, "posters/");
  if (newPosterSrc) fields.poster_src = newPosterSrc;

  const { error } = await supabase.from("shows").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/concerts");
  revalidatePath("/tour");
  redirect("/backoffice/concerts");
}

export async function deleteShow(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  const { error } = await supabase.from("shows").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/concerts");
  revalidatePath("/tour");
}
