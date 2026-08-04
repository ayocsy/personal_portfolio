"use client";
import {useEffect, useRef, useState} from "react";

type MenuItem = {
    label: string;
    onSelect: () => void;
    // disabled?: boolean;
};

type HeaderProps = {
    onOpenWindow?: (window: string) => void;
    onRestart?: () => void;
    onCloseActiveWindow?: () => void;
    onOpenLink?: (url: string) => void;
    loading?: boolean;
    desktopSize: {width : number, height : number};
    showHidden?: () => void;
    crtEnabled?: boolean;
    musicEnabled?: boolean;
    videoEnabled?: boolean;
    onToggleCrt?: () => void;
    onToggleMusic?: () => void;
    onToggleVideo?: () => void;
};

const closedMenu: Record<string, boolean> = 
{"": false, "File": false, "Edit": false, "Special": false};

function Header(props: HeaderProps) {
    const menuBarRef = useRef<HTMLDivElement>(null);
    // State variable to track if the menu button is clicked
    const [time, setTime] = useState(""); // State variable to hold the current time

    // Define menu items and their active states
    const Menuitems: Record<string, MenuItem[]> = {
        "": [
            { label: "About Me", onSelect: () => props.onOpenWindow?.("about") },
            { label: "System",  onSelect: () => props.onOpenWindow?.("system") },
            { label: "Restart", onSelect: () => props.onRestart?.() },],
        "File": [
            { label: "Show Hidden File",  onSelect: () => props.showHidden?.() }
        ],
        "Edit": [
            { label: `CRT Effect: ${props.crtEnabled === false ? "Off" : "On"}`, onSelect: () => props.onToggleCrt?.() },
            { label: `Music: ${props.musicEnabled === false ? "Off" : "On"}`, onSelect: () => props.onToggleMusic?.() },
            { label: `Video: ${props.videoEnabled === false ? "Off" : "On"}`, onSelect: () => props.onToggleVideo?.() },],
        "Special": [
            { label: "Message Me", onSelect: () => props.onOpenWindow?.("contact") },
            { label: "LinkedIn", onSelect: () => props.onOpenLink?.("https://www.linkedin.com/in/sheung-yan-chiang") },
            { label: "GitHub",   onSelect: () => props.onOpenLink?.("https://github.com/ayocsy") },
            { label: "Instagram",onSelect: () => props.onOpenLink?.("https://www.instagram.com/ayoclimb/") },
            { label: "Spotify",  onSelect: () => props.onOpenLink?.("https://open.spotify.com/user/31ox5zpqr5jsqbp3n2risoqgukce")} ],
    };

    const Menu = ["", "File", "Edit", "Special"];
    const [currentActiveMenu, setCurrentActiveMenu] = useState(closedMenu);

    // Handle Menu Click
    function handleMenuClick(element: string) { 
        console.log(`Clicked ${element} menu`);
        if (!(element in currentActiveMenu)) { 
            return;
        }
        if (currentActiveMenu[element]) {
            // if the clicked menu is already active, close it
            setCurrentActiveMenu({...closedMenu});
        } else {
            // console.log(`Opening ${element} menu`);
            const newActiveMenu: Record<string, boolean> = {...closedMenu};
            newActiveMenu[element] = true;
            setCurrentActiveMenu(newActiveMenu);
        }
    }

    useEffect(() => {
        function handleOutsideClick(event: PointerEvent) {
            if (!menuBarRef.current?.contains(event.target as Node)) {
                setCurrentActiveMenu({...closedMenu});
            }
        }

        document.addEventListener("pointerdown", handleOutsideClick);
        return () => document.removeEventListener("pointerdown", handleOutsideClick);
    }, []);

    // the timer update function 
    useEffect(() => {
        function updateTime() {
            if (props.desktopSize.width > 550) {
                setTime(new Date().toLocaleString([], {weekday: "short",
                month: "short", day: "numeric", hour: "2-digit",
                minute: "2-digit" }).replace(",",""));
            } else {
                setTime(new Date().toLocaleString([], {hour: "2-digit",
                minute: "2-digit" }).replace(",",""));
            }
        }
        updateTime();
        const interval = setInterval(updateTime, 1000); 
        return () => clearInterval(interval); 
    } , [props.desktopSize.width]);

    if (props.loading) {
        return (
            <div className="menu-bar" ref={menuBarRef}>
                <div className="menu-left">
                </div>
            </div>
        );
    }

    return (
    <div className="menu-bar" ref={menuBarRef}>
        {/* Menu items */}
        <div className="menu-left"> 
            {Menu.map((item, index)=> (
                <div key={item} className="dropdown">
                    <button onClick={() => handleMenuClick(item)} 
                    className="menu-button" key={index}>
                        {item === "" ? (
                            <img className="menu-logo" src="/assets/apple_logo.png" alt="Apple logo" />
                        ) : item}
                    </button>
                    {currentActiveMenu[item] && (
                        <div className="dropdown-menu">
                            {Menuitems[item].map((subitem, subindex) => (
                                <button className="dropdown-button" key={subindex}
                                onClick={() => {
                                    console.log(`Selected ${subitem.label} from ${item}`);
                                    subitem.onSelect();
                                    setCurrentActiveMenu({...closedMenu}); 
                                    // close menu after selection
                                }
                            }>{subitem.label}</button>
                            ))}
                        </div>
                    )}
                </div>
                ))}
        </div>
        {/* time display */}
        <div className="time-display">
            {time}
        </div>
    </div>
  );
}

export default Header;
