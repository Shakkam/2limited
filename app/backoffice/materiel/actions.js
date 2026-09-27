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

// Called directly from a Client Component (AddGearForm) inside a
// transition, not via a plain <form action>, so it can await the result
// and reset/close the form on success — no redirect needed since we never
// navigate away; revalidatePath alone refreshes the list in place,
// automatically preserving whatever ?groupBy= the page is already on.
export async function createGear(formData) {
  const supabase = await createClient();
  const { error } = await supabase.from("gear").insert(fieldsFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/backoffice/materiel");
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
