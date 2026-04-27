// Vercel serverless function — mirrors the logic in server.js for local dev.
// Vercel automatically routes POST /api/protocol here.

const Q_LABELS = [
  "Goals (priority order)", "Body composition goal", "Current symptoms",
  "Energy patterns", "Sleep quality (1–10)", "Training frequency",
  "Stress level", "Age range", "Biological sex", "Cancer history",
  "Existing conditions (incl. blood sugar)", "Current medications", "Known allergies",
  "Pregnancy status", "Peptide experience", "Preferred administration", "Monthly budget",
];

function buildUserContext(answers) {
  return Object.entries(answers).map(([idx, val]) => {
    const label = Q_LABELS[Number(idx)] ?? `Question ${Number(idx) + 1}`;
    const value = Array.isArray(val)
      ? val.join(", ")
      : typeof val === "object" && val !== null
      ? `${val.selections?.join(", ")}${val.other ? ` (other: ${val.other})` : ""}`
      : String(val);
    return `${label}: ${value}`;
  }).join("\n");
}

const SYSTEM_PROMPT = `You are an expert peptide protocol consultant with deep knowledge of peer-reviewed clinical research. Based on the user assessment provided, generate a personalized peptide protocol. Respond ONLY with valid JSON, no markdown, no explanation, just the JSON object with these exact fields:
{
  "protocolName": "string (creative name for their protocol)",
  "summary": "string (2-3 sentences explaining why this protocol fits them personally)",
  "primaryPeptide": { "name": "string", "purpose": "string", "personalizedReason": "string", "dose": "string", "frequency": "string", "administration": "string", "researchBacking": "string" },
  "secondaryPeptide": { "name": "string", "purpose": "string", "personalizedReason": "string", "dose": "string", "frequency": "string", "administration": "string", "researchBacking": "string" },
  "supportPeptide": { "name": "string", "purpose": "string", "personalizedReason": "string", "dose": "string", "frequency": "string", "administration": "string", "researchBacking": "string" } or null,
  "lifestyleNotes": ["string", "string", "string"],
  "disclaimer": "string"
}

Use all provided inputs to personalise the protocol:
- Goals and body composition goal drive primary compound selection.
- Current symptoms and energy patterns inform peptide priorities and personalizedReason.
- Sleep quality and stress level are key inputs — address directly where relevant.
- Training frequency informs recovery and performance compound choices.
- Age and biological sex affect dosing context and hormone-adjacent recommendations.
- Cancer history and existing conditions (including any blood sugar / insulin resistance flag) are hard safety constraints — never recommend anything contraindicated.
- Current medications may interact; note relevant cautions in lifestyleNotes.
- Known allergies and pregnancy status are absolute contraindication filters.
- Peptide experience level sets protocol complexity — beginners get simpler, lower-dose starting points.
- Preferred administration method must be respected; do not recommend injectables if the user selected oral/nasal.
- Monthly budget constrains compound selection; stay within the stated range.

Base all recommendations on peer-reviewed research. Never recommend anything contraindicated by stated health conditions or medications.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in environment variables" });
  }

  const { answers } = req.body;
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Missing answers in request body" });
  }

  const userContext = buildUserContext(answers);

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2400,
        system: SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `My assessment:\n\n${userContext}\n\nGenerate my personalized peptide protocol as JSON.`,
        }],
      }),
    });

    const anthropicData = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: anthropicData.error?.message ?? "Anthropic API error" });
    }

    const text = anthropicData.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: "Could not parse protocol from AI response." });

    const protocol = JSON.parse(match[0]);
    return res.json(protocol);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
