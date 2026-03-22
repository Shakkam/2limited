import data from "@/data/content.json";
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact | 2-LIMITED" };

export default function Contact() {
  const { contact } = data;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-64 pt-24 bg-zinc-950 relative flex items-end px-10 pb-8 border-b border-zinc-900">
        <div>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Get in touch</p>
          <h1 className="text-3xl font-black tracking-widest text-white">CONTACT</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-10 py-12 max-w-lg">
        <p className="text-zinc-700 text-[10px] tracking-[0.4em] uppercase mb-1">Or email directly</p>
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
