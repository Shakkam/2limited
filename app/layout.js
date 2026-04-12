import "./globals.css";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import SocialFloat from "@/components/SocialFloat";
import Footer from "@/components/Footer";

export const metadata = {
  title: "2-LIMITED",
  icons: { icon: "/images/logorond.jpeg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <SocialFloat />
      </body>
    </html>
  );
}
