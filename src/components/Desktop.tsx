"use client";

import {useState, useEffect, useRef} from "react";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Window from "@/components/Window";
import Loading from "./Loading";

type DesktopProps = {
    reboot?: () => void;  
};

type WindowInstance = {
    id: number;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

type IconInstance = {
    name: string;
    onDoubleClick?: () => void;
    type?: string;
};


// y => top, x => left

function Desktop({reboot}: DesktopProps) {

    const desktopRef = useRef<HTMLDivElement>(null);
    

    const [windows, setWindows] = useState<WindowInstance[]>([]);
    const [nextWindowId, setNextWindowId] = useState(1);
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState<String[]>([]);
    const [desktopSize, setDesktopSize] = useState({width: 0, height: 0});
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 2 seconds loading time

        return () => clearTimeout(timer); // cleanup on unmount

    }, []);


    useEffect(() => {
        if (!desktopRef.current) return;

        const updateSize = () => {
            const rect = desktopRef.current!.getBoundingClientRect();
            setDesktopSize({
                width: rect.width,
                height: rect.height,
            });
        };

        updateSize(); // initial measure

        const observer = new ResizeObserver(updateSize);
        observer.observe(desktopRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const desktop = desktopRef.current;
        if (!desktop) return;
        const rect = desktop.getBoundingClientRect();
        setWindows(prev => prev.map(w => {
            const {width, height} = getWindowSize();
            const maxX = rect.width - width - 8;
            const maxY = rect.height - height - 8;
            return {
                ...w,
                width,
                height,
                x: Math.max(8, Math.min(w.x, maxX)),
                y: Math.max(8, Math.min(w.y, maxY)),
            };
        }));
    }, [desktopSize.width, desktopSize.height]);

    // Fake loading screen 
    if (loading) {
        return (
            <div className="crt">
                <div className="desktop-wrapper">
                    <div className="Desktop" ref={desktopRef}>
                        
                        <Header 
                            onRestart={reboot}
                            onOpenWindow={(window) => openWindow(window)}
                            onCloseActiveWindow={() => console.log("Close active window")}
                            onOpenLink={(url) => window.open(url, "_blank")}
                            loading={true} 
                            desktopSize={desktopSize}
                            showHidden={() => setHidden(c => !c)}
                        />
                        <Loading />
                    </div>
                </div>
            </div>
        );
    }

    // Function to open a new window
    function getWindowSize() {
        const width = Math.max(200, Math.min(320, desktopSize.width - 40));
        const height = Math.max(240, Math.min(520, desktopSize.height - 80));
        return {width, height};
    }

    function openWindow(type: string) {

        if (opened.includes(type)) {
            return;
        }
        var offsetX1 = windows.length * 20;
        var offsetY1 = windows.length * 20;

        const next = nextWindowId;
        const {width, height} = getWindowSize();
        const maxX = Math.max(8, desktopSize.width - width - 8);
        const maxY = Math.max(8, desktopSize.height - height - 8);
        const isNarrow = desktopSize.width < 520;

        // The base position for the window
        const baseX = Math.max(8, isNarrow ? (desktopSize.width - width) / 2 : Math.floor(desktopSize.width * 0.08));
        const baseY = Math.max(8, isNarrow ? (desktopSize.height - height) / 2 : Math.floor(desktopSize.height * 0.08));
        
        setWindows([...windows, { 
            id: next, 
            type,
            x: Math.min(baseX + offsetX1, maxX),
            y: Math.min(baseY + offsetY1, maxY),
            width,
            height,
        }]);
        setNextWindowId(next => next + 1);
        setOpened([...opened, type]);
    }

    // Function to close a window by id
    function closeWindow(id: number) {
        const ok = windows.filter(window => window.id === id);
        const target = ok[0].type;
        setWindows(windows.filter(window => window.id !== id));
        setOpened(opened.filter(type => type !== target));
    }


    function moveWindow(id: number, x: number, y: number) {
        const desktop = desktopRef.current;
        if (!desktop) return;

        const rect = desktop.getBoundingClientRect();

        setWindows(prev =>
            prev.map(w => {
                if (w.id !== id) return w;
                const maxX = rect.width - w.width - 8;
                const maxY = rect.height - w.height - 8;
                return {
                    ...w,
                    x: Math.max(8, Math.min(x, maxX)),
                    y: Math.max(8, Math.min(y, maxY)),
                };
            })
        );
    }
    let docX = 80;
    let diff = 15;
    if (desktopSize.width < 580) {
        docX = 70;
        diff = 25;
    }
    return ( 
    <div className="crt">
    <div className = "desktop-wrapper">
        <div className="Desktop" ref={desktopRef}> 
            <Header 
                onRestart={reboot}
                onOpenWindow={(window) => openWindow(window)}
                onCloseActiveWindow={() => console.log("Close active window")}
                onOpenLink={(url) => window.open(url, "_blank")}
                loading={false}
                desktopSize={desktopSize}
                showHidden={() => setHidden(c => !c)}
            /> 
            <Icon 
                name="about_me" 
                onDoubleClick={() => openWindow("about")}
                type="text-icon"
                x={docX}
                y={10}  
            />
            <Icon
                name="bouldering"
                onDoubleClick={() => openWindow("bouldering")}
                type="text-icon"
                x={docX}
                y={25}
            />
            <Icon
                name="Projects"
                onDoubleClick={() => openWindow("projects")}
                type="folder-icon"
                x={docX - diff}
                y={10}
            />

            {hidden && <Icon
                name="Special_THX"
                onDoubleClick={() => openWindow("Thank_You")}
                type="text-icon"
                x={docX - diff}
                y={50}
            />
            }

            
            {windows.map((window) => (
                <Window
                key={window.id} 
                windowId={window.id} 
                windowType={window.type} 
                windowClose={() => closeWindow(window.id)}
                x={window.x}
                y={window.y}
                width={window.width}
                height={window.height}
                onDrag={moveWindow}
                onOpenWindow={(windowType) => openWindow(windowType)}
                />
            ))}

        </div>
    </div>
    </div>);
}


export default Desktop;
