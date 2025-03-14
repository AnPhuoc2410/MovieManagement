import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import React, { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          type: "tween", // Changed from default spring to tween
          ease: "easeInOut",
          duration: 0.3, // Slightly faster
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
