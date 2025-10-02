import React, { useState, useEffect } from "react";
import { FaHouse } from "react-icons/fa6";
import axios from "axios";
import { motion } from "framer-motion";
import { yVariants, staggerVariants } from "./Variants";

export default function Game({ setPage }) {
    const [ loading, setLoading ] = useState(true)
    const [ playing, setPlaying ] = useState(false)
    const [ score, setScore ] = useState(2500);
    const [ bet, setBet ] = useState(null);
    const [ cards, setCards ] = useState([])

    useEffect(() => {
        const timer = setTimeout(() => {
            axios.get("/api/cards/get_cards")
            .then(( response ) => {
                console.log(response.data)
                setCards(response.data)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
        }, 1000);

        return () => clearTimeout(timer);
    }, [])

    const handleBetChange = (e) => {
        const { value } = e.target
        let intValue = parseInt(value)

        if ( intValue > score)
            intValue = score
        
        setBet(intValue)
    }

    return(
        <div>
            <div className="grid grid-col-3 justify-between items-center">
                <p className="text-3xl text-white font-bold">Score {score}</p>
                <FaHouse className="text-yellow-500 text-3xl cursor-pointer" onClick={() => setPage("home")}/>
            </div>
            <div className="text-center mt-10 text-6xl text-white">
                { loading ? (
                    <p>Shuffling Decks...</p>
                ) : !loading && !playing ? (
                    <motion.div
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                    >                    
                        <motion.div variants={yVariants}>                            
                            <p>Place Your Bets!</p>
                        </motion.div>
                        <motion.div variants={yVariants}
                                    className="text-center mt-10 text-3xl text-white"
                        >
                            <input  id='bet' 
                                    type="number"
                                    value={bet}
                                    max={score}
                                    min={0}
                                    placeholder={`Enter Bet`}
                                    onChange={handleBetChange}
                            />
                        </motion.div>
                        <motion.div variants={yVariants} 
                                    whileHover={{ scale: [1, 1.05, 1] }}
                                    transition={{
                                        duration: 0.7,
                                        repeat: Infinity,
                                    }}
                                    whileTap={{ scale: 0.9 }}>
                            <button className="text-xl p-3 rounded-full border-red-500 border-2 cursor-pointer" onClick={() => {setPlaying(true)}}>
                                Deal
                            </button>
                        </motion.div>
                    </motion.div>
                ) : !loading && playing ? (
                    <motion.div variants={staggerVariants} initial="hidden" animate="visible">
                        <motion.p variants={yVariants}>Dealing Cards</motion.p>
                        <img src={cards[0].image_url} alt={cards[0].name}></img>
                    </motion.div>
                ) : false}
            </div>
            
        </div>
    )
}