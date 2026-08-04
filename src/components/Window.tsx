"use client";
import { useEffect, useRef, useState } from "react";
import { WINDOW_CONTENT, WindowBodyItem } from '@/data/windows';
import FolderView from "@/components/FolderView";
import ContactForm from "@/components/ContactForm";

type WindowProps = {
    // Define any props needed for the Window component
    windowType?: string;
    windowId?: number;
    windowClose?: (windowId: number) => void;
    x: number;
    y: number;
    onDrag: (id: number, x: number, y: number) => void;
    onOpenWindow?: (windowType: string) => void;
    width?: number;
    height?: number;
    zIndex?: number;
    onActivate?: (windowId: number) => void;
};

function Window({windowType, windowId, windowClose, x, y, onDrag, onOpenWindow, width, height, zIndex, onActivate}: WindowProps) {
    // console.log("Window props:", {windowType});
    const contentRef = useRef<HTMLDivElement>(null);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [scrollThumb, setScrollThumb] = useState({top: 16, height: 28});
    const windowConfig = windowType ? WINDOW_CONTENT[windowType] : undefined;

    useEffect(() => {
        const contentElement = contentRef.current;
        if (!contentElement) return;
        const observedContent: HTMLDivElement = contentElement;

        function updateOverflow() {
            const canScroll = observedContent.scrollHeight > observedContent.clientHeight;
            setHasOverflow(canScroll);

            if (!canScroll) {
                setScrollThumb({top: 16, height: 28});
                return;
            }

            const buttonSpace = 32;
            const trackHeight = Math.max(28, observedContent.clientHeight - buttonSpace);
            const thumbHeight = Math.max(28, Math.round((observedContent.clientHeight / observedContent.scrollHeight) * trackHeight));
            const scrollRange = observedContent.scrollHeight - observedContent.clientHeight;
            const thumbRange = Math.max(0, trackHeight - thumbHeight);
            const thumbTop = 16 + Math.round((observedContent.scrollTop / scrollRange) * thumbRange);

            setScrollThumb({top: thumbTop, height: thumbHeight});
        }

        updateOverflow();
        const observer = new ResizeObserver(updateOverflow);
        observer.observe(observedContent);
        if (observedContent.firstElementChild) {
            observer.observe(observedContent.firstElementChild);
        }

        window.addEventListener("resize", updateOverflow);
        observedContent.addEventListener("scroll", updateOverflow);
        return () => {
            observer.disconnect();
            observedContent.removeEventListener("scroll", updateOverflow);
            window.removeEventListener("resize", updateOverflow);
        };
    }, [windowType, width, height, windowConfig]);

    function renderInline(text: string, keyPrefix: string) {
        const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).filter(Boolean);
        return parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                const inner = part.slice(2, -2);
                const underlineMatch = inner.match(/^__([^_]+)__$/);
                if (underlineMatch) {
                    // Underline
                    return (
                        <span className="window-bold-underline" key={`${keyPrefix}-bu-${idx}`}>
                            {underlineMatch[1]}
                        </span>
                    );
                }
                return (
                    // Bold
                    <span className="window-bold" key={`${keyPrefix}-b-${idx}`}> 
                        {renderInline(inner, `${keyPrefix}-b-${idx}`)}
                    </span>
                );
            }
            if (part.startsWith("__") && part.endsWith("__")) {
                const inner = part.slice(2, -2);
                return (
                    <span className="window-underline" key={`${keyPrefix}-u-${idx}`}>
                        {inner}
                    </span>
                );
            }
            return <span key={`${keyPrefix}-t-${idx}`}>{part}</span>;
        });
    }

    function renderTextItem(text: string, index: number) {
        // Make wording style
        const trimmed = text.trim();
        if (trimmed.length === 0) {
            return <div className="window-spacer" key={`spacer-${index}`} />;
        }
        if (trimmed.startsWith("### ")) {
            return <div className="window-h3" key={`h3-${index}`}>{renderInline(trimmed.slice(4), `h3-${index}`)}</div>;
        }
        if (trimmed.startsWith("## ")) {
            return <div className="window-h2" key={`h2-${index}`}>{renderInline(trimmed.slice(3), `h2-${index}`)}</div>;
        }
        if (trimmed.startsWith("# ")) {
            return <div className="window-h1" key={`h1-${index}`}>{renderInline(trimmed.slice(2), `h1-${index}`)}</div>;
        }
        if (trimmed.startsWith("- ")) {
            return <div className="window-bullet" key={`bullet-${index}`}>{renderInline(trimmed.slice(2), `bullet-${index}`)}</div>;
        }
        return <p className="window-line" key={`text-${index}`}>{renderInline(text, `text-${index}`)}</p>;
    }

    function renderBodyItem(item: WindowBodyItem, index: number) {
        if (typeof item === "string") {
            return renderTextItem(item, index);
        }
        if (item.type === "image") {
            return (
                <div className="window-image-wrap" key={`img-${index}`}>
                    <img className="window-image" src={item.src} alt={item.alt} />
                </div>
            );
        }
        if (item.type === "link") {
            return (
                <a
                    className="window-link"
                    key={`link-${index}`}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                >
                    {item.label}
                </a>
            );
        }
        return null;
    }
    function handlePointerDown(e: React.PointerEvent) {
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const initialX = x;
        const initialY = y;
        const pointerId = e.pointerId;

        function onPointerMove(ev: PointerEvent) {
            if (ev.pointerId !== pointerId) return;
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            onDrag(windowId!, initialX + dx, initialY + dy);
        }

        function onPointerUp(ev: PointerEvent) {
            if (ev.pointerId !== pointerId) return;
            document.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerup", onPointerUp);
        }

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
    }
    
    return (
        <div
            className={`window${hasOverflow ? " window-has-overflow" : ""}`}
            style={{top: y, left: x, width, height, zIndex}}
            onPointerDownCapture={() => {
                if (windowId !== undefined) {
                    onActivate?.(windowId);
                }
            }}
        >
            {hasOverflow && (
                <div className="window-classic-scrollbar" aria-hidden="true">
                    <div className="window-classic-scrollbar-button window-classic-scrollbar-button-up" />
                    <div
                        className="window-classic-scrollbar-thumb"
                        style={{top: scrollThumb.top, height: scrollThumb.height}}
                    />
                    <div className="window-classic-scrollbar-button window-classic-scrollbar-button-down" />
                </div>
            )}
            {windowType === "contact" ? (
                <>
                <div className="window-titlebar" onPointerDown={handlePointerDown}>
                    <button
                        onClick={() => windowClose?.(windowId!)}
                        className="window-close-button"
                        aria-label="Close message window"
                    />
                    <span className="window-title-text">Message Me</span>
                </div>

                <div className="window-content contact-window-content" ref={contentRef}>
                    <ContactForm />
                </div>
                </>
            ) : windowType === "projects" ? (
                <>
                <div className="window-titlebar" onPointerDown={handlePointerDown}>
                    <button onClick={() => windowClose?.(windowId!)} className="window-close-button">
                    </button>
                    <span className="window-title-text">{windowConfig?.title ?? "Projects"}</span>
                </div>
                
                <div className="window-content folder-window" ref={contentRef}>
                    <FolderView onOpenWindow={onOpenWindow} />
                </div>
                </>
            ) : windowType && windowConfig ? (
                <>
                <div className="window-titlebar" onPointerDown={handlePointerDown}>
                    <button onClick={() => windowClose?.(windowId!)} className="window-close-button">
                    </button>
                    <span className="window-title-text">{windowConfig.title}</span>
                </div>
                
                <div className="window-content" ref={contentRef}>
                    <div className="window-content-body">
                        {windowConfig.body.map((item, index) => renderBodyItem(item, index))}
                    </div>
                </div>
                </>
            ) : (
                // Hopefully it's not happening
            <>
            <div className="window-titlebar" onPointerDown={handlePointerDown}>
                <button onClick={() => windowClose?.(windowId!)} 
                className="window-close-button">
                </button>
            </div>
            <p>Window content not found.</p>
            </>
        )}
        </div>
    ) 
}

export default Window;
