import React from "react";
import { FaHouse } from "react-icons/fa6";


export default function Settings({ setPage }) {
    return(
        <div>
            <FaHouse className="text-yellow-500 text-3xl cursor-pointer" onClick={() => setPage("home")}/>
        </div>
    )
}