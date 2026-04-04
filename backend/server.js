import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8000;

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const allowedDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const configuredFrontendOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedDevOrigin.test(origin)) {
    return true;
  }

  return configuredFrontendOrigins.includes(origin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server and curl/Postman requests without an Origin header.
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "resume-job-fit-backend",
    timestamp: new Date().toISOString(),
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfName = file.originalname.toLowerCase().endsWith(".pdf");

    if (isPdfMime || isPdfName) {
      cb(null, true);
      return;
    }

    cb(new Error("Only PDF files are allowed."));
  },
});

function extractJsonText(geminiResponse) {
  const textValue =
    typeof geminiResponse?.text === "function"
      ? geminiResponse.text()
      : geminiResponse?.text;

  if (!textValue || typeof textValue !== "string") {
    throw new Error("Gemini response did not contain text output.");
  }

  return textValue.trim();
}

function parseModelJson(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Model returned invalid JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function toNumber(value, fallback = 0) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function toObject(value, fallback = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return fallback;
}

function normalizeChatMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .map((message) => {
      if (!message || typeof message !== "object") return null;

      const role = message.role === "assistant" ? "assistant" : "user";
      const content = typeof message.content === "string" ? message.content.trim() : "";

      if (!content) return null;

      return { role, content };
    })
    .filter(Boolean);
}

function detectLanguageStyle(text) {
  if (typeof text !== "string") return "english";

  const normalizedText = text.trim();
  if (!normalizedText) return "english";

  const hasTamilScript = /[\u0B80-\u0BFF]/.test(normalizedText);
  const hasEnglishLetters = /[A-Za-z]/.test(normalizedText);

  if (hasTamilScript && !hasEnglishLetters) {
    return "tamil";
  }

  if (hasTamilScript && hasEnglishLetters) {
    return "tanglish";
  }

  const tanglishMarkers = /\b(enna|epdi|eppadi|inga|anga|unga|ungal|nan|naan|nalla|venum|venuma|iruku|irukku|ponga|vaanga|seri|romba|konjam|saptiya|macha|thambi|akka|anna|ipo|ippo|apdi|ippadi|idhu|adhu|yen|ennaiku)\b/i;
  if (tanglishMarkers.test(normalizedText)) {
    return "tanglish";
  }

  return "english";
}

function buildSearchUrl(role) {
  const query = encodeURIComponent(`${role} jobs remote`);
  return `https://www.google.com/search?q=site%3Alinkedin.com%2Fjobs+OR+site%3Aindeed.com+${query}`;
}

function buildPlatformLinks(role, skills = []) {
  const cleanedRole = coerceString(role, "job");
  const topSkills = toStringArray(skills).slice(0, 3);
  const query = [cleanedRole, ...topSkills, "jobs"].filter(Boolean).join(" ");
  const encodedQuery = encodeURIComponent(query);
  const encodedLocation = encodeURIComponent("Remote");

  return [
    {
      platform: "LinkedIn",
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=${encodedLocation}`,
    },
    {
      platform: "Indeed",
      url: `https://in.indeed.com/jobs?q=${encodedQuery}&l=${encodedLocation}`,
    },
    {
      platform: "Glassdoor",
      url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodedQuery}`,
    },
    {
      platform: "Naukri",
      url: `https://www.naukri.com/jobs-in-india?k=${encodedQuery}`,
    },
  ];
}

function normalizePlatformLinks(platformLinks, role, skills = []) {
  const fallbackLinks = buildPlatformLinks(role, skills);

  if (!Array.isArray(platformLinks) || !platformLinks.length) {
    return fallbackLinks;
  }

  const normalizedLinks = platformLinks
    .map((item) => ({
      platform: coerceString(item?.platform),
      url: coerceString(item?.url),
    }))
    .filter((item) => item.platform && item.url);

  return normalizedLinks.length ? normalizedLinks : fallbackLinks;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value, 0))));
}

function coerceString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

async function generateJsonFromGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const rawText = extractJsonText(response);
  return parseModelJson(rawText);
}

async function adaptCoachResponseLanguage(payload, languageStyle) {
  if (!payload || typeof payload !== "object") {
    return {
      reply: "I can help with resume edits, role targeting, and skill planning.",
      suggestions: [],
    };
  }

  const style = ["english", "tamil", "tanglish"].includes(languageStyle)
    ? languageStyle
    : "english";

  if (style === "english") {
    return {
      reply: coerceString(payload.reply, "I can help with resume edits, role targeting, and skill planning."),
      suggestions: toStringArray(payload.suggestions),
    };
  }

  const prompt = `You are a strict language-style formatter.
Rewrite the given content to match the exact target style while preserving meaning.

Rules:
- Keep intent and practical advice unchanged.
- Keep concise wording.
- Output ONLY JSON with this schema:
{
  "reply": "string",
  "suggestions": ["string"]
}
- Target style: ${style}
- If target style is "tamil", write entirely in Tamil script.
- If target style is "tanglish", write Tamil in English letters only (no Tamil script).

Input JSON:
${JSON.stringify({
    reply: coerceString(payload.reply),
    suggestions: toStringArray(payload.suggestions),
  })}`;

  try {
    const converted = await generateJsonFromGemini(prompt);
    return {
      reply: coerceString(converted?.reply, coerceString(payload.reply)),
      suggestions: toStringArray(converted?.suggestions).length
        ? toStringArray(converted?.suggestions)
        : toStringArray(payload.suggestions),
    };
  } catch {
    return {
      reply: coerceString(payload.reply, "I can help with resume edits, role targeting, and skill planning."),
      suggestions: toStringArray(payload.suggestions),
    };
  }
}

function defaultFallbackAnalysis(resumeText, targetRole = "") {
  const lowerResumeText = resumeText.toLowerCase();
  const hasPortfolio = /github|portfolio|linkedin|website|behance|dribbble/.test(lowerResumeText);
  const commonSkills = [
    "communication",
    "problem solving",
    "teamwork",
    "analysis",
    "project management",
  ];

  const extractedSkills = commonSkills.filter((skill) => lowerResumeText.includes(skill));

  return {
    parsedResume: {
      name: "Unknown Candidate",
      headline: targetRole || "Career-ready professional",
      summary: "Resume text was processed, but the model output was unavailable. Review the source text and regenerate the analysis.",
      skills: extractedSkills,
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      portfolioLinks: hasPortfolio ? ["Portfolio or profile link detected"] : [],
    },
    resumeScore: {
      overall: extractedSkills.length ? 58 : 42,
      breakdown: {
        skills: extractedSkills.length ? 65 : 40,
        experience: 55,
        projects: 45,
        keywordMatch: extractedSkills.length ? 60 : 35,
        formatting: 50,
      },
      summary: "Basic fallback score generated because the AI analysis could not be completed.",
      strengths: extractedSkills.length ? ["Some transferable skills are visible"] : ["Resume text was received"],
      weaknesses: ["Detailed AI analysis is unavailable until the request is retried"],
    },
    mistakes: [
      {
        title: "Limited structured analysis",
        severity: "medium",
        detail: "The model did not return a parsed review.",
        fix: "Resubmit the resume after verifying the API key and network connection.",
      },
    ],
    skillGap: {
      targetRole: targetRole || "Target role not provided",
      matched: extractedSkills,
      missing: ["role-specific keywords", "measurable achievements", "portfolio link"],
      prioritySkills: ["job-specific tooling", "impact-driven bullet points", "portfolio evidence"],
    },
    suggestions: [
      "Add measurable outcomes to each bullet point.",
      "Include role-specific keywords from target job descriptions.",
      "Add links to projects, GitHub, or a portfolio.",
    ],
    rewrittenResume: {
      headline: targetRole || "Professional Resume Rewrite",
      summary: "Rewrite unavailable from fallback mode.",
      bulletPoints: ["Use stronger verbs", "Add quantified impact", "Tailor for the target role"],
      fullText: resumeText,
    },
    jobMatches: targetRole
      ? [
          {
            role: targetRole,
            score: 67,
            description: "A reasonable fallback match based on the target role provided.",
            searchQuery: `${targetRole} jobs remote`,
            searchUrl: buildSearchUrl(targetRole),
            platformLinks: buildPlatformLinks(targetRole, extractedSkills),
          },
        ]
      : [],
    salaryInsights: targetRole
      ? [
          {
            role: targetRole,
            range: "$70k-$110k",
            currency: "USD",
            experienceLevel: "Estimated market range",
            marketTrend: "Stable",
            notes: "Fallback estimate generated without live market data.",
          },
        ]
      : [],
    careerRecommendations: targetRole
      ? [
          {
            role: targetRole,
            fitScore: 67,
            why: "This role aligns with the selected target role.",
            nextSteps: ["Refine resume keywords", "Add project evidence", "Apply to relevant roles"],
            growthAreas: ["domain knowledge", "portfolio depth"],
          },
        ]
      : [],
    coachStarter: [
      "What skills should I add to improve this resume?",
      "How can I make my project bullets more impactful?",
      "What role should I pursue next based on this profile?",
    ],
  };
}

function normalizeAnalysisResult(data, resumeText, targetRole = "") {
  const parsedResume = toObject(data?.parsedResume);
  const resumeScore = toObject(data?.resumeScore);
  const skillGap = toObject(data?.skillGap);
  const rewrittenResume = toObject(data?.rewrittenResume);

  const matchedSkills = toStringArray(skillGap?.matched);
  const missingSkills = toStringArray(skillGap?.missing);
  const scoreBreakdown = toObject(resumeScore?.breakdown);

  return {
    parsedResume: {
      name: coerceString(parsedResume.name, "Unknown Candidate"),
      headline: coerceString(parsedResume.headline, targetRole || "Career Intelligence Profile"),
      summary: coerceString(parsedResume.summary, "No summary returned."),
      skills: toStringArray(parsedResume.skills),
      education: toStringArray(parsedResume.education),
      experience: Array.isArray(parsedResume.experience) ? parsedResume.experience : [],
      projects: Array.isArray(parsedResume.projects) ? parsedResume.projects : [],
      certifications: toStringArray(parsedResume.certifications),
      portfolioLinks: toStringArray(parsedResume.portfolioLinks),
    },
    resumeScore: {
      overall: clampScore(resumeScore.overall),
      breakdown: {
        skills: clampScore(scoreBreakdown.skills),
        experience: clampScore(scoreBreakdown.experience),
        projects: clampScore(scoreBreakdown.projects),
        keywordMatch: clampScore(scoreBreakdown.keywordMatch),
        formatting: clampScore(scoreBreakdown.formatting),
      },
      summary: coerceString(resumeScore.summary, "No score summary returned."),
      strengths: toStringArray(resumeScore.strengths),
      weaknesses: toStringArray(resumeScore.weaknesses),
    },
    mistakes: Array.isArray(data?.mistakes)
      ? data.mistakes.map((item) => ({
          title: coerceString(item?.title, "Resume improvement"),
          severity: ["low", "medium", "high"].includes(item?.severity) ? item.severity : "medium",
          detail: coerceString(item?.detail, "No detail returned."),
          fix: coerceString(item?.fix, "Add clearer impact and context."),
        }))
      : [],
    skillGap: {
      targetRole: coerceString(skillGap.targetRole, targetRole || "Target role not provided"),
      matched: matchedSkills,
      missing: missingSkills,
      prioritySkills: toStringArray(skillGap.prioritySkills),
    },
    suggestions: toStringArray(data?.suggestions),
    rewrittenResume: {
      headline: coerceString(rewrittenResume.headline, targetRole || "Rewrite"),
      summary: coerceString(rewrittenResume.summary, "No rewrite summary returned."),
      bulletPoints: toStringArray(rewrittenResume.bulletPoints),
      fullText: coerceString(rewrittenResume.fullText, resumeText),
    },
    jobMatches: Array.isArray(data?.jobMatches)
      ? data.jobMatches.map((item) => ({
          role: coerceString(item?.role, "Relevant Role"),
          score: clampScore(item?.score),
          description: coerceString(item?.description, "No description returned."),
          searchQuery: coerceString(item?.searchQuery, `${coerceString(item?.role, targetRole)} jobs`),
          searchUrl: coerceString(item?.searchUrl, buildSearchUrl(coerceString(item?.role, targetRole))),
          platformLinks: normalizePlatformLinks(
            item?.platformLinks,
            coerceString(item?.role, targetRole),
            toStringArray(parsedResume.skills)
          ),
        }))
      : [],
    salaryInsights: Array.isArray(data?.salaryInsights)
      ? data.salaryInsights.map((item) => ({
          role: coerceString(item?.role, "Role"),
          range: coerceString(item?.range, "Market range unavailable"),
          currency: coerceString(item?.currency, "USD"),
          experienceLevel: coerceString(item?.experienceLevel, "Estimated"),
          marketTrend: coerceString(item?.marketTrend, "Stable"),
          notes: coerceString(item?.notes, "No notes returned."),
        }))
      : [],
    careerRecommendations: Array.isArray(data?.careerRecommendations)
      ? data.careerRecommendations.map((item) => ({
          role: coerceString(item?.role, "Role"),
          fitScore: clampScore(item?.fitScore),
          why: coerceString(item?.why, "No rationale returned."),
          nextSteps: toStringArray(item?.nextSteps),
          growthAreas: toStringArray(item?.growthAreas),
        }))
      : [],
    coachStarter: toStringArray(data?.coachStarter),
  };
}

async function generateCareerAnalysis(resumeText, targetRole = "") {
  const prompt = `You are an AI career intelligence platform.
Analyze the resume text and return ONLY a JSON object with the following schema:
{
  "parsedResume": {
    "name": "string",
    "headline": "string",
    "summary": "string",
    "skills": ["string"],
    "education": ["string"],
    "experience": [{ "company": "string", "role": "string", "impact": "string", "dates": "string" }],
    "projects": [{ "name": "string", "impact": "string", "tech": ["string"] }],
    "certifications": ["string"],
    "portfolioLinks": ["string"]
  },
  "resumeScore": {
    "overall": 0,
    "breakdown": { "skills": 0, "experience": 0, "projects": 0, "keywordMatch": 0, "formatting": 0 },
    "summary": "string",
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "mistakes": [
    { "title": "string", "severity": "low|medium|high", "detail": "string", "fix": "string" }
  ],
  "skillGap": {
    "targetRole": "string",
    "matched": ["string"],
    "missing": ["string"],
    "prioritySkills": ["string"]
  },
  "suggestions": ["string"],
  "rewrittenResume": {
    "headline": "string",
    "summary": "string",
    "bulletPoints": ["string"],
    "fullText": "string"
  },
  "jobMatches": [
    {
      "role": "string",
      "score": 0,
      "description": "string",
      "searchQuery": "string",
      "searchUrl": "string",
      "platformLinks": [
        { "platform": "LinkedIn", "url": "https://..." }
      ]
    }
  ],
  "salaryInsights": [
    { "role": "string", "range": "string", "currency": "string", "experienceLevel": "string", "marketTrend": "string", "notes": "string" }
  ],
  "careerRecommendations": [
    { "role": "string", "fitScore": 0, "why": "string", "nextSteps": ["string"], "growthAreas": ["string"] }
  ],
  "coachStarter": ["string"]
}

Use the target role, if provided, to bias the analysis toward relevant roles, skills, salary ranges, and job matches.
For each item in "jobMatches", include practical real-world links in "platformLinks" and prioritize platforms like LinkedIn, Indeed, Glassdoor, and Naukri.
Keep all arrays concise and practical.

Target Role: ${targetRole || "Not provided"}
Resume Text:
${resumeText}`;

  try {
    const data = await generateJsonFromGemini(prompt);
    return normalizeAnalysisResult(data, resumeText, targetRole);
  } catch {
    return defaultFallbackAnalysis(resumeText, targetRole);
  }
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded (field: file)." });
    }

    const parsed = await pdfParse(req.file.buffer);
    const extractedText = (parsed.text || "").trim();

    if (!extractedText) {
      return res.status(400).json({ error: "Unable to extract text from the PDF." });
    }

    return res.json({ text: extractedText });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to parse PDF.",
    });
  }
});

app.post("/api/extract-skills", async (req, res) => {
  try {
    const { resumeText, text } = req.body || {};
    const resolvedResumeText = typeof resumeText === "string" ? resumeText : text;

    if (!resolvedResumeText || typeof resolvedResumeText !== "string") {
      return res
        .status(400)
        .json({ error: "resumeText (or text) is required and must be a string." });
    }

    const prompt = `You are an ATS parser. Analyze the provided resume text and extract skills. Return ONLY a JSON object matching this schema: { "hardSkills": ["skill1", "skill2"], "softSkills": ["skill1", "skill2"] }\n\nResume Text:\n${resolvedResumeText}`;

    const data = await generateJsonFromGemini(prompt);
    const hardSkills = toStringArray(data?.hardSkills);
    const softSkills = toStringArray(data?.softSkills);

    // Include combined skills for frontend compatibility.
    return res.json({
      hardSkills,
      softSkills,
      skills: [...hardSkills, ...softSkills],
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to extract skills.",
    });
  }
});

app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText, text, targetRole, target_role } = req.body || {};
    const resolvedResumeText = typeof resumeText === "string" ? resumeText : text;
    const resolvedTargetRole = coerceString(targetRole, coerceString(target_role));

    if (!resolvedResumeText || typeof resolvedResumeText !== "string") {
      return res.status(400).json({ error: "resumeText (or text) is required and must be a string." });
    }

    const analysis = await generateCareerAnalysis(resolvedResumeText, resolvedTargetRole);
    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to analyze resume." });
  }
});

app.post("/api/rewrite-resume", async (req, res) => {
  try {
    const { resumeText, text, targetRole, focusAreas } = req.body || {};
    const resolvedResumeText = typeof resumeText === "string" ? resumeText : text;
    const resolvedTargetRole = coerceString(targetRole);
    const resolvedFocusAreas = toStringArray(focusAreas);

    if (!resolvedResumeText || typeof resolvedResumeText !== "string") {
      return res.status(400).json({ error: "resumeText (or text) is required and must be a string." });
    }

    const prompt = `You are an expert resume writer.
Rewrite the resume content for the target role, preserving truthful details while improving clarity, structure, and measurable impact.
Return ONLY JSON matching this schema:
{
  "headline": "string",
  "summary": "string",
  "bulletPoints": ["string"],
  "fullText": "string"
}

Target Role: ${resolvedTargetRole || "Not provided"}
Focus Areas: ${JSON.stringify(resolvedFocusAreas)}
Resume Text:
${resolvedResumeText}`;

    const data = await generateJsonFromGemini(prompt);
    return res.json({
      rewrittenResume: {
        headline: coerceString(data?.headline, resolvedTargetRole || "Professional Rewrite"),
        summary: coerceString(data?.summary, "No rewrite summary returned."),
        bulletPoints: toStringArray(data?.bulletPoints),
        fullText: coerceString(data?.fullText, resolvedResumeText),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to rewrite resume." });
  }
});

app.post("/api/career-coach", async (req, res) => {
  try {
    const { messages, resumeText, text, targetRole } = req.body || {};
    const resolvedResumeText = typeof resumeText === "string" ? resumeText : text;
    const resolvedTargetRole = coerceString(targetRole);
    const normalizedMessages = normalizeChatMessages(messages);

    if (!normalizedMessages.length) {
      return res.status(400).json({ error: "messages must be a non-empty array." });
    }

    const latestUserMessage = [...normalizedMessages]
      .reverse()
      .find((message) => message.role === "user")?.content;
    const responseLanguageStyle = detectLanguageStyle(latestUserMessage || "");

    const conversation = normalizedMessages
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join("\n");

    const prompt = `You are a practical AI career coach.
Respond conversationally but keep the answer concise and actionable.
You MUST mirror the user's input language style based on "Reply Language Style".
- If style is "english", reply fully in English.
- If style is "tamil", reply fully in Tamil script.
- If style is "tanglish", reply in Tanglish (Tamil written in English letters), not Tamil script.
Apply the same style rule to both "reply" and "suggestions".
Return ONLY JSON matching this schema:
{
  "reply": "string",
  "suggestions": ["string"]
}

Reply Language Style: ${responseLanguageStyle}
Target Role: ${resolvedTargetRole || "Not provided"}
Resume Context: ${resolvedResumeText ? resolvedResumeText.slice(0, 9000) : "No resume text provided"}
Conversation:
${conversation}`;

    const data = await generateJsonFromGemini(prompt);
    const localizedData = await adaptCoachResponseLanguage(
      {
        reply: coerceString(data?.reply, "I can help with resume edits, role targeting, and skill planning."),
        suggestions: toStringArray(data?.suggestions),
      },
      responseLanguageStyle
    );

    return res.json({
      reply: coerceString(localizedData?.reply, "I can help with resume edits, role targeting, and skill planning."),
      suggestions: toStringArray(localizedData?.suggestions),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to generate coach response." });
  }
});

app.post("/api/match-jobs", async (req, res) => {
  try {
    const { hardSkills, softSkills, skills } = req.body || {};
    const normalizedHardSkills = toStringArray(hardSkills);
    const normalizedSoftSkills = toStringArray(softSkills);
    const normalizedSkills = toStringArray(skills);

    const effectiveHardSkills =
      normalizedHardSkills.length || normalizedSoftSkills.length
        ? normalizedHardSkills
        : normalizedSkills;
    const effectiveSoftSkills =
      normalizedHardSkills.length || normalizedSoftSkills.length ? normalizedSoftSkills : [];

    if (!effectiveHardSkills.length && !effectiveSoftSkills.length) {
      return res.status(400).json({
        error: "Provide hardSkills/softSkills arrays or a skills array.",
      });
    }

    const prompt = `Based on these skills, suggest 3 highly relevant job roles. For each, calculate a mock ATS match score (0-100). Return ONLY a JSON object matching this schema: { "matches": [ { "role": "Job Title", "score": 85, "description": "1 sentence why it fits" } ] }\n\nHard Skills: ${JSON.stringify(
      effectiveHardSkills
    )}\nSoft Skills: ${JSON.stringify(effectiveSoftSkills)}`;

    const data = await generateJsonFromGemini(prompt);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to match jobs.",
    });
  }
});

app.post("/api/skill-gap", async (req, res) => {
  try {
    const { skills, candidate_skills, targetRole, job_title } = req.body || {};
    const resolvedSkills = toStringArray(skills).length
      ? toStringArray(skills)
      : toStringArray(candidate_skills);
    const resolvedTargetRole = typeof targetRole === "string" ? targetRole : job_title;

    if (!resolvedSkills.length || !resolvedTargetRole || typeof resolvedTargetRole !== "string") {
      return res.status(400).json({
        error: "skills (or candidate_skills) and targetRole (or job_title) are required.",
      });
    }

    const prompt = `Compare the provided candidate skills against standard industry requirements for the target role. Identify matched skills and missing critical skills. Return ONLY a JSON object matching this schema: { "matched": ["skill1", "skill2"], "missing": ["skill3", "skill4"] }\n\nTarget Role: ${resolvedTargetRole}\nCandidate Skills: ${JSON.stringify(
      resolvedSkills
    )}`;

    const data = await generateJsonFromGemini(prompt);
    const matched = toStringArray(data?.matched);
    const missing = toStringArray(data?.missing);

    // Return both camelCase and snake_case keys for compatibility.
    return res.json({
      matched,
      missing,
      matched_skills: matched,
      missing_skills: missing,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to analyze skill gap.",
    });
  }
});

app.post("/api/suggestions", async (req, res) => {
  try {
    const { missingSkills, missing_skills, targetRole, target_role } = req.body || {};
    const resolvedMissingSkills = toStringArray(missingSkills).length
      ? toStringArray(missingSkills)
      : toStringArray(missing_skills);
    const resolvedTargetRole = typeof targetRole === "string" ? targetRole : target_role;

    if (!resolvedMissingSkills.length || !resolvedTargetRole || typeof resolvedTargetRole !== "string") {
      return res.status(400).json({
        error: "missingSkills (or missing_skills) and targetRole (or target_role) are required.",
      });
    }

    const prompt = `Given the missing skills for the target role, provide 3 to 5 highly specific, actionable bullet points on how the candidate can bridge this gap (e.g., specific certifications, projects, or keywords to add). Return ONLY a JSON object matching this schema: { "suggestions": ["bullet 1", "bullet 2"] }\n\nTarget Role: ${resolvedTargetRole}\nMissing Skills: ${JSON.stringify(
      resolvedMissingSkills
    )}`;

    const data = await generateJsonFromGemini(prompt);
    return res.json({ suggestions: toStringArray(data?.suggestions) });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to generate suggestions.",
    });
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }

  if (error) {
    return res.status(400).json({ error: error.message || "Request error." });
  }

  return res.status(500).json({ error: "Unknown server error." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
