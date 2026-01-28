"use client";

import {useEffect, useState} from "react";


type IconProps = {
    // Define any props needed for the Icon component
    name: string;
    type: string;
    onDoubleClick?: () => void;
    x: number;
    y: number;
    label?: string;
};

function Icon({name, type, onDoubleClick, x, y, label}: IconProps) {
    const [isCoarsePointer, setIsCoarsePointer] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const media = window.matchMedia("(pointer: coarse)");
        const update = () => setIsCoarsePointer(media.matches);
        update();
        if (media.addEventListener) {
            media.addEventListener("change", update);
            return () => media.removeEventListener("change", update);
        }
        media.addListener(update);
        return () => media.removeListener(update);
    }, []);

    const styles = x !== 0 && y !== 0 
    ? { top: `${y}%`, left: `${x}%`, position: "absolute" as const }
    : {};

    return (
        <div
            className="icon-wrapper"
            style={styles}
            onDoubleClick={onDoubleClick}
            onClick={() => {
                if (isCoarsePointer) {
                    onDoubleClick?.();
                }
            }}
        >
            <div className={type}></div>
            {type === "text-icon" && (
                <div className="icon-label">{label ?? `${name}.txt`}</div>
            )}
            {type !== "text-icon" && (
                <div className="icon-label">{label ?? name}</div>
            ) }
            
        </div>

    );
}


export default Icon;
