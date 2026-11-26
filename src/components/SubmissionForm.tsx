"use client";

import { useState } from "react";

type State = "idle" | "sending" | "done" | "error";

type Props = {
  goals: { slug: string; label: string }[];
  harnesses: { slug: string; label: string }[];
};

/** Mirrors the server checks so a reviewer never receives an obviously incomplete record. */
function clientIssues(data: FormData): string[] {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const issues: string[] = [];
  if (value("title").length < 12) issues.push("Add a workflow title of at least 12 characters.");
  try {
    const url = new URL(value("sourceUrl"));
    if (url.protocol !== "https:") throw new Error("https only");
  } catch {
    issues.push("Add a public https source URL.");
  }
  if (value("agentName").length < 2) issues.push("Name the agent or framework used.");
  if (value("summary").length < 40) {
    issues.push("Describe what the workflow does in at least 40 characters.");
  }
  const steps = value("steps")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (steps.length < 3) issues.push("Add at least three reproducible steps, one per line.");
  if (value("configSnippet").length < 8) {
    issues.push("Include the command, config, or prompt pattern that drives the workflow.");
  }
  if (value("limitations").length < 20) {
    issues.push("State the limitations or what broke.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("contactEmail"))) {
    issues.push("Add a contact email for review questions.");
  }
  if (data.get("consent") !== "on") {
    issues.push("Confirm the submission is accurate and that Zyvibe may contact you.");
  }
  return issues;
}

export function SubmissionForm({ goals, harnesses }: Props) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [issues, setIssues] = useState<string[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setIssues([]);
    setMessage("");

    const issues = clientIssues(data);
    if (issues.length > 0) {
      setState("error");
      setIssues(issues);
      setMessage("A few fields need attention.");
      return;
    }

    setState("sending");

    const payload = {
      title: data.get("title"),
      sourceUrl: data.get("sourceUrl"),
      goal: data.get("goal"),
      agentName: data.get("agentName"),
      harness: data.get("harness"),
      evidence: data.get("evidence"),
      summary: data.get("summary"),
      steps: data.get("steps"),
      configSnippet: data.get("configSnippet"),
      limitations: data.get("limitations"),
      contactEmail: data.get("contactEmail"),
      consent: data.get("consent") === "on",
      website: data.get("website"),
    };

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
        issues?: string[];
      };
      if (!response.ok) {
        setState("error");
        setIssues(body.issues ?? []);
        setMessage(body.message ?? "The submission was not accepted.");
        return;
      }
      setState("done");
      setMessage(
        body.message ??
          "Received. Every submission is reviewed by a human before anything is published."
      );
      form.reset();
    } catch {
      setState("error");
      setMessage("The submission could not be sent. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="form-done" role="status">
        <span className="badge" data-tone="verified">
          <span className="badge-dot" aria-hidden="true" />
          Submission received
        </span>
        <p>{message}</p>
        <p className="form-note">
          Nothing is published automatically. A reviewer checks the source link, the steps, and the
          limitations before a record is added. You can read the standard on the{" "}
          <a href="/methodology">methodology page</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="title">Workflow title</label>
          <input
            id="title"
            name="title"
            required
            maxLength={120}
            placeholder="What the workflow accomplishes, in one line"
          />
        </div>

        <div className="field field-full">
          <label htmlFor="sourceUrl">Source URL</label>
          <input
            id="sourceUrl"
            name="sourceUrl"
            type="url"
            required
            placeholder="https://docs.example-tool.com/agents/..."
          />
          <p className="field-hint">
            A public https link to documentation, a repository, or a creator write-up. Links to a
            homepage alone are rejected unless the homepage documents the workflow.
          </p>
        </div>

        <div className="field">
          <label htmlFor="goal">Goal</label>
          <select id="goal" name="goal" required defaultValue={goals[0]?.slug ?? ""}>
            {goals.map((goal) => (
              <option key={goal.slug} value={goal.slug}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="harness">Harness</label>
          <select id="harness" name="harness" required defaultValue={harnesses[0]?.slug ?? ""}>
            {harnesses.map((harness) => (
              <option key={harness.slug} value={harness.slug}>
                {harness.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="agentName">Agent or framework</label>
          <input id="agentName" name="agentName" required maxLength={80} placeholder="e.g. Aider" />
        </div>

        <div className="field">
          <label htmlFor="evidence">What does the source support?</label>
          <select id="evidence" name="evidence" required defaultValue="Documented">
            <option value="Documented">Documented — steps and requirements exist</option>
            <option value="Reported">Reported — someone describes the workflow</option>
          </select>
        </div>

        <div className="field field-full">
          <label htmlFor="summary">What this workflow does</label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={3}
            maxLength={600}
            placeholder="The problem, the agent, and the concrete outcome."
          />
        </div>

        <div className="field field-full">
          <label htmlFor="steps">Reproducible steps</label>
          <textarea
            id="steps"
            name="steps"
            required
            rows={5}
            placeholder={"One step per line. Start from installation and end at the result you verified."}
          />
          <p className="field-hint">At least three steps. Do not paste marketing copy.</p>
        </div>

        <div className="field field-full">
          <label htmlFor="configSnippet">Command, config, or prompt pattern</label>
          <textarea
            id="configSnippet"
            name="configSnippet"
            required
            rows={4}
            placeholder="The exact command or prompt that drives the workflow."
          />
        </div>

        <div className="field field-full">
          <label htmlFor="limitations">Limitations and what broke</label>
          <textarea
            id="limitations"
            name="limitations"
            required
            rows={3}
            placeholder="Rate limits, cost, manual review, or the part that failed on the first run."
          />
        </div>

        <div className="field field-full">
          <label htmlFor="contactEmail">Contact email for review questions</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            autoComplete="email"
            placeholder="you@yourdomain.com"
          />
        </div>
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" name="consent" required />
        <span>
          I confirm this submission is accurate, the source is public, and Zyvibe may contact me
          about the review.
        </span>
      </label>

      {issues.length > 0 && (
        <ul className="form-issues">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}

      <p className="form-status" data-state={state} role="status" aria-live="polite">
        {message}
      </p>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : "Submit for review"}
        </button>
        <p className="form-note">Reviewed manually. Never published automatically.</p>
      </div>
    </form>
  );
}
