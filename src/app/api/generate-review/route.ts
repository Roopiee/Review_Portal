import { NextRequest, NextResponse } from 'next/server';

const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const MODEL = process.env.MISTRAL_MODEL ?? 'mistral-small-latest';

interface RequestBody {
  keywords?: string[];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'MISTRAL_API_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const keywords = Array.isArray(body.keywords)
    ? body.keywords.filter(k => typeof k === 'string' && k.trim().length > 0).slice(0, 12)
    : [];

  if (keywords.length === 0) {
    return NextResponse.json(
      { error: 'Please pick at least one keyword.' },
      { status: 422 },
    );
  }

  const systemPrompt =
    'You write short, authentic, first-person employee reviews for NetConnect Global. ' +
    'Tone: warm, specific, and grounded — no corporate cliches, no hashtags, no emojis. ' +
    'Output ONLY the review text — no preamble, no quotation marks, no bullet points.';

  const userPrompt =
    `Write a positive employee review in 4-5 sentences using these themes naturally: ${keywords.join(', ')}. ` +
    `Speak in the first person. Keep it under 90 words.`;

  try {
    const upstream = await fetch(MISTRAL_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 240,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('[generate-review] Mistral error', upstream.status, detail);
      return NextResponse.json(
        { error: `Mistral API error (${upstream.status}).` },
        { status: 502 },
      );
    }

    const data = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    if (!text) {
      return NextResponse.json({ error: 'Empty response from Mistral.' }, { status: 502 });
    }
    return NextResponse.json({ text });
  } catch (err) {
    console.error('[generate-review] fetch error:', err);
    return NextResponse.json({ error: 'Failed to reach Mistral.' }, { status: 502 });
  }
}
