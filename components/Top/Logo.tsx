import { motion } from "framer-motion";

import { cn } from "lib/cn";

const movingSection = {
  base: {
    marginLeft: "-86.5px",
    transition: {
      duration: 0.1,
      delay: 0.1,
    },
  },
  hover: {
    marginLeft: "0px",
    transition: {
      duration: 0.1,
    },
  },
};

const invisibleSection = {
  base: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.1,
      delay: 0.1,
    },
  },
};

export default function Logo() {
  return (
    <motion.div
      initial="base"
      whileHover="hover"
      animate="base"
      className={cn(
        "relative text-base font-black",
        "select-none",
        "bg-gradient-to-br from-purple-400 to-violet-500 bg-clip-text text-transparent"
      )}
    >
      <span>sha</span>
      <motion.span variants={movingSection}>
        <motion.span variants={invisibleSection} className="text-white/70">
          re some co
        </motion.span>
        de.
      </motion.span>
    </motion.div>
  );
}
