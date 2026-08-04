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
    zIndex: number;
};

const MUSIC_FADE_DURATION_MS = 2500;
const MUSIC_TARGET_VOLUME = 0.5;

type ExperienceType = "contact" | "about" | "bouldering";

type VideoSource = {
    src: string;
    type: string;
};

const CONTACT_BACKGROUND_VIDEOS: VideoSource[][] = [
    [
        {src: "/video/earth-background.m4v", type: "video/mp4"},
        // {src: "/video/earth.mov", type: "video/quicktime"},
    ],
    [
        {src: "/video/universe-background.m4v", type: "video/mp4"},
        // {src: "/video/universe.mov", type: "video/quicktime"},
    ],
] as const;

const EXPERIENCE_MEDIA: Record<ExperienceType, {
    musicSrc: string;
    musicStartTime: number;
    videoSources?: VideoSource[];
}> = {
    contact: {
        musicSrc: "/assets/music/last-night-on-earth---hq.mp3",
        musicStartTime: 13,
    },
    about: {
        musicSrc: "/assets/music/Daft%20Punk%20-%20Digital%20Love%20(Official%20Audio).mp3",
        musicStartTime: 20,
        videoSources: [
            {src: "/video/bouldering-background.m4v", type: "video/mp4"},
            // {src: "/video/bouldering.mov", type: "video/quicktime"},
        ],
    },
    bouldering: {
        musicSrc: "/assets/music/Wonderwall%20(Remastered).mp3",
        musicStartTime: 19,
        videoSources: [
            {src: "/video/about_me-background.m4v", type: "video/mp4"},
            // {src: "/video/about_me.mov", type: "video/quicktime"},
        ],
    },
};

function isExperienceType(type: string): type is ExperienceType {
    return type === "contact" || type === "about" || type === "bouldering";
}

function pickBackgroundVideoIndex() {
    return Math.random() < 0.5 ? 0 : 1;
}

function getWindowSize(type: string, desktopWidth: number, desktopHeight: number) {
    if (type === "contact") {
        return {
            width: Math.max(260, Math.min(460, desktopWidth - 40)),
            height: Math.max(260, Math.min(330, desktopHeight - 80)),
        };
    }

    const width = Math.max(200, Math.min(320, desktopWidth - 40));
    const height = Math.max(240, Math.min(520, desktopHeight - 80));
    return {width, height};
}

// y => top, x => left

function Desktop({reboot}: DesktopProps) {

    const desktopRef = useRef<HTMLDivElement>(null);
    const messageAudioRef = useRef<HTMLAudioElement>(null);
    const aboutAudioRef = useRef<HTMLAudioElement>(null);
    const boulderingAudioRef = useRef<HTMLAudioElement>(null);
    const audioFadeFrameRef = useRef<number | null>(null);
    const nextWindowZIndexRef = useRef(20);
    

    const [windows, setWindows] = useState<WindowInstance[]>([]);
    const [nextWindowId, setNextWindowId] = useState(1);
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState<string[]>([]);
    const [desktopSize, setDesktopSize] = useState({width: 0, height: 0});
    const [hidden, setHidden] = useState(false);
    const [backgroundVideoIndex, setBackgroundVideoIndex] = useState(0);
    const [crtEnabled, setCrtEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [activeExperience, setActiveExperience] = useState<ExperienceType | null>(null);
    const activeVideoSources = activeExperience === "contact"
        ? CONTACT_BACKGROUND_VIDEOS[backgroundVideoIndex]
        : activeExperience
            ? EXPERIENCE_MEDIA[activeExperience].videoSources ?? []
            : [];

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 2 seconds loading time

        return () => clearTimeout(timer); // cleanup on unmount

    }, []);

    useEffect(() => {
        return () => {
            if (audioFadeFrameRef.current !== null) {
                cancelAnimationFrame(audioFadeFrameRef.current);
            }
        };
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
            const {width, height} = getWindowSize(w.type, desktopSize.width, desktopSize.height);
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

    function openWindow(type: string) {

        const existingWindow = windows.find(window => window.type === type);
        if (existingWindow) {
            bringWindowToFront(existingWindow.id);
            if (isExperienceType(type)) {
                activateExperience(type);
            }
            return;
        }

        if (isExperienceType(type)) {
            activateExperience(type);
        }

        const offsetX1 = windows.length * 20;
        const offsetY1 = windows.length * 20;

        const next = nextWindowId;
        const {width, height} = getWindowSize(type, desktopSize.width, desktopSize.height);
        const maxX = Math.max(8, desktopSize.width - width - 8);
        const maxY = Math.max(8, desktopSize.height - height - 8);
        const isNarrow = desktopSize.width < 520;

        // The base position for the window
        const isContact = type === "contact";
        const baseX = Math.max(8, isContact || isNarrow
            ? (desktopSize.width - width) / 2
            : Math.floor(desktopSize.width * 0.08));
        const baseY = Math.max(8, isContact || isNarrow
            ? (desktopSize.height - height) / 2
            : Math.floor(desktopSize.height * 0.08));
        
        setWindows([...windows, { 
            id: next, 
            type,
            x: Math.min(baseX + (isContact ? 0 : offsetX1), maxX),
            y: Math.min(baseY + (isContact ? 0 : offsetY1), maxY),
            width,
            height,
            zIndex: nextWindowZIndexRef.current++,
        }]);
        setNextWindowId(next => next + 1);
        setOpened([...opened, type]);
    }

    // Function to close a window by id
    function closeWindow(id: number) {
        const targetWindow = windows.find(window => window.id === id);
        if (!targetWindow) return;

        const target = targetWindow.type;
        const remainingWindows = windows.filter(window => window.id !== id);

        if (isExperienceType(target) && activeExperience === target) {
            stopAllExperienceMusic(true);

            const fallbackExperience = remainingWindows
                .filter((window): window is WindowInstance & {type: ExperienceType} => isExperienceType(window.type))
                .sort((a, b) => b.zIndex - a.zIndex)[0];

            if (fallbackExperience) {
                activateExperience(fallbackExperience.type);
            } else {
                setActiveExperience(null);
            }
        }

        setWindows(remainingWindows);
        setOpened(opened.filter(type => type !== target));
    }

    function stopAudioFade() {
        if (audioFadeFrameRef.current !== null) {
            cancelAnimationFrame(audioFadeFrameRef.current);
            audioFadeFrameRef.current = null;
        }
    }

    function getExperienceAudio(type: ExperienceType) {
        if (type === "about") return aboutAudioRef.current;
        if (type === "bouldering") return boulderingAudioRef.current;
        return messageAudioRef.current;
    }

    function getAllExperienceAudio() {
        return [messageAudioRef.current, aboutAudioRef.current, boulderingAudioRef.current];
    }

    function stopAllExperienceMusic(resetToStart: boolean) {
        stopAudioFade();
        getAllExperienceAudio().forEach(audio => {
            if (!audio) return;
            audio.pause();
            audio.volume = 0;

            if (resetToStart && audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
                const experienceType = audio.dataset.experience as ExperienceType;
                audio.currentTime = EXPERIENCE_MEDIA[experienceType].musicStartTime;
            }
        });
    }

    function startExperienceMusic(type: ExperienceType) {
        const audio = getExperienceAudio(type);
        if (!audio) return;

        stopAllExperienceMusic(false);
        audio.currentTime = EXPERIENCE_MEDIA[type].musicStartTime;
        audio.volume = 0;

        void audio.play().then(() => {
            const fadeStartedAt = performance.now();

            const fadeIn = (now: number) => {
                const progress = Math.max(0, Math.min((now - fadeStartedAt) / MUSIC_FADE_DURATION_MS, 1));
                audio.volume = progress * MUSIC_TARGET_VOLUME;

                if (progress < 1) {
                    audioFadeFrameRef.current = requestAnimationFrame(fadeIn);
                } else {
                    audioFadeFrameRef.current = null;
                }
            };

            audioFadeFrameRef.current = requestAnimationFrame(fadeIn);
        }).catch(() => {
            // The visitor's browser may have disabled autoplay audio.
        });
    }

    function activateExperience(type: ExperienceType) {
        if (type === "contact") {
            setBackgroundVideoIndex(pickBackgroundVideoIndex());
        }

        setActiveExperience(type);
        if (musicEnabled) {
            startExperienceMusic(type);
        }
    }

    function toggleMusic() {
        const nextMusicEnabled = !musicEnabled;
        setMusicEnabled(nextMusicEnabled);

        if (!nextMusicEnabled) {
            stopAllExperienceMusic(false);
            return;
        }

        if (activeExperience) {
            startExperienceMusic(activeExperience);
        }
    }

    function bringWindowToFront(id: number) {
        const zIndex = nextWindowZIndexRef.current++;
        setWindows(currentWindows => currentWindows.map(window => (
            window.id === id ? {...window, zIndex} : window
        )));
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
    const iconGridStyle = {
        position: "absolute" as const,
        top: "10%",
        right: "clamp(8px, 3%, 24px)",
        width: "min(340px, calc(100% - 24px))",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(130px, 100%), 1fr))",
        columnGap: "clamp(8px, 2vw, 24px)",
        rowGap: "clamp(8px, 2vh, 20px)",
        zIndex: 2,
        pointerEvents: "none" as const,
    };
    const iconCellStyle = {
        minWidth: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "auto" as const,
    };
    const iconColumnStyle = {
        minWidth: 0,
        display: "grid",
        gridTemplateRows: "repeat(3, minmax(72px, auto))",
        rowGap: "clamp(8px, 2vh, 20px)",
    };

    return ( 
    <div className={`crt${crtEnabled ? "" : " crt-disabled"}`} style={{minHeight: "100vh", isolation: "isolate"}}>
        {activeExperience && videoEnabled && activeVideoSources.length > 0 && (
            <video
                key={`${activeExperience}-${backgroundVideoIndex}`}
                className="experience-background-video"
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                    zIndex: 0,
                    pointerEvents: "none",
                    opacity: 0,
                }}
                onCanPlay={(event) => {
                    const video = event.currentTarget;
                    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

                    if (reduceMotion) {
                        video.style.opacity = "1";
                        return;
                    }

                    video.animate(
                        [{opacity: 0}, {opacity: 1}],
                        {duration: 2500, easing: "ease-out", fill: "forwards"},
                    );
                }}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
            >
                {activeVideoSources.map(source => (
                    <source key={source.src} src={source.src} type={source.type} />
                ))}
            </video>
        )}
    <div className="desktop-wrapper" style={{position: "relative", zIndex: 1}}>
        <div className="Desktop" ref={desktopRef}>
            <audio
                ref={messageAudioRef}
                data-experience="contact"
                src={EXPERIENCE_MEDIA.contact.musicSrc}
                preload="auto"
                hidden
            />
            <audio
                ref={aboutAudioRef}
                data-experience="about"
                src={EXPERIENCE_MEDIA.about.musicSrc}
                preload="auto"
                hidden
            />
            <audio
                ref={boulderingAudioRef}
                data-experience="bouldering"
                src={EXPERIENCE_MEDIA.bouldering.musicSrc}
                preload="auto"
                hidden
            />
            <Header 
                onRestart={reboot}
                onOpenWindow={(window) => openWindow(window)}
                onCloseActiveWindow={() => console.log("Close active window")}
                onOpenLink={(url) => window.open(url, "_blank")}
                loading={false}
                desktopSize={desktopSize}
                showHidden={() => setHidden(c => !c)}
                crtEnabled={crtEnabled}
                musicEnabled={musicEnabled}
                videoEnabled={videoEnabled}
                onToggleCrt={() => setCrtEnabled(enabled => !enabled)}
                onToggleMusic={toggleMusic}
                onToggleVideo={() => setVideoEnabled(enabled => !enabled)}
            /> 
            <div className="desktop-icons-grid" style={iconGridStyle}>
                <div style={{
                    ...iconColumnStyle,
                    gridTemplateRows: hidden
                        ? "repeat(3, minmax(72px, auto))"
                        : "minmax(72px, auto)",
                }}>
                    <div style={{
                        ...iconCellStyle,
                        gridRow: 1,
                        paddingLeft: "clamp(4px, 1vw, 8px)",
                        boxSizing: "border-box",
                    }}>
                        <Icon
                            name="Projects"
                            onDoubleClick={() => openWindow("projects")}
                            type="folder-icon"
                            x={0}
                            y={0}
                            layout="grid"
                        />
                    </div>

                    {hidden && (
                        <div style={{
                            ...iconCellStyle,
                            gridRow: 3,
                        }}>
                            <Icon
                                name="Special_THX"
                                onDoubleClick={() => openWindow("Thank_You")}
                                type="text-icon"
                                x={0}
                                y={0}
                                layout="grid"
                            />
                        </div>
                    )}
                </div>

                <div style={iconColumnStyle}>
                    <div style={{
                        ...iconCellStyle,
                        gridRow: 1,
                    }}>
                        <Icon
                            name="about_me"
                            onDoubleClick={() => openWindow("about")}
                            type="text-icon"
                            x={0}
                            y={0}
                            layout="grid"
                        />
                    </div>
                    <div style={{
                        ...iconCellStyle,
                        gridRow: 2,
                    }}>
                        <Icon
                            name="bouldering"
                            onDoubleClick={() => openWindow("bouldering")}
                            type="text-icon"
                            x={0}
                            y={0}
                            layout="grid"
                        />
                    </div>
                    <div style={{
                        ...iconCellStyle,
                        gridRow: 3,
                    }}>
                        <Icon
                            name="Message_Me"
                            label="Message Me"
                            onDoubleClick={() => openWindow("contact")}
                            type="message-icon"
                            x={0}
                            y={0}
                            layout="grid"
                        />
                    </div>
                </div>
            </div>

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
                zIndex={window.zIndex}
                onDrag={moveWindow}
                onActivate={bringWindowToFront}
                onOpenWindow={(windowType) => openWindow(windowType)}
                />
            ))}

        </div>
    </div>
    </div>);
}


export default Desktop;
