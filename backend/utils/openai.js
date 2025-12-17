import OpenAI from "openai";
import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or another model like "gpt-4.1-mini"
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    };

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return "Sorry, I couldn’t get a response from OpenAI.";
    }
    return data.choices[0].message.content; // reply from openai assitant
  } catch (err) {
    console.error("Error fetching response from OpenAI:", err);
    return "Sorry, something went wrong while connecting to OpenAI.";
  }
};

export default getOpenAIAPIResponse;

// how the req. res. flow works....
/*

[User] 
   ↓ (POST request)
[Frontend JS] → /api/chat → [Express Backend]
   ↓ (fetch to OpenAI)
[OpenAI API] → generates response
   ↓
[Backend sends it back via res.send()]
   ↓
[Frontend displays it to user]

*/
