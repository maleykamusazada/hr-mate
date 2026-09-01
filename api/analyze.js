export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Yalnız POST metoduna icazə verilir" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server konfiqurasiya xətası: API açarı tapılmadı" });
    return;
  }

  const { parts } = req.body;
  if (!parts) {
    res.status(400).json({ error: "parts sahəsi tələb olunur" });
    return;
  }

  try {
    const model = "gemini-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || "Gemini API xətası" });
      return;
    }

    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "Serverdə gözlənilməz xəta baş verdi" });
  }
}
