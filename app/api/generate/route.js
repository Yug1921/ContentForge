import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { brand, contentType, brief, tone, audience, variants, cta } = body;

    // Validate required fields
    if (!brand || !brief) {
      return NextResponse.json(
        { error: "Brand and brief are required." },
        { status: 400 }
      );
    }

    // Build the prompt
    const typeLabels = {
      email: "Email campaign",
      instagram: "Instagram caption",
      linkedin: "LinkedIn post",
      twitter: "Twitter/X post",
      product: "Product description",
      ad: "Ad copy (short)",
      tagline: "Tagline / slogan",
    };

    const limits = {
      email: "150–200 words",
      instagram: "80–120 words with 5–8 relevant hashtags",
      linkedin: "100–150 words",
      twitter: "under 250 characters",
      product: "80–120 words",
      ad: "under 50 words",
      tagline: "1–3 short punchy lines only",
    };

    const ctaLine = cta ? `CTA to include: "${cta}".\n` : "";
    const variantsLine =
      variants === 1
        ? "Write 1 polished version."
        : `Write exactly ${variants} distinct variants. Label each clearly as:\nVersion 1:\n[content]\n\nVersion 2:\n[content]${
            variants === 3 ? "\n\nVersion 3:\n[content]" : ""
          }`;

    const prompt = `You are a senior marketing copywriter. Write ${
      typeLabels[contentType]
    } content for a brand called "${brand}".

Campaign brief: ${brief}
Tone: ${tone}
Target audience: ${audience}
${ctaLine}Length: ${limits[contentType]}

${variantsLine}

Important: Output only the final copy — no explanations, no meta-commentary, no bracketed placeholders. Write as if ready to publish.`;

    const openRouterModel = process.env.OPENROUTER_MODEL || "openrouter/free";

    // Call OpenRouter API using the free router so the active free model can change over time.
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.OPENROUTER_REFERER || "http://localhost:3000",
        "X-Title": "InkPilot",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return NextResponse.json(
        { error: data.error?.message || "OpenRouter API error" },
        { status: 500 }
      );
    }

    const text = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ result: text });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}