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

  const parts = req.body.parts;
  if (!parts) {
    res.status(400).json({ error: "parts sahəsi tələb olunur" });
    return;
  }

  const model = "gemini-3.5-flash-lite";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: parts }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const status = response.status;
        if ((status === 503 || status === 429) && attempt < maxAttempts) {
          const waitMs = attempt * 1500;
          await new Promise(function (resolve) { setTimeout(resolve, waitMs); });
          lastError = (data.error && data.error.message) || "Model müvəqqəti məşğuldur";
          continue;
        }
        res.status(status).json({ error: (data.error && data.error.message) || "Gemini API xətası" });
        return;
      }

      let text = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        text = data.candidates[0].content.parts.map(function (p) { return p.text || ""; }).join("");
      }
      res.status(200).json({ text: text });
      return;
    } catch (err) {
      lastError = err.message || "Naməlum xəta";
      if (attempt < maxAttempts) {
        await new Promise(function (resolve) { setTimeout(resolve, attempt * 1000); });
        continue;
      }
    }
  }

  res.status(503).json({ error: "Model bir neçə cəhddən sonra da cavab vermədi: " + lastError });
}
