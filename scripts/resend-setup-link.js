// Sends a "reset password" email to an already-existing (but not yet
// confirmed) backoffice account — used instead of inviteUserByEmail, which
// refuses to re-send once the account exists. Lands on the same
// /backoffice/set-password page as the original invite.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { createClient } = require("@supabase/supabase-js");

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/resend-setup-link.js <email>");
  process.exit(1);
}

const REDIRECT_TO = "https://2limited.fr/backoffice/set-password";

(async () => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: REDIRECT_TO });
  if (error) {
    console.error(`Failed to send to ${email}:`, error.message);
    process.exit(1);
  }
  console.log(`Sent to ${email}`);
})();
