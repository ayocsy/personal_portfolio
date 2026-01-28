"use client";
import {useEffect, useState} from "react";

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
};

function Header(props: HeaderProps) {
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
            { label: "Copy",  onSelect: () => document.execCommand?.("copy") }, 
            { label: "Paste", onSelect: () => console.log("Paste (later)") },],
        "Special": [
            { label: "LinkedIn", onSelect: () => props.onOpenLink?.("https://www.linkedin.com/in/sheung-yan-chiang") },
            { label: "GitHub",   onSelect: () => props.onOpenLink?.("https://github.com/ayocsy") },
            { label: "Instagram",onSelect: () => props.onOpenLink?.("https://www.instagram.com/ayoclimb/") },
            { label: "Spotify",  onSelect: () => props.onOpenLink?.("https://open.spotify.com/user/31ox5zpqr5jsqbp3n2risoqgukce")} ],
    };

    const activeMenu: Record<string, boolean> = 
    {"": false, "File": false, "Edit": false, "Special": false};
    const Menu = ["", "File", "Edit", "Special"];
    const [currentActiveMenu, setCurrentActiveMenu] = useState(activeMenu);

    // Handle Menu Click
    function handleMenuClick(element: string) { 
        if (!(element in currentActiveMenu)) {
            return;
        }
        if (currentActiveMenu[element]) {
            // if the clicked menu is already active, close it
            setCurrentActiveMenu({...activeMenu});
        } else {
            const newActiveMenu: Record<string, boolean> = {...activeMenu};
            newActiveMenu[element] = true;
            setCurrentActiveMenu(newActiveMenu);
        }
    }

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
            <div className="menu-bar">
                <div className="menu-left">
                </div>
            </div>
        );
    }

    return (
    <div className="menu-bar">
        {/* Menu items */}
        <div className="menu-left"> 
            {Menu.map((item, index)=> (
                <div key={item} className="dropdown">
                    <button onClick={() => handleMenuClick(item)} 
                    className="menu-button" key={index}>{item}
                    </button>
                    {currentActiveMenu[item] && (
                        <div className="dropdown-menu">
                            {Menuitems[item].map((subitem, subindex) => (
                                <button className="dropdown-button" key={subindex}
                                onClick={() => {
                                    subitem.onSelect();
                                    setCurrentActiveMenu({...activeMenu}); 
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
