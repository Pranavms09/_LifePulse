const Groq = require("groq-sdk");

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
    const { image } = req.body || {}; // Expecting base64 string

    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

    // Validate API Key
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: API Key missing" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
            Analyze this medicine image (strip, bottle, or packet).
            Extract the following information and return it in a structured JSON format:
            {
                "medicineName": "string",
                "composition": "string",
                "suitableAgeGroup": "string",
                "medicalUses": ["string"],
                "recommendedDosage": "string",
                "dosageFrequency": "string",
                "typicalSchedule": "string",
                "whenToTake": "string",
                "commonSideEffects": ["string"],
                "safetyPrecautions": ["string (inc. who should avoid, critical warnings)"],
                "storageInstructions": "string"
            }
            CRITICAL: Avoid repeating information across fields. Combine specific warnings and 'who should avoid' into 'safetyPrecautions'.
            If common medicine, provide accurate details based on standard medical knowledge.
            If not a medicine or unreadable, return: { "error": "No medicine detected" }
            
            IMPORTANT: Return ONLY valid JSON. No markdown code blocks.
        `;

    // Prepare image data for Gemini
    const match = image.match(/^data:(image\/\w+);base64,/);
    const mimeType = match ? match[1] : "image/jpeg";
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Data}`,
              },
            },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-instruct",
      temperature: 0.7,
      max_tokens: 8192,
    });

    const text = result.choices[0]?.message?.content || "";

    // Extract JSON from the response text (handling potential markdown formatting)
    let jsonStr = text;
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0].trim();
    }

    let medicalData;
    try {
      medicalData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", text);
      return res
        .status(500)
        .json({ error: "Failed to process AI response", raw: text });
    }

    return res.status(200).json(medicalData);
  } catch (error) {
    const errMsg = error.message || "";
    const errStatus = error.status || error.statusCode || 0;
    console.error(
      "Error in medicine analysis function:",
      errMsg,
      "| Status:",
      errStatus,
    );

    // Rate limit / quota exceeded
    if (
      errMsg.includes("quota") ||
      errMsg.includes("429") ||
      errMsg.includes("RESOURCE_EXHAUSTED") ||
      errStatus === 429
    ) {
      return res.status(429).json({
        error: "API quota exceeded. Please wait a minute and try again.",
      });
    }

    // Model not found
    if (
      errMsg.includes("404") ||
      errMsg.includes("not found") ||
      errStatus === 404
    ) {
      return res.status(500).json({
        error: "AI model unavailable. Please contact support.",
        details: errMsg,
      });
    }

    return res
      .status(500)
      .json({ error: "Failed to process request", details: errMsg });
  }
};
