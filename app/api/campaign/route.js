import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { brand, brief, tone, audience, cta } = body;

    if (!brand || !brief) {
      return NextResponse.json({ error: "Brand and brief are required." }, { status: 400 });
    }

    const ctaLine = cta ? `CTA to include: "${cta}".` : "";

    const prompt = `You are a senior marketing strategist and copywriter. A client needs a full multi-platform content campaign.

Brand: ${brand}
Campaign brief: ${brief}
Tone: ${tone}
Target audience: ${audience}
${ctaLine}

Generate ready-to-publish marketing copy for ALL of the following platforms. Follow the exact format below — each platform separated clearly.

INSTAGRAM:
[80-120 words, conversational, with 5-6 relevant hashtags at the end]

LINKEDIN:
[100-150 words, professional insight-driven post, no hashtags]

TWITTER:
[under 240 characters, punchy and direct]

EMAIL_SUBJECT:
[one compelling email subject line, under 60 characters]

EMAIL_BODY:
[150-200 words, structured email with greeting, body, and CTA]

PRODUCT_DESCRIPTION:
[80-100 words, benefit-focused, SEO-friendly]

AD_COPY:
[under 50 words, high-impact, urgency-driven]

Rules:
- Use the actual brand name "${brand}" throughout, never use placeholders
- Each piece must feel native to its platform
- Output only the content for each section, no extra commentary`;

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
        temperature: 0.85,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "API error" }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content || "";

    // Parse each platform section
    function extract(label, nextLabel) {
      const regex = nextLabel
        ? new RegExp(`${label}:\\s*([\\s\\S]+?)(?=${nextLabel}:|$)`, "i")
        : new RegExp(`${label}:\\s*([\\s\\S]+?)$`, "i");
      return text.match(regex)?.[1]?.trim() || "";
    }

    return NextResponse.json({
      instagram: extract("INSTAGRAM", "LINKEDIN"),
      linkedin: extract("LINKEDIN", "TWITTER"),
      twitter: extract("TWITTER", "EMAIL_SUBJECT"),
      emailSubject: extract("EMAIL_SUBJECT", "EMAIL_BODY"),
      emailBody: extract("EMAIL_BODY", "PRODUCT_DESCRIPTION"),
      productDescription: extract("PRODUCT_DESCRIPTION", "AD_COPY"),
      adCopy: extract("AD_COPY", null),
    });

  } catch (err) {
    console.error("Campaign error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}