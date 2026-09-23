import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateShow } from "../actions";
import ShowFormFields from "../ShowFormFields";

export const metadata = { title: "Modifier un concert — Backoffice" };

export default async function EditShowPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: show } = await supabase.from("shows").select("*").eq("id", id).single();

  if (!show) notFound();

  const updateWithId = updateShow.bind(null, id);

  return (
    <div className="px-6 md:px-10 py-12 max-w-lg">
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Backoffice</p>
      <h1 className="text-white text-2xl font-black tracking-widest uppercase mb-10">
        Modifier le concert
      </h1>
      <form action={updateWithId} className="flex flex-col gap-5">
        <ShowFormFields show={show} />
        <button
          type="submit"
          className="self-start mt-2 border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors"
        >
          ENREGISTRER
        </button>
      </form>
    </div>
  );
}
