 import { groq } from '@ai-sdk/groq';
import { streamText, stepCountIs, type UIMessage } from 'ai';
import { fetchMetaTags } from './tools';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a helpful assistant for a frontend developer's portfolio site. Answer questions clearly and concisely. If the user asks you to check, look up, or analyze a website, use the fetchMetaTags tool to get its title and description before answering.`;

const MODEL = groq('openai/gpt-oss-120b');

// --- Basic abuse protection ---
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES_PER_REQUEST = 20;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // per IP per window

// In-memory rate limit store. Resets on cold start, which is an accepted
// tradeoff for a small portfolio site rather than standing up Redis for this.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = await req.json();
  const messages: UIMessage[] = body.messages;

  if (!Array.isArray(messages) || messages.length > MAX_MESSAGES_PER_REQUEST) {
    return new Response(
      JSON.stringify({ error: 'Conversation is too long for this endpoint.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const modelMessages = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
      .slice(0, MAX_MESSAGE_LENGTH),
  }));

  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    tools: {
      fetchMetaTags,
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}