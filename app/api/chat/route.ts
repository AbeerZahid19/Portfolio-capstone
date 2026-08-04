import { groq } from '@ai-sdk/groq';
import { streamText, stepCountIs, type UIMessage } from 'ai';
import { fetchMetaTags } from './tools';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a helpful assistant for a frontend developer's portfolio site. Answer questions clearly and concisely. If the user asks you to check, look up, or analyze a website, use the fetchMetaTags tool to get its title and description before answering.`;

const MODEL = groq('llama-3.3-70b-versatile');

export async function POST(req: Request) {
  const body = await req.json();
  const messages: UIMessage[] = body.messages;

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
    tools: {
      fetchMetaTags,
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}