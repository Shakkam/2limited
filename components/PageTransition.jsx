"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // flex-1 (with body as a flex column) instead of min-h-screen: the old
      // 100vh floor was applied *in addition to* the footer that follows it,
      // so every page was at least 100vh + footer tall — a permanent
      // scrollbar, and on pages sized to fit the viewport, a dead band above
      // the footer. flex-1 still fills the viewport on short pages (footer
      // stays at the bottom) but never overshoots it.
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}
