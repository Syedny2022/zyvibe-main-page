import type { Concept, IntakeInput } from '../../shared/concept';
import { validateConcept } from '../../shared/concept';
import type { Env } from './env';
import { SITE_URL } from './env';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const MODEL_TIMEOUT_MS = 75_000;

async function callModel(env: Env, messages: ChatMessage[]): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': 'Zyvibe Website Sprint',
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL,
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error(`model_http_${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || content.length === 0) throw new Error('model_empty_response');
    return content;
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonContent(content: string): unknown {
  const stripped = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(stripped);
}

export type GenerationResult = { ok: true; concept: Concept } | { ok: false; errorCode: string };

/**
 * Generates a concept and validates it. If the first answer fails validation,
 * retries once with the validation errors so the model can repair it.
 */
export async function generateConcept(env: Env, input: IntakeInput): Promise<GenerationResult> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildUserMessage(input) },
  ];

  let lastError = 'model_unknown_error';
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let content: string;
    try {
      content = await callModel(env, messages);
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'model_request_failed';
      continue;
    }

    let parsed: unknown;
    try {
      parsed = parseJsonContent(content);
    } catch {
      lastError = 'model_invalid_json';
      messages.push({ role: 'assistant', content }, { role: 'user', content: 'That was not valid JSON. Return only the JSON object in the required shape.' });
      continue;
    }

    const { concept, errors } = validateConcept(parsed);
    if (concept) return { ok: true, concept };

    lastError = 'concept_failed_validation';
    messages.push(
      { role: 'assistant', content },
      { role: 'user', content: `Fix these problems and return the full corrected JSON object only:\n- ${errors.slice(0, 20).join('\n- ')}` },
    );
  }
  return { ok: false, errorCode: lastError };
}
