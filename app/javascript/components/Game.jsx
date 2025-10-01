import React from "react";
import { useState } from "react";
import { FaHouse } from "react-icons/fa6";


export default function Game({ page, setPage}) {
    const [ score, setScore ] = useState(2500);

    return(
        <div>
            <div className="grid grid-col-3">
                <p className="text-3xl text-white font-bold">Score {score}</p>
                <FaHouse className="text-yellow-500 text-3xl cursor-pointer" onClick={() => setPage("home")}/>
            </div>
        </div>
    )
}