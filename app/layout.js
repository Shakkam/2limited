import "./globals.css";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import SocialFloat from "@/components/SocialFloat";
import Footer from "@/components/Footer";
import ChunkErrorReload from "@/components/ChunkErrorReload";
import { LanguageProvider } from "@/components/LanguageProvider";

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
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <SocialFloat />
        </LanguageProvider>
      </body>
    </html>
  );
}
