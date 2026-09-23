const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { createClient } = require("@supabase/supabase-js");

(async () => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const buckets = [
    { id: "photos", public: true, fileSizeLimit: "15MB" },
    { id: "music", public: true, fileSizeLimit: "50MB" },
  ];

  for (const b of buckets) {
    const { error } = await supabase.storage.createBucket(b.id, {
      public: b.public,
      fileSizeLimit: b.fileSizeLimit,
    });
    if (error && !/already exists/i.test(error.message)) {
      console.error(`Failed to create bucket "${b.id}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`Bucket "${b.id}" ready${error ? " (already existed)" : ""}`);
    }
  }
})();
