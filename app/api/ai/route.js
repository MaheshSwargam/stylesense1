export async function POST(request) {
  try {
    const { prompt, imageDescription } = await request.json();

    if (!prompt && !imageDescription) {
      return Response.json(
        { error: "Please provide a prompt or image description" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are StyleSense, an expert fashion and style advisor. You provide personalized style recommendations, outfit suggestions, and fashion advice. Be friendly, specific, and helpful. Consider factors like:
- Current fashion trends
- Body type considerations
- Occasion appropriateness
- Color coordination
- Personal style preferences
- Season and weather
Keep responses concise but helpful.`;

    const userMessage = imageDescription
      ? `Based on this outfit/clothing description: "${imageDescription}". ${prompt || "Please provide style recommendations and suggestions."}`
      : prompt;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      return Response.json(
        { error: "Failed to get style recommendations" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const recommendation = data.choices[0]?.message?.content || "Unable to generate recommendations.";

    return Response.json({ recommendation });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}