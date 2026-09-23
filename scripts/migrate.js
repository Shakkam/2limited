// Runs every .sql file in supabase/migrations, in filename order, against
// the Supabase Postgres database. Migrations use `if not exists` / `create
// or replace` so re-running the full set is safe. Requires .env.local (or
// the equivalent Vercel-pulled env vars) to be present — POSTGRES_URL_NON_POOLING.
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

(async () => {
  const dir = path.join(__dirname, "..", "supabase", "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found in", dir);
    return;
  }

  // Supabase's pooled connection string sets sslmode=require, which newer
  // pg versions treat as verify-full and reject the pooler's certificate.
  // Strip it and set ssl manually (encrypted, not strictly verified) instead.
  const base = process.env.POSTGRES_URL_NON_POOLING.split("?")[0];
  const client = new Client({ connectionString: base, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      console.log(`Applying ${file}...`);
      await client.query(sql);
    }
    console.log("All migrations applied successfully.");
  } finally {
    await client.end();
  }
})().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
