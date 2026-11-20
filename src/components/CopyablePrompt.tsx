'use client';

import React, { useState } from 'react';

interface CopyablePromptProps {
  prompt: string;
  placeholders: string[];
}

export default function CopyablePrompt({ prompt, placeholders }: CopyablePromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
      <div style={{ padding: '8px 12px', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Prompt Template
        </span>
        <button
          onClick={handleCopy}
          style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {copied ? '✓ Copied!' : 'Copy Prompt'}
        </button>
      </div>

      <pre style={{ margin: 0, padding: '16px', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', background: '#222', color: '#f5f5f5' }}>
        {prompt}
      </pre>

      {placeholders && placeholders.length > 0 && (
        <div style={{ padding: '10px 12px', background: '#fafafa', borderTop: '1px solid #eee', fontSize: '12px', color: '#555' }}>
          <strong>Replace bracketed variables before running:</strong>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
            {placeholders.map((ph, idx) => (
              <code key={idx} style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                {ph}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
