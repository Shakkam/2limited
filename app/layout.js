import "./globals.css";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import SocialFloat from "@/components/SocialFloat";

export const metadata = { title: "2-LIMITED" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <SocialFloat />
      </body>
    </html>
  );
}
