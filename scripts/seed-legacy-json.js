// One-time historical seed: migrated the original data/content.json arrays
// (shows/tracks/photos) into their Supabase tables. Kept for reference —
// re-running it would duplicate every row, since it always inserts. Not
// part of the normal migration flow (see migrate.js for that).
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { Client } = require("pg");
const content = require(path.join(__dirname, "..", "data", "content.json"));

(async () => {
  const base = process.env.POSTGRES_URL_NON_POOLING.split("?")[0];
  const client = new Client({ connectionString: base, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    // Shows -----------------------------------------------------------
    for (const s of content.shows || []) {
      const venue = typeof s.venue === "object" ? s.venue.fr : s.venue;
      const noteFr = s.note ? (typeof s.note === "object" ? s.note.fr : s.note) : null;
      const noteEn = s.note ? (typeof s.note === "object" ? s.note.en : s.note) : null;
      await client.query(
        `insert into shows (date, time, city, venue, note_fr, note_en, ticket_url, poster_src)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [s.date, s.time || null, s.city, venue || null, noteFr, noteEn, s.ticketUrl || null, s.posterSrc || null]
      );
    }
    console.log(`Seeded ${content.shows?.length || 0} shows`);

    // Tracks ------------------------------------------------------------
    let order = 0;
    for (const t of content.tracks || []) {
      const subFr = t.subtitle ? (typeof t.subtitle === "object" ? t.subtitle.fr : t.subtitle) : null;
      const subEn = t.subtitle ? (typeof t.subtitle === "object" ? t.subtitle.en : t.subtitle) : null;
      await client.query(
        `insert into tracks (title, subtitle_fr, subtitle_en, src, sort_order) values ($1,$2,$3,$4,$5)`,
        [t.title, subFr, subEn, t.src, order++]
      );
    }
    console.log(`Seeded ${content.tracks?.length || 0} tracks`);

    // Photos ------------------------------------------------------------
    order = 0;
    for (const p of content.photos || []) {
      await client.query(`insert into photos (src, alt, sort_order) values ($1,$2,$3)`, [
        p.src,
        p.alt || null,
        order++,
      ]);
    }
    console.log(`Seeded ${content.photos?.length || 0} photos`);
  } finally {
    await client.end();
  }
})().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
