import React, { useState, useEffect } from "react";
import { FaHouse } from "react-icons/fa6";
import axios from "axios";
import { motion } from "framer-motion";
import { yVariants, staggerVariants, cardVariants } from "./Variants";

export default function Game({ setPage }) {
    const [ loading, setLoading ] = useState(true)
    const [ playing, setPlaying ] = useState(false)
    const [ score, setScore ] = useState(2500);
    const [ bet, setBet ] = useState("");
    const [ cards, setCards ] = useState([])

    const [player, setPlayer] = useState("")
    const [dealer, setDealer] = useState("")

    const [player_cards, setPlayerCards] = useState([])
    const [dealer_cards, setDealerCards] = useState([])

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

    useEffect(() => {
        console.log(player, dealer, cards, playing);
    }, [player]);

    const handleBetChange = (e) => {
        const { value } = e.target
        let intValue = parseInt(value)

        if ( intValue > score)
            intValue = score
        
        setBet(intValue)
    }

    const getCardValue = (rank) => {
        switch (rank) {
            case "ace":
                return 11;
            case "jack":
            case "queen":
            case "king":
                return 10;
            default:
                return parseInt(rank);
        }
    }

    const dealCards = () => {
        setPlaying(true)

        const newPlayerCards = cards.slice(0, 2);
        const newDealerCards = cards.slice(2, 4);
        setPlayerCards(newPlayerCards);
        setDealerCards(newDealerCards);

        const remainingCards = cards.slice(4);
        setCards(remainingCards);

        setPlayer(newPlayerCards.map(card => getCardValue(card.rank)));
        setDealer(newDealerCards.map(card => getCardValue(card.rank)));
    }

    const hit = () => {
        const newPlayerCards = player_cards.concat(cards.slice(0,1));
        const newDealerCards = dealer_cards.concat(cards.slice(1,2));
        console.log(newPlayerCards, newDealerCards)
        setPlayerCards(newPlayerCards);
        setDealerCards(newDealerCards);

        const remainingCards = cards.slice(2);
        setCards(remainingCards);

        setPlayer(newPlayerCards.map(card => getCardValue(card.rank)));
        setDealer(newDealerCards.map(card => getCardValue(card.rank))); 
    }

    const stand = () => {
        
    }


    return(
        <div>
            <div className="grid grid-cols-3 items-center justify-items-center">
                <p className="text-3xl text-white font-bold">Score {score}</p>
                {bet > 0 && playing ? <p className="text-3xl text-white font-bold">Bet {bet}</p> : <p></p>}
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
                                    whileTap={{ scale: 0.9 }}>
                            <motion.button  whileHover={{ scale: [1, 1.05, 1] }}
                                            transition={{
                                                duration: 0.7,
                                                repeat: Infinity,
                                            }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-xl p-3 rounded-full border-red-500 border-2 cursor-pointer" onClick={dealCards}>
                                Deal
                            </motion.button>
                        </motion.div>
                    </motion.div>
                ) : !loading && playing ? (
                    <React.Fragment>
                        <motion.div variants={staggerVariants} initial="hidden" animate="visible" className="flex justify-between items-start w-full">
                            {/* Player */}
                            <div className="flex flex-wrap gap-2 max-w-[48%]">
                                {player_cards.map((card, index) => (
                                    <motion.img variants={cardVariants} className="card-image" src={card.image_url} alt={card.name} key={index}></motion.img>
                                ))}
                            </div>
                            {/* Dealer */}
                            <div className="flex flex-wrap gap-2 max-w-[48%]">
                                {dealer_cards.map((card, index) => (
                                    <motion.img variants={cardVariants} className="card-image" src={index == 0 ? card.image_url : "/cards/back.png"} alt={card.name} key={index}></motion.img>
                                ))}
                            </div>
                        </motion.div>
                        <motion.button  whileHover={{ scale: [1, 1.05, 1] }}
                                        transition={{
                                            duration: 0.7,
                                            repeat: Infinity,
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-xl p-3 rounded-full border-red-500 border-2 cursor-pointer" onClick={hit}>
                                            Hit
                        </motion.button>
                        <motion.button  whileHover={{ scale: [1, 1.05, 1] }}
                                        transition={{
                                            duration: 0.7,
                                            repeat: Infinity,
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-xl p-3 rounded-full border-red-500 border-2 cursor-pointer" onClick={stand}>
                                            Stand
                        </motion.button>
                    </React.Fragment>
                ) : false}
            </div>
            
        </div>
    )
}