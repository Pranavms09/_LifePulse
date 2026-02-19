require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testChat(name) {
  console.log(`\n--- Testing model (Chat): ${name} ---`);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: name });
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        { role: "model", parts: [{ text: "Hi there!" }] },
      ],
    });
    const result = await chat.sendMessage("How are you?");
    console.log(`✅ SUCCESS for ${name} (Chat)`);
    console.log(
      "Response starts with:",
      result.response.text().substring(0, 50),
    );
  } catch (e) {
    console.error(`❌ FAILED for ${name} (Chat)`);
    console.error("Error Message:", e.message);
  }
}

async function run() {
  await testChat("gemini-2.5-flash");
}

run();
