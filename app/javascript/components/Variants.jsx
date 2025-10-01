import { easeInOut } from "framer-motion";

export const yVariants ={
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: easeInOut,
    }
  }
}