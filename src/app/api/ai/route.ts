import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { NextResponse } from 'next/server';

// configure a Genkit instance
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // set default model
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const question = searchParams.get('q') || '';
  const { text } = await ai.generate(question);
  return NextResponse.json({ answer: text });
}