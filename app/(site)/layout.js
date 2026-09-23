import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import SocialFloat from "@/components/SocialFloat";
import Footer from "@/components/Footer";

// The public site's chrome — everything under app/(site)/ gets this, /backoffice does not.
export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <SocialFloat />
    </>
  );
}
