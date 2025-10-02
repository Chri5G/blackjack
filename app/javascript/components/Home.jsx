import React from "react";
import {  IoPlay, IoSettingsSharp } from "react-icons/io5";
import { GiChampions } from "react-icons/gi";
import { motion } from "framer-motion";
import { useState } from "react";
import Settings from "./Settings";
import Game from "./Game";
import { yVariants } from "./Variants";

export default function Home( { top_scores }) {
    const [page, setPage] = useState("home")

    return (
        <motion.div
            key = {page}
            variants={yVariants}
            initial="hidden"
            animate="visible"
        >
            {page === "home" && (
                <React.Fragment>
                    <h1 
                        className="text-9xl text-center font-bold text-yellow-500 uppercase">
                        Blackjack
                    </h1>
                    <div className="flex space-x-48 justify-center grid-cols-2 mt-10">
                        <motion.button 
                            whileHover={{ scale: [1, 1.05, 1] }}
                            transition={{
                                duration: 0.7,
                                repeat: Infinity,
                            }}
                            whileTap={{ scale: 0.9 }}
                            className="flex gap-2 text-3xl text-white border-black border-4 rounded-lg p-2 cursor-pointer"
                            onClick={() => setPage("game")}>
                                <IoPlay className="text-red-500"/> Play
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: [1, 1.05, 1] }}
                            transition={{
                                duration: 0.7,
                                repeat: Infinity,
                            }}
                            whileTap={{ scale: 0.9 }}
                            className="flex gap-2 text-3xl text-white border-black border-4 rounded-lg p-2 cursor-pointer"
                            onClick={() => setPage("settings")}>
                                <IoSettingsSharp className="text-red-500" /> Settings
                        </motion.button>
                    </div>
                    <div className="flex justify-center items-center text-3xl text-white mt-10 gap-2">
                        <GiChampions className="text-yellow-500"/> Top Scores
                    </div>
                    <ol className="flex flex-col items-center mt-4 text-xl text-white gap-5">
                        {top_scores.map((score, index) => (
                            <li key={score.id}>
                                {index+1}. {score.name}: {score.score}
                            </li>
                        ))}
                    </ol>
                </React.Fragment>
            )}
            {page === "settings" && <Settings setPage={setPage}/>}
            {page === "game" && <Game setPage={setPage}/>}
        </motion.div>
    );
}