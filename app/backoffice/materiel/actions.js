"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function fieldsFromForm(formData) {
  return {
    name: formData.get("name"),
    category: formData.get("category") || null,
    owner: formData.get("owner") || null,
    status: formData.get("status") || "ok",
    quantity: Number(formData.get("quantity")) || 1,
    notes: formData.get("notes") || null,
  };
}

export async function createGear(formData) {
  const supabase = await createClient();
  const { error } = await supabase.from("gear").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);

  // Preserves the current "group by" view (a hidden field on both the
  // inline per-group form and the main one) so adding an item doesn't
  // silently reset the list back to ungrouped.
  const groupBy = formData.get("_groupBy");
  revalidatePath("/backoffice/materiel");
  redirect(groupBy ? `/backoffice/materiel?groupBy=${groupBy}` : "/backoffice/materiel");
}

export async function updateGear(id, formData) {
  const supabase = await createClient();
  const { error } = await supabase.from("gear").update(fieldsFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);

  const groupBy = formData.get("_groupBy");
  revalidatePath("/backoffice/materiel");
  redirect(groupBy ? `/backoffice/materiel?groupBy=${groupBy}` : "/backoffice/materiel");
}

export async function deleteGear(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  const { error } = await supabase.from("gear").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/backoffice/materiel");
}
