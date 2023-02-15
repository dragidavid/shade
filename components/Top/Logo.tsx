import { motion } from "framer-motion";

const movingSection = {
  base: {
    marginLeft: "-86.5px",
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
  hover: {
    marginLeft: "0px",
    transition: {
      duration: 0.2,
    },
  },
};

const invisibleSection = {
  base: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
};

export default function Logo() {
  return (
    <motion.div
      initial="base"
      whileHover="hover"
      animate="base"
      className="relative select-none bg-gradient-to-br from-purple-400 to-violet-500 bg-clip-text font-black text-transparent"
    >
      <span>sha</span>
      <motion.span variants={movingSection}>
        <motion.span variants={invisibleSection} className="text-white/60">
          re some co
        </motion.span>
        de.
      </motion.span>
    </motion.div>
  );
}
