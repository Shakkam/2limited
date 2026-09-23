const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { createClient } = require("@supabase/supabase-js");

const EMAILS = ["camille.schoell@gmail.com", "renaudie.stephane@gmail.com"];
const REDIRECT_TO = "https://2limited.fr/backoffice/set-password";

(async () => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const email of EMAILS) {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: REDIRECT_TO,
    });
    if (error) {
      console.error(`Failed to invite ${email}:`, error.message);
    } else {
      console.log(`Invited ${email} (user id: ${data.user.id})`);
    }
  }
})();
