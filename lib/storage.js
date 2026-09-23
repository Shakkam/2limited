// Shared upload helper for backoffice Server Actions. Uploads to a public
// Storage bucket under a random filename (keeps the original extension so
// browsers/players still get a sane content type) and returns its public
// URL — which is exactly the string data/content.json's photo/track `src`
// fields already expect, so no other code needs to know these came from
// Storage instead of /public.
export async function uploadToBucket(supabase, bucket, file, folder = "") {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw new Error(`Échec de l'upload : ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
