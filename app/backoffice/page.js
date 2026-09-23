import Link from "next/link";

const sections = [
  { href: "/backoffice/concerts", label: "Concerts", desc: "Dates, lieux, billetterie, affiches" },
  { href: "/backoffice/musique", label: "Musique", desc: "Morceaux mis en avant sur le site" },
  { href: "/backoffice/photos", label: "Photos", desc: "Galerie médias & fond de la page Musique" },
  { href: "/backoffice/materiel", label: "Matériel", desc: "Inventaire de matos pour les concerts" },
];

export default function BackofficeHome() {
  return (
    <div className="px-6 md:px-10 py-12">
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Backoffice</p>
      <h1 className="text-white text-2xl font-black tracking-widest uppercase mb-10">
        Bonjour 👋
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block border border-zinc-800 hover:border-zinc-600 bg-zinc-950 px-6 py-6 transition-colors"
          >
            <p className="text-white text-sm font-black tracking-widest uppercase mb-2">{s.label}</p>
            <p className="text-zinc-500 text-xs tracking-wide">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
