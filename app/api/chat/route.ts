import { groq } from '@ai-sdk/groq';
import { streamText, type UIMessage } from 'ai';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a helpful assistant for a frontend developer's portfolio site. Answer questions clearly and concisely.`;

const MODEL = groq('llama-3.3-70b-versatile');

export async function POST(req: Request) {
  const body = await req.json();
  const messages: UIMessage[] = body.messages;

  // Manually convert UIMessage[] to plain {role, content} messages,
  // bypassing convertToModelMessages due to a version mismatch issue.
  const modelMessages = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join(''),
  }));

  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}