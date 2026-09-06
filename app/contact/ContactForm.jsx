"use client";

import { useState } from "react";
import ui from "@/data/ui.json";
import { useLanguage } from "@/components/LanguageProvider";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const { t } = useLanguage();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-8">
        <p className="text-white text-sm font-bold tracking-widest mb-2">{t(ui.contact.sent)}</p>
        <p className="text-zinc-600 text-xs tracking-widest mb-8">{t(ui.contact.sentBody)}</p>
        <button
          onClick={() => setStatus("idle")}
          className="border border-zinc-700 text-zinc-500 text-[10px] font-bold tracking-widest px-6 py-2 hover:border-white hover:text-white transition-colors"
        >
          {t(ui.contact.sendAnother)}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {[
        { name: "name", label: ui.contact.name, type: "text", placeholder: ui.contact.namePlaceholder },
        { name: "email", label: ui.contact.email, type: "email", placeholder: ui.contact.emailPlaceholder },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">
            {t(label)}
          </label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            required
            placeholder={t(placeholder)}
            className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors placeholder-zinc-800"
          />
        </div>
      ))}
      <div>
        <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">
          {t(ui.contact.message)}
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder={t(ui.contact.messagePlaceholder)}
          className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors resize-none placeholder-zinc-800"
        />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-xs tracking-widest">{t(ui.contact.error)}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-40 mt-2"
      >
        {status === "loading" ? t(ui.contact.sending) : t(ui.contact.send)}
      </button>
    </form>
  );
}
