"use client";
import {useState, useEffect} from 'react';
import { WINDOW_CONTENT, WindowBodyItem } from '@/data/windows';
import FolderView from "@/components/FolderView";

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
};

function Window({windowType, windowId, windowClose, x, y, onDrag, onOpenWindow, width, height}: WindowProps) {
    // console.log("Window props:", {windowType});
    const windowConfig = windowType ? WINDOW_CONTENT[windowType] : undefined;
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
            // return <div className="window-spacer" key={`spacer-${index}`} />;
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
        <div className="window" style={{top: y, left: x, width, height}}>
            {windowType === "projects" ? (
                <>
                <div className="window-titlebar" onPointerDown={handlePointerDown}>
                    <button onClick={() => windowClose?.(windowId!)} className="window-close-button">
                    </button>
                    {windowConfig?.title ?? "Projects"}
                </div>
                
                <div className="window-content folder-window">
                    <FolderView onOpenWindow={onOpenWindow} />
                </div>
                </>
            ) : windowType && windowConfig ? (
                <>
                <div className="window-titlebar" onPointerDown={handlePointerDown}>
                    <button onClick={() => windowClose?.(windowId!)} className="window-close-button">
                    </button>
                    {windowConfig.title}
                </div>
                
                <div className="window-content">
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
