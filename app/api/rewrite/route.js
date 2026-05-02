import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { originalCopy, targetTone, targetAudience, keepCTA } = body;

    if (!originalCopy) {
      return NextResponse.json({ error: "Original copy is required." }, { status: 400 });
    }

    const prompt = `You are a senior marketing copywriter and tone specialist.

A user has provided existing marketing copy and wants it rewritten in a different tone.

ORIGINAL COPY:
"${originalCopy}"

REWRITE INSTRUCTIONS:
- Target tone: ${targetTone}
- Target audience: ${targetAudience}
- ${keepCTA ? "Preserve the original call-to-action (CTA) if one exists." : "You may update or improve the call-to-action."}

YOUR TASK:
1. First, in one short sentence, identify the original tone of the copy.
2. Then rewrite the copy in the requested tone.
3. Finally, in one short sentence, explain what you changed and why.

Format your response EXACTLY like this:
ORIGINAL TONE: [your assessment]

REWRITTEN COPY:
[the rewritten version]

WHAT CHANGED: [brief explanation]`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ContentForge",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "API error" }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content || "";

    // Parse the structured response
    const originalToneMatch = text.match(/ORIGINAL TONE:\s*(.+)/i);
    const rewrittenMatch = text.match(/REWRITTEN COPY:\s*([\s\S]+?)(?=WHAT CHANGED:|$)/i);
    const whatChangedMatch = text.match(/WHAT CHANGED:\s*(.+)/i);

    return NextResponse.json({
      originalTone: originalToneMatch?.[1]?.trim() || "Could not detect",
      rewritten: rewrittenMatch?.[1]?.trim() || text,
      whatChanged: whatChangedMatch?.[1]?.trim() || "",
    });

  } catch (err) {
    console.error("Rewrite error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}