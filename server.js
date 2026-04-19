import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { readFileSync } from "fs";

// Load .env.server (no dotenv dependency needed)
try {
  const envFile = readFileSync(".env.server", "utf8");
  for (const line of envFile.split("\n")) {
    const [key, ...rest] = line.trim().split("=");
    if (key && !key.startsWith("#")) process.env[key] = rest.join("=").trim();
  }
} catch {
  // .env.server not found — key may be set in environment directly
}

const app  = express();
const PORT = 3001;

app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));
app.use(express.json());

// ── Quiz answer labels — mirrors Q_LABELS order in the quiz ──────────────────
const Q_LABELS = [
  "Goals (priority order)", "Body composition goal", "Current symptoms",
  "Symptom severity (1–5)", "Energy patterns", "Sleep quality (1–10)",
  "Training frequency", "Diet quality", "Stress level",
  "Changes in last 12 months", "Blood sugar regulation", "Age range",
  "Biological sex", "Approximate weight", "Cancer history",
  "Existing conditions", "Current medications", "Known allergies",
  "Pregnancy status", "Peptide experience", "Comfort with injection",
  "Preferred administration", "Monthly budget",
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
Base all recommendations on peer-reviewed research. Personalize specifically to their inputs. Never recommend anything contraindicated by their stated health conditions.`;

// ── POST /api/protocol ───────────────────────────────────────────────────────
app.get("/", (_, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  res.json({
    status: "Pepti AI API server running",
    port: PORT,
    apiKey: key ? `loaded (${key.substring(0, 14)}...)` : "NOT SET",
    endpoints: ["POST /api/protocol"],
  });
});

app.post("/api/protocol", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in .env.server" });
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
    res.json(protocol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  const key = process.env.ANTHROPIC_API_KEY;
  console.log(`Pepti AI server running on http://localhost:${PORT}`);
  console.log(`API key: ${key ? key.substring(0, 14) + "..." : "NOT SET — check .env.server"}`);
});
