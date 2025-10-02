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

export const staggerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.5
        }
    }
}

export const cardVariants = {
    hidden: {
        x: "50vw",    // start at bottom middle horizontally
        y: "100vh",   // start below the screen
        opacity: 0
    },
    visible: {
        x: 0,         // final position is its grid cell
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
        }
    }
}
