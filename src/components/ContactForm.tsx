"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const CONTACT_EMAIL = "kyson567@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

type SubmitState = "idle" | "sending" | "sent" | "error";
type FormSubmitResponse = {
    success?: boolean | string;
};

export default function ContactForm() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [submitState, setSubmitState] = useState<SubmitState>("idle");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        setSubmitState("sending");

        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: name.trim() || "Anonymous",
                    message: trimmedMessage,
                    _subject: "New message from your portfolio",
                    _template: "table",
                    _captcha: "false",
                    _honey: "",
                }),
            });
            const result = await response.json() as FormSubmitResponse;

            if (!response.ok || (result.success !== true && result.success !== "true")) {
                throw new Error("Message could not be sent");
            }

            setName("");
            setMessage("");
            setSubmitState("sent");
        } catch {
            setSubmitState("error");
        }
    }

    return (
        <form
            className="contact-form"
            onSubmit={handleSubmit}
            style={{fontFamily: "ChigacoFLF, sans-serif"}}
        >
            <label className="contact-field">
                <span>Name <small>(optional)</small></span>
                <input
                    type="text"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                        setSubmitState("idle");
                    }}
                    autoComplete="name"
                    maxLength={80}
                    style={{fontFamily: "ChigacoFLF, sans-serif"}}
                />
            </label>

            <label className="contact-field contact-message-field">
                <span>Message</span>
                <textarea
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                        setSubmitState("idle");
                    }}
                    required
                    maxLength={2000}
                    style={{fontFamily: "ChigacoFLF, sans-serif"}}
                />
            </label>

            <div className="contact-actions">
                <span className={`contact-status contact-status-${submitState}`} role="status" aria-live="polite">
                    {submitState === "sent" && "Message sent."}
                    {submitState === "error" && "Could not send. Try again."}
                </span>
                <button
                    type="submit"
                    className="contact-send-button"
                    disabled={!message.trim() || submitState === "sending"}
                >
                    {submitState === "sending" ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
}
