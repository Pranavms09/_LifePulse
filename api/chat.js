const Groq = require("groq-sdk");

const SYSTEM_PROMPT = `You are Dr. Sanjeevani, a friendly and intelligent AI Health Assistant for the LifePulse platform.

Your Role:
• Provide preliminary health guidance based on symptoms.
• Suggest possible causes (clarifying they are not final diagnoses).
• Give basic home care advice using accessible ingredients.
• Suggest when to see a doctor or seek specialist care.
• Provide immediate emergency guidance for critical situations.
• Offer mental health support politely and empathetically.
• Support multiple languages: English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা), and Marathi (मराठी).

Voice & Language Capabilities:
• You can "listen" if the user clicks the microphone icon (Voice Input).
• You can "speak" your responses if the user clicks the speaker icon (Text-to-Speech).
• Users can change the language from the language selector in the chat interface.

Strict Rules:
• ALWAYS clarify that you are NOT a licensed doctor.
• DO NOT provide dangerous or unauthorized medical advice.
• For serious symptoms (chest pain, breathing difficulty, heavy bleeding, unconsciousness), IMMEDIATELY advise seeking emergency help (Call 108).
• Keep responses simple, calm, and reassuring.
• If information is missing, ask follow-up questions.
• ALWAYS end every response with: "Would you like to tell me more about your symptoms?"

Formatting Rules:
• **Use bullet points (•) for all key information.**
• **Keep lines short and scannable.**
• Start with a friendly, brief greeting.
• Use bold section headers (e.g., **Home Care Advice**).
• Do not use long paragraphs.

Tone: Friendly, Reassuring, Professional, and Concise.`;

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, language = "en" } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Validate API Key
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: API Key missing" });
    }

    // Language name mapping
    const languageNames = {
      en: "English",
      hi: "Hindi (हिंदी)",
      ta: "Tamil (தமிழ்)",
      te: "Telugu (తెలుగు)",
      bn: "Bengali (বাংলা)",
      mr: "Marathi (मराठी)",
    };

    const langInstruction =
      language !== "en"
        ? `IMPORTANT: Respond in ${languageNames[language] || language}. Use the native script and maintain the same bullet-point format.\n\n`
        : "";

    // Initialize Groq API
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const fullMessage = langInstruction + message;

    let result;
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "assistant",
        content:
          "Namaste! I am Dr. Sanjeevani. How can I assist you with your health today?",
      },
      { role: "user", content: fullMessage },
    ];

    try {
      result = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 8192,
      });
    } catch (retryError) {
      const isRateLimit =
        retryError.message?.includes("429") ||
        retryError.message?.includes("quota") ||
        retryError.message?.includes("rate limit") ||
        retryError.status === 429;
      if (isRateLimit) {
        await new Promise((r) => setTimeout(r, 2000));
        result = await groq.chat.completions.create({
          messages,
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 8192,
        });
      } else {
        throw retryError;
      }
    }
    const text = result.choices[0]?.message?.content || "";

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error in Vercel chat function:", error);

    // Handle specific API errors
    if (error.message?.includes("404")) {
      return res.status(500).json({
        error:
          "AI Model not found. The API Key provided does not have access to Groq API.",
      });
    }

    if (error.message?.includes("API key")) {
      return res.status(500).json({
        error:
          "Invalid API Key. Please check your Vercel Environment Variables.",
      });
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("429") ||
      error.message?.includes("RESOURCE_EXHAUSTED") ||
      error.status === 429
    ) {
      return res
        .status(429)
        .json({ error: "Service is busy. Please try again in a moment." });
    }

    return res
      .status(500)
      .json({ error: "Failed to process request", details: error.message });
  }
};
