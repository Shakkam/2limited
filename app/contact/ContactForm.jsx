"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

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
        <p className="text-white text-sm font-bold tracking-widest mb-2">MESSAGE SENT</p>
        <p className="text-zinc-600 text-xs tracking-widest mb-8">Thank you, we&apos;ll get back to you soon.</p>
        <button
          onClick={() => setStatus("idle")}
          className="border border-zinc-700 text-zinc-500 text-[10px] font-bold tracking-widest px-6 py-2 hover:border-white hover:text-white transition-colors"
        >
          SEND ANOTHER
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {[
        { name: "name", label: "NAME", type: "text", placeholder: "Your name" },
        { name: "email", label: "EMAIL", type: "email", placeholder: "your@email.com" },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            required
            placeholder={placeholder}
            className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors placeholder-zinc-800"
          />
        </div>
      ))}
      <div>
        <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">MESSAGE</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Your message..."
          className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors resize-none placeholder-zinc-800"
        />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-xs tracking-widest">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-40 mt-2"
      >
        {status === "loading" ? "SENDING..." : "SEND"}
      </button>
    </form>
  );
}
