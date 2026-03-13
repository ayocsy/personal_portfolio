"use client";

import { useState, useEffect } from "react";

const bootLines = [
  "GASTER OS",
  "Version 1.0",
  "Copyright (c) 1984 Gaster Chiang",
  "All Rights Reserved",
  "",
  "Battery Pack: 98% ........... OK",
  "Memory Test: 2048MB ......... OK",
  "CPU Check: Stable ........... OK",
  "",
  "“Given enough eyeballs, all bugs are shallow.”",
  "-- Linus Torvalds",
  "",
  ""
];

type BootscreenProps = {
  onFinish?: () => void;
};


function Bootscreen({ onFinish }: BootscreenProps) {

    const [visbleCount, setvisbleCount] = useState(0);
    const [done, setdone] = useState(false);
    const [visblelast, setvisblelast] = useState(true);

    // reveal the boot lines one by one
    useEffect(() => {
        if (visbleCount >= bootLines.length) {
            // Stop the interval when all lines are visible
            setdone(true);
            return;
        }

        const timerid = setInterval(() => {
            setvisbleCount((c) => c + 1);
        }, 150); // 350ms is preferred speed
        return () => clearInterval(timerid); // cleanup on unmount or visbleCount change
    }, [visbleCount]); // run when visbleCount changes

    // handle key press to finish bootscreen
    useEffect(() => {

        if (!done) return;

        const handleContinue = () => {
            onFinish?.();
        };

        window.addEventListener("keydown", handleContinue);
        window.addEventListener("click", handleContinue);

        return () => {
            window.removeEventListener("keydown", handleContinue);
            window.removeEventListener("click", handleContinue);
        };
    }, [done, onFinish]);
    

    useEffect(() => {
        const timer = setTimeout(() => 
            {setvisblelast(prev => prev = !prev)}
        , 700);

        return () => clearTimeout(timer);
    }) 

    return (
    <div className="crt">
        <div className="boot-wrapper">
            <div className="Bootscreen">
                {bootLines.slice(0, visbleCount).map((line, i) => (
                    <p key={i}>{line || "\u00A0"}</p>
                ))}
                {done && visblelast && <p>Press any key to boot system.</p>}
            </div>
        </div>
    </div>
  );
}

export default Bootscreen

