"use client";

import { useState } from "react";
import type { Placement } from "@/lib/site";

type State = "idle" | "sending" | "error";

function clientIssues(data: FormData): string[] {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const issues: string[] = [];
  if (value("projectName").length < 2) issues.push("Add the project or product name.");
  if (value("builderName").length < 2) issues.push("Add the builder name shown beside the listing.");
  try {
    const url = new URL(value("projectUrl"));
    if (url.protocol !== "https:") throw new Error("https only");
  } catch {
    issues.push("Add a public https project URL.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) {
    issues.push("Add a valid receipt email address.");
  }
  if (!value("placement")) issues.push("Choose a placement.");
  return issues;
}

export function PromoteCheckout({ placements }: { placements: Placement[] }) {
  const [selected, setSelected] = useState(placements[0]?.id ?? "");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage("");

    const issues = clientIssues(data);
    if (issues.length > 0) {
      setState("error");
      setMessage("A few fields need attention. " + issues.join(" "));
      return;
    }

    setState("sending");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          placement: selected,
          projectName: data.get("projectName"),
          projectUrl: data.get("projectUrl"),
          builderName: data.get("builderName"),
          email: data.get("email"),
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        mode?: string;
        url?: string;
        message?: string;
      };
      if (!response.ok || !body.url) {
        setState("error");
        setMessage(
          body.mode === "unconfigured"
            ? "Checkout is not configured in this local environment. Add STRIPE_SECRET_KEY to enable it."
            : (body.message ?? "Checkout could not be started.")
        );
        return;
      }
      window.location.href = body.url;
    } catch {
      setState("error");
      setMessage("Checkout could not be started. Please try again.");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <fieldset className="placement-fieldset">
        <legend className="label-caps">Choose a placement</legend>
        <div className="placement-grid">
          {placements.map((placement) => (
            <label
              key={placement.id}
              className="placement"
              data-selected={selected === placement.id}
            >
              <input
                type="radio"
                name="placement"
                value={placement.id}
                checked={selected === placement.id}
                onChange={() => setSelected(placement.id)}
              />
              <span className="placement-head">
                <span className="placement-name">{placement.name}</span>
                <span className="placement-price mono">{placement.priceLabel}</span>
              </span>
              <span className="placement-body">{placement.summary}</span>
              <span className="placement-duration mono">{placement.duration}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="projectName">Project or product name</label>
          <input id="projectName" name="projectName" required maxLength={80} />
        </div>
        <div className="field">
          <label htmlFor="builderName">Builder name</label>
          <input id="builderName" name="builderName" required maxLength={80} />
        </div>
        <div className="field field-full">
          <label htmlFor="projectUrl">Project URL</label>
          <input
            id="projectUrl"
            name="projectUrl"
            type="url"
            required
            placeholder="https://your-project.com"
          />
          <p className="field-hint">
            Public https URL only. It is checked automatically after payment; placements that fail
            the check go to manual review instead of going live.
          </p>
        </div>
        <div className="field field-full">
          <label htmlFor="email">Receipt email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <p className="form-status" data-state={state} role="status" aria-live="polite">
        {message}
      </p>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Opening Stripe..." : "Continue to Stripe Checkout"}
        </button>
        <p className="form-note">
          Payment is processed by Stripe. The placement is labeled Advertisement wherever it
          appears.
        </p>
      </div>
    </form>
  );
}
