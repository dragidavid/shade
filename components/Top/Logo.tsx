import { motion } from "framer-motion";

const movingSection = {
  base: {
    marginLeft: "-79px",
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
      className="relative select-none bg-gradient-to-br from-fuchsia-500 to-indigo-600 bg-clip-text font-black text-transparent"
    >
      <span>sha</span>
      <motion.span variants={movingSection}>
        <motion.span variants={invisibleSection} className=" text-white/60">
          re your co
        </motion.span>
        de.
      </motion.span>
    </motion.div>
  );
}
