"use client";

import data from "@/data/content.json";
import ui from "@/data/ui.json";
import ContactForm from "./ContactForm";
import { useLanguage } from "@/components/LanguageProvider";

export default function ContactClient() {
  const { contact } = data;
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-48 pt-24 bg-zinc-950 relative flex items-end px-10 pb-6 border-b border-zinc-900">
        <div>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-1">
            {t(ui.contact.eyebrow)}
          </p>
          <h1 className="text-2xl font-black tracking-widest text-white">{t(ui.contact.title)}</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-10 py-12 max-w-lg">
        <p className="text-zinc-700 text-[10px] tracking-[0.4em] uppercase mb-1">
          {t(ui.contact.orEmail)}
        </p>
        <a
          href={`mailto:${contact.email}`}
          className="text-zinc-400 hover:text-white text-xs tracking-widest transition-colors mb-10 block"
        >
          {contact.email}
        </a>
        <ContactForm />
      </div>
    </div>
  );
}
