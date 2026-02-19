require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel(name) {
  console.log(`\n--- Testing model: ${name} ---`);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: name });
    const result = await model.generateContent("Hello");
    console.log(`✅ SUCCESS for ${name}`);
    console.log(
      "Response starts with:",
      result.response.text().substring(0, 50),
    );
  } catch (e) {
    console.error(`❌ FAILED for ${name}`);
    console.error("Error Message:", e.message);
    if (e.status) console.error("Status Code:", e.status);
  }
}

async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-1.5-flash-latest");
  await testModel("gemini-2.0-flash-exp");
  await testModel("gemini-2.5-flash"); // User specified
}

run();
