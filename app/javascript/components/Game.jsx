import React, { useState, useEffect, use } from "react";
import { FaHouse } from "react-icons/fa6";
import axios from "axios";
import { motion } from "framer-motion";
import { yVariants, staggerVariants, cardVariants } from "./Variants";

export default function Game({ authToken, setPage }) {
    const [ loading, setLoading ] = useState(true)
    const [ name, setName ] = useState("");
    const [ nameEntered, setNameEntered ] = useState(false);
    const [ playing, setPlaying ] = useState(false)

    const [ score, setScore ] = useState(2500);
    const [scoreId, setScoreId] = useState(null)

    const [ bet, setBet ] = useState("");
    const [ double, setDouble ] = useState(false);
    const [ stand, setStand ] = useState(false);

    const [ cards, setCards ] = useState([]);

    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);

    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    // Get Cards
    useEffect(() => {
        setStand(false)

        const timer = setTimeout(() => {
            axios.get("/api/cards/get_cards")
            .then(( response ) => {
                setCards(response.data)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
        }, 1000);

        return () => clearTimeout(timer);
    }, [])

    // Game Over
    useEffect(() => {
        if(score <= 0){
            alert("Game Over!")
            setPage("home")
        }
    }, [score])


    // Save Score
    useEffect(() => {
        if ( [0,2500].includes(score) ) return;
        if( scoreId == null ){
            axios.post("/api/scores",
                { score: { name, score } },
                { headers: { "X-CSRF-Token": authToken }
            }).then(( response ) => {
                console.log(response.data)
                setScoreId(response.data.score.id)
            })
            .catch((error) => {
                console.log(error)
            })
        } else {
            axios.patch(`/api/scores/${scoreId}`,
                { score: { name, score } },
                { headers: { "X-CSRF-Token": authToken },
            }).then(( response ) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [ score, playing ] )
        

    // Player Score Check
    useEffect(() => {
        const timer = setTimeout(() => {
            if ( playerScore > 21 ) {
                const newScore = score - bet
                if (newScore <= 0){
                    alert("Game Over!")
                    setPage("home")
                } else {
                    alert("You Bust! You Lose")
                    setScore(newScore)
                    setBet("")
                    setPlaying(false)
                }
            } else if ( playerScore === 21 ) {
                alert("Blackjack!")
                setStand(true)
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [playerScore])

    // Dealer Score Check
    useEffect(() => {
        if (stand && playing) {
            if (dealerScore < 21 && dealerScore < playerScore) {
                setTimeout(() => {
                    handleHit('Dealer')
                }, 2000)
            } else {
                setTimeout(() => {
                    if (dealerScore > 21 || dealerScore < playerScore) {
                        alert("Dealer Bust! You Win")
                        setScore(prev => prev + bet)
                    } else if (dealerScore === playerScore) {
                        alert("Push!")
                    } else if (dealerScore === 21){
                        alert("Dealer BlackJack!")
                        setScore(prev => prev - bet)
                        setBet("")
                    } else {
                        alert("Dealer Wins!")
                        setScore(prev => prev - bet)
                        setBet("")
                    }
                    setPlaying(false)
                    setStand(false)
                }, 1000)
            }
        }
    }, [dealerScore, stand]);

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
        if(bet == "" || bet < 0){
            alert("Please Enter a Bet")
            return
        }

        setPlaying(true)

        const newPlayerCards = cards.slice(0, 2);
        const newDealerCards = cards.slice(2, 4);
        setPlayerCards(newPlayerCards);
        setDealerCards(newDealerCards);

        const remainingCards = cards.slice(4);
        setCards(remainingCards);

        const player_values = newPlayerCards.map(card => getCardValue(card.rank))
        const dealer_values = newDealerCards.map(card => getCardValue(card.rank))
        setPlayerScore(calcTotal(player_values, "Player"))
        setDealerScore(calcTotal(dealer_values, "Dealer"))
    }

    const calcTotal = ( cards, who ) => {
        let total = cards.reduce((a, b ) => a + b, 0)
        let aces = cards.filter(v => v === 11).length
        let temp_cards = [...cards]
        while (total > 21 && aces > 0){
            temp_cards[(temp_cards.indexOf(11))] = 1
            total -= 10
            aces--
        }
        return total
    }

    const handleHit = (who) => {
        console.log("Hitting " + who)
        let newCards, arr
        // Deal card to hitter
        if (who === "Player"){
            newCards = playerCards.concat(cards.slice(0,1));
            setPlayerCards(newCards);
            arr = newCards.map(card => getCardValue(card.rank))
            setPlayerScore(calcTotal(arr, who))
        }
        else {
            newCards = dealerCards.concat(cards.slice(0,1));
            setDealerCards(newCards);
            arr = newCards.map(card => getCardValue(card.rank))
            setDealerScore(calcTotal(arr, who))
        }

        // Remove card from deck
        setCards(prev => prev.slice(1))
    }

    const handleStand = () => {
        console.log("User Stands")
        setStand(true)
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
                ) : !nameEntered ? (
                    <motion.div
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                    >                    
                        <motion.div variants={yVariants}>                            
                            <p>Enter Your Name!</p>
                        </motion.div>
                        <motion.div variants={yVariants}
                                    className="text-center mt-10 text-3xl text-white"
                        >
                            <input  id='name' 
                                    type="text"
                                    value={name}
                                    placeholder={`Enter Name`}
                                    onChange={(e) => setName(e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={yVariants} >
                            <motion.button  whileHover={{ scale: [1, 1.05, 1] }}
                                            transition={{
                                                duration: 0.7,
                                                repeat: Infinity,
                                            }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-xl p-3 rounded-full border-red-500 border-2 cursor-pointer" onClick={() => setNameEntered(true)}>
                                Submit
                            </motion.button>
                        </motion.div>
                    </motion.div>
                ) : !playing ? (
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
                        <motion.div variants={yVariants} >
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
                ) : playing ? (
                    <React.Fragment>
                        <motion.div variants={staggerVariants} initial="hidden" animate="visible" className="flex justify-between items-start w-full">
                            {/* Player */}
                            <div className="flex flex-wrap gap-2 max-w-[48%]">
                                <span className="mb-2 w-full">{playerScore}</span>
                                {playerCards.map((card, index) => (
                                    <motion.img variants={cardVariants} className="card-image" src={card.image_url} alt={card.name} key={index}></motion.img>
                                ))}
                            </div>
                            {/* Dealer */}
                            <div className="flex flex-wrap gap-2 max-w-[48%]">
                                {stand ? <span className="mb-2 w-full">{dealerScore}</span> : <span className="mb-[67px] w-full"></span>}
                                {dealerCards.map((card, index) => (
                                    <motion.img variants={cardVariants} className="card-image" src={index != 0 || stand ? card.image_url : "/cards/back.png"} alt={card.name} key={index}></motion.img>
                                ))}
                            </div>
                        </motion.div>
                        <motion.button  {...(!stand && {
                                            whileHover: { scale: [1, 1.05, 1] },
                                            whileTap: { scale: 0.9 },
                                            transition: { duration: 0.7, repeat: Infinity }
                                        })}
                                        className="text-xl p-3 rounded-full border-red-500 border-2 cursor-pointer mr-4" 
                                        onClick={() => handleHit("Player")}
                                        disabled={stand && playerScore <= 21}>
                                            Hit
                        </motion.button>
                        <motion.button  {...(!stand && {
                                            whileHover: { scale: [1, 1.05, 1] },
                                            whileTap: { scale: 0.9 },
                                            transition: { duration: 0.7, repeat: Infinity }
                                        })}
                                        whileTap={!stand ? { scale: 0.9 } : {}}
                                        className="text-xl p-3 rounded-full border-red-500 border-2 cursor-pointer ml-4" 
                                        onClick={handleStand}
                                        disabled={stand && playerScore <= 21}>
                                            Stand
                        </motion.button>
                    </React.Fragment>
                ) : false}
            </div>
            
        </div>
    )
}