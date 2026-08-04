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
    layout?: "absolute" | "grid";
};

function Icon({name, type, onDoubleClick, x, y, label, layout = "absolute"}: IconProps) {
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

    const styles = layout === "grid"
        ? {
            position: "relative" as const,
            top: "auto",
            left: "auto",
            width: "100%",
        }
        : x !== 0 && y !== 0
            ? {top: `${y}%`, left: `${x}%`, position: "absolute" as const}
            : {};
    const iconStyles = type === "message-icon"
        ? {
            width: "42px",
            height: "42px",
            marginBottom: "3px",
            backgroundImage: "url('/assets/message-mac-transparent.png')",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
        }
        : undefined;

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
            <div className={type} style={iconStyles}></div>
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
