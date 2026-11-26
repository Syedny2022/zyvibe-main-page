"use client";

import { useId, useState } from "react";

type State = "idle" | "sending" | "done" | "error";

export function DigestForm({
  compact = false,
  heading = "Get curated agent workflows + prompts",
}: {
  compact?: boolean;
  heading?: string;
}) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          sourceDomain: window.location.hostname,
          sourcePath: window.location.pathname,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        setState("error");
        setMessage(data.message ?? "The signup could not be saved. Please try again.");
        return;
      }
      setState("done");
      setMessage(data.message ?? "You are on the list.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("The signup could not be saved. Please try again.");
    }
  }

  return (
    <div className={`digest-form-wrap${compact ? " digest-compact" : ""}`}>
      {compact && <p className="digest-compact-title">{heading}</p>}
      <form className="digest-form" onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor={inputId}>
          Email address for Zyvibe Digest
        </label>
        <input
          id={inputId}
          type="email"
          className="digest-input"
          placeholder="builder@domain.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
        <button type="submit" className="btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Saving..." : "Get Zyvibe Digest"}
        </button>
      </form>
      <p className="digest-consent">
        By subscribing, you agree to receive Zyvibe Digest emails. You can unsubscribe at any time.
      </p>
      <p className="form-status" data-state={state} role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
