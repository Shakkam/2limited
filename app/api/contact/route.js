import { Resend } from "resend";
import content from "@/data/content.json";

// Falls back to the band's own published contact address so this route
// can't silently drift from data/content.json (contact.email) again.
const CONTACT_TO = content.contact?.email || "shakkam.music@gmail.com";

export async function POST(req) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "Email service is not configured" }, { status: 503 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "2-LIMITED Contact <onboarding@resend.dev>",
      to: CONTACT_TO,
      replyTo: email,
      subject: `[2-LIMITED] Message de ${name}`,
      text: `Nom : ${name}\nEmail : ${email}\n\n${message}`,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Send failed" }, { status: 500 });
  }
}
