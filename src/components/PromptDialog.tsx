"use client";

import { CopyBlock } from "./CopyBlock";
import { Dialog } from "./Dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  configLabel: string;
  configSnippet: string;
  steps: string[];
};

export function PromptDialog({ open, onClose, title, configLabel, configSnippet, steps }: Props) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="prompt-dialog-title" className="prompt-dialog">
      <div className="modal-head">
        <p className="modal-kicker label-caps">View prompt / config</p>
        <button type="button" className="modal-close mono" onClick={onClose}>
          ESC
        </button>
      </div>
      <h2 id="prompt-dialog-title" className="modal-title">
        {title}
      </h2>
      <div className="modal-body">
        <CopyBlock label={configLabel} text={configSnippet} />
        <p className="modal-label label-caps">Steps as documented</p>
        <ol className="modal-steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="modal-note">
          Copied from the published record. Requirements and limitations are listed on the full use
          case page.
        </p>
      </div>
    </Dialog>
  );
}
