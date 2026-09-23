import "./globals.css";
import ChunkErrorReload from "@/components/ChunkErrorReload";
import { LanguageProvider } from "@/components/LanguageProvider";

// The true root layout — shared by the public site AND /backoffice, so it
// only carries what both need: the <html>/<body> shell, global styles, and
// providers. Navbar/PageTransition/Footer/SocialFloat live one level down
// in app/(site)/layout.js — /backoffice has its own nav instead (see
// app/backoffice/layout.js) and must NOT inherit the public site's chrome.
export const metadata = {
  title: "2-LIMITED",
  icons: { icon: "/images/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <LanguageProvider>
          <ChunkErrorReload />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
