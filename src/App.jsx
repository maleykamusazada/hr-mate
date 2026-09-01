            import React, { useState, useEffect, useRef } from "react";
import * as mammoth from "mammoth";

const FONT_SERIF = "'Libre Baskerville', Georgia, serif";
const FONT_SANS = "'Inter', system-ui, sans-serif";

const C = {
  bg: "#F7F4EC",
  card: "#FFFFFF",
  ink: "#1E2A22",
  green: "#2F4A3E",
  greenDeep: "#16261E",
  greenBright: "#3E7A5D",
  gold: "#C99B4E",
  goldSoft: "#F6E8CE",
  coral: "#E0703F",
  border: "#E6DFCC",
  muted: "#767A6E",
  danger: "#C1553E",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function scoreTheme(score) {
  if (score >= 80) return { bg: "#E4F1E1", text: "#1E5C3B", border: "#B6DCB0", bar: "linear-gradient(90deg,#3E7A5D,#2F4A3E)" };
  if (score >= 60) return { bg: "#FBF0D9", text: "#8A5F1E", border: "#EBD299", bar: "linear-gradient(90deg,#E6B65C,#C99B4E)" };
  return { bg: "#FAE7E1", text: "#A5432D", border: "#E9BDAC", bar: "linear-gradient(90deg,#E0703F,#C1553E)" };
}

function fileIcon(type) {
  if (type === "pdf") return "📕";
  if (type === "docx") return "📘";
  return "📄";
}

function emptyCandidate() {
  return { id: uid(), name: "", fileName: "", fileType: "", textContent: "", base64: "", status: "empty" };
}

async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "txt") {
    const text = await file.text();
    return { fileType: "txt", textContent: text, base64: "" };
  }
  if (ext === "docx") {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return { fileType: "docx", textContent: result.value, base64: "" };
  }
  if (ext === "pdf") {
    const dataUrl = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(new Error("Oxuma xətası"));
      r.readAsDataURL(file);
    });
    const base64 = dataUrl.split(",")[1];
    return { fileType: "pdf", textContent: "", base64 };
  }
  throw new Error("unsupported");
}

function ScoreBar({ score }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 60);
    return () => clearTimeout(t);
  }, [score]);
  const theme = scoreTheme(score);
  return (
    <div style={{ height: 8, background: "#EDE8D8", borderRadius: 20, overflow: "hidden", marginTop: 8 }}>
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: theme.bar,
          borderRadius: 20,
          transition: "width 900ms cubic-bezier(.22,1,.36,1)",
        }}
      />
    </div>
  );
}

export default function HRMate() {
  const [screen, setScreen] = useState("cv");

  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        background: C.bg,
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      <Header screen={screen} setScreen={setScreen} />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 18px 60px" }}>
        {screen === "cv" ? <CVScreen /> : <InterviewScreen />}
      </div>
    </div>
  );
}

function Header({ screen, setScreen }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${C.greenDeep} 0%, ${C.green} 55%, ${C.greenBright} 100%)`,
        padding: "28px 18px 22px",
        marginBottom: 22,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(201,155,78,0.18)",
        }}
      />
      <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, color: C.gold, fontWeight: 700, marginBottom: 6 }}>
          HR MATE
        </div>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 400,
            fontSize: 25,
            color: "#FFFDF8",
            margin: "0 0 18px",
            lineHeight: 1.3,
          }}
        >
          {screen === "cv" ? "Ən uyğun namizədi tap" : "Müsahibə sualları bankı"}
        </h1>
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 30,
            padding: 4,
            gap: 4,
          }}
        >
          <TabBtn active={screen === "cv"} onClick={() => setScreen("cv")} label="CV skrininqi" icon="🗂️" />
          <TabBtn active={screen === "interview"} onClick={() => setScreen("interview")} label="Müsahibə suallari" icon="💬" />
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: "none",
        borderRadius: 24,
        padding: "10px 8px",
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
        background: active ? "#FFFDF8" : "transparent",
        color: active ? C.greenDeep : "#F1EFE4",
        transition: "all 200ms ease",
      }}
    >
      <span style={{ marginRight: 6 }}>{icon}</span>
      {label}
    </button>
  );
}

function CVScreen() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [candidates, setCandidates] = useState([emptyCandidate(), emptyCandidate()]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputs = useRef({});

  function addCandidate() {
    setCandidates((cs) => [...cs, emptyCandidate()]);
  }
  function removeCandidate(id) {
    setCandidates((cs) => cs.filter((c) => c.id !== id));
  }
  function updateName(id, name) {
    setCandidates((cs) => cs.map((c) => (c.id === id ? { ...c, name } : c)));
  }

  async function onFilePicked(id, file) {
    setCandidates((cs) => cs.map((c) => (c.id === id ? { ...c, status: "loading", fileName: file.name } : c)));
    try {
      const parsed = await readFile(file);
      setCandidates((cs) =>
        cs.map((c) => (c.id === id ? { ...c, ...parsed, status: "ready", fileName: file.name } : c))
      );
    } catch (e) {
      setCandidates((cs) =>
        cs.map((c) => (c.id === id ? { ...c, status: "error", fileName: file.name } : c))
      );
    }
  }

  async function analyze() {
    setError("");
    if (!jobDesc.trim()) {
      setError("Əvvəlcə vakansiya təsvirini daxil et.");
      return;
    }
    const valid = candidates.filter((c) => c.status === "ready");
    if (valid.length === 0) {
      setError("Ən azı bir namizədin CV faylını yüklə.");
      return;
    }
  setLoading(true);
    setResults(null);

    try {
      const parts = [
        {
          text: `Sən təcrübəli HR / Talent Acquisition mütəxəssisisən. Aşağıdakı vakansiyaya uyğun olaraq hər namizədin CV-sini qiymətləndir.\n\nVAKANSİYA: ${jobTitle || "Qeyd olunmayıb"}\nTƏSVİR:\n${jobDesc.trim()}\n\nAşağıda namizədlərin CV-ləri veriləcək (mətn və ya sənəd formatında).`,
        },
      ];

      valid.forEach((c, i) => {
        parts.push({ text: `\n--- NAMİZƏD ${i + 1} (id: ${c.id}) - ${c.name || c.fileName} ---` });
        if (c.fileType === "pdf") {
          parts.push({ inlineData: { mimeType: "application/pdf", data: c.base64 } });
        } else {
          parts.push({ text: c.textContent });
        }
      });

      parts.push({
        text: `\nHər namizəd üçün JSON obyekti qaytar. Cavab YALNIZ JSON array formatında olsun:

[
  {
    "id": "namizədin id-si (yuxarıda verilən id ilə eyni olsun)",
    "name": "namizədin adı",
    "score": 0-100 arası tam ədəd,
    "verdict": "Güclü uyğunluq" | "Orta uyğunluq" | "Zəif uyğunluq",
    "strengths": ["qısa güclü tərəf 1", "qısa güclü tərəf 2", "qısa güclü tərəf 3"],
    "gaps": ["qısa boşluq 1", "qısa boşluq 2"],
    "summary": "1-2 cümləlik qiymətləndirmə"
  }
]

Bütün mətnlər Azərbaycan dilində olsun. score real təhlilə əsaslansın.`,
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parts }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || "Server xətası");
      }

      const data = await response.json();
      const rawText = data.text;
      if (!rawText) throw new Error("Cavab alınmadı");
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const merged = parsed.map((r) => {
        const orig = valid.find((c) => c.id === r.id);
        return { ...r, name: r.name || orig?.name || orig?.fileName };
      });
      merged.sort((a, b) => b.score - a.score);
      setResults(merged);
    } catch (e) {
      console.error(e);
      setError("Təhlil zamanı xəta baş verdi. Yenidən cəhd et.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionLabel>Vakansiya</SectionLabel>
      <div style={cardStyle}>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Vakansiyanın adı, məs: Senior Frontend Developer"
          style={inputStyle}
        />
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Tələb olunan bacarıqlar, təcrübə, öhdəliklər..."
          rows={5}
          style={{ ...inputStyle, marginBottom: 0, resize: "vertical", lineHeight: 1.55 }}
        />
      </div>

      <SectionLabel>Namizədlər</SectionLabel>
      {candidates.map((c, idx) => (
        <div key={c.id} style={{ ...cardStyle, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
            <input
              value={c.name}
              onChange={(e) => updateName(c.id, e.target.value)}
              placeholder={`Namizəd ${idx + 1} adı (istəyə bağlı)`}
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
            {candidates.length > 1 && (
              <button onClick={() => removeCandidate(c.id)} aria-label="Sil" style={removeBtnStyle}>
                ✕
              </button>
            )}
          </div>

          <input
            ref={(el) => (fileInputs.current[c.id] = el)}
            type="file"
            accept=".pdf,.docx,.txt"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && onFilePicked(c.id, e.target.files[0])}
          />

          {c.status === "empty" && (
            <button onClick={() => fileInputs.current[c.id]?.click()} style={dropZoneStyle}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>⬆️</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.green }}>CV faylını yüklə</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>PDF, Word (.docx) və ya .txt</div>
            </button>
          )}

          {c.status === "loading" && (
            <div style={{ ...dropZoneStyle, borderStyle: "solid" }}>
              <div style={{ fontSize: 13.5, color: C.muted }}>{c.fileName} oxunur...</div>
            </div>
          )}

          {c.status === "ready" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#EEF5EE",
                border: `1px solid #C9DEC5`,
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <span style={{ fontSize: 20 }}>{fileIcon(c.fileType)}</span>
              <span style={{ fontSize: 13, color: C.green, fontWeight: 600, flex: 1, wordBreak: "break-all" }}>
                {c.fileName}
              </span>
              <button onClick={() => fileInputs.current[c.id]?.click()} style={swapBtnStyle}>
                Dəyiş
              </button>
            </div>
          )}

          {c.status === "error" && (
            <div
              style={{
                background: "#FAE7E1",
                border: `1px solid #E9BDAC`,
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 12.5,
                color: C.danger,
              }}
            >
              {c.fileName} oxuna bilmədi. Dəstəklənən formatlar: PDF, DOCX, TXT.
              <button onClick={() => fileInputs.current[c.id]?.click()} style={{ ...swapBtnStyle, marginTop: 6 }}>
                Yenidən yüklə
              </button>
            </div>
          )}
        </div>
      ))}

      <button onClick={addCandidate} style={addBtnStyle}>
        + Namizəd əlavə et
      </button>

      {error && <div style={errorBoxStyle}>{error}</div>}

      <button onClick={analyze} disabled={loading} style={{ ...analyzeBtnStyle, opacity: loading ? 0.75 : 1 }}>
        {loading ? "Təhlil edilir..." : "🔍  Namizədləri təhlil et"}
      </button>

      {results && (
        <div style={{ marginTop: 30 }}>
          <SectionLabel>Nəticələr · uyğunluq sırası ilə</SectionLabel>
          {results.map((r, i) => {
            const theme = scoreTheme(r.score);
            return (
              <div
                key={r.id || i}
                style={{
                  ...cardStyle,
                  marginBottom: 14,
                  border: i === 0 ? `2px solid ${C.green}` : `1px solid ${C.border}`,
                  position: "relative",
                }}
              >
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: -11,
                      left: 16,
                      background: `linear-gradient(90deg, ${C.green}, ${C.greenBright})`,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      padding: "4px 12px",
                      borderRadius: 20,
                    }}
                  >
                    ⭐ ƏN UYĞUN
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: i === 0 ? 8 : 0 }}>
                  <div>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 17.5, color: C.greenDeep }}>{r.name}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{r.verdict}</div>
                  </div>
                  <div
                    style={{
                      background: theme.bg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10,
                      padding: "5px 11px",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {r.score}
                  </div>
                </div>

                <ScoreBar score={r.score} />

                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.ink, margin: "12px 0" }}>{r.summary}</p>

                {r.strengths?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.greenBright, marginBottom: 4 }}>
                      ✓ GÜCLÜ TƏRƏFLƏR
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                      {r.strengths.map((s, j) => (
                        <li key={j}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {r.gaps?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.danger, marginBottom: 4 }}>
                      ⚠ BOŞLUQLAR
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                      {r.gaps.map((g, j) => (
                        <li key={j}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
          </div>
    </div>
  );
}

const CATEGORIES = [

  { key: "general", label: "Ümumi / Davranış", color: "#2F4A3E", bg: "#E4F1E1" },
  { key: "leadership", label: "Liderlik", color: "#8A5F1E", bg: "#FBF0D9" },
  { key: "sales", label: "Satış", color: "#A5432D", bg: "#FAE0D6" },
  { key: "marketing", label: "Marketinq", color: "#8C2F63", bg: "#F8E2EE" },
  { key: "it", label: "IT / Texnologiya", color: "#1F5A8A", bg: "#DFEBF7" },
  { key: "finance", label: "Maliyyə", color: "#1E6B5C", bg: "#DCF0EA" },
  { key: "cs", label: "Müştəri xidməti", color: "#5B4A9E", bg: "#E9E4F7" },
  { key: "hr", label: "HR", color: "#16261E", bg: "#E3E7E2" },
  { key: "ba", label: "Biznes analitika", color: "#3A5A9E", bg: "#E2E9F7" },
  { key: "esg", label: "ESG", color: "#3D7A3E", bg: "#E1F0DE" },
  { key: "ta", label: "İstedadların cəlbi", color: "#B0562F", bg: "#FBE6D9" },
];

const QUESTIONS = [
  { c: "general", q: "Özünüzdən və peşəkar yolunuzdan qısaca danışın." },
  { c: "general", q: "Sizin üçün ən böyük peşəkar nailiyyət nə olub və niyə?" },
  { c: "general", q: "Komandada işlədiyiniz çətin bir konflikti necə həll etdiniz?" },
  { c: "general", q: "Uğursuz olduğunuz bir layihədən nə öyrəndiniz?" },
  { c: "general", q: "Eyni vaxtda bir neçə prioriteti necə idarə edirsiniz?" },
  { c: "general", q: "Bu vəzifəyə niyə maraq göstərirsiniz və 3 ildən sonra özünüzü harada görürsünüz?" },
  { c: "leadership", q: "Komandanı çətin bir dəyişiklik prosesindən necə keçirmisiniz?" },
  { c: "leadership", q: "Zəif performans göstərən bir işçiyə necə yanaşırsınız?" },
  { c: "leadership", q: "Qərar qəbul edərkən komandanın fikrini nə dərəcədə nəzərə alırsınız?" },
  { c: "leadership", q: "Komanda üzvləri arasında münaqişəni necə həll edirsiniz?" },
  { c: "leadership", q: "Delegasiya (tapşırıq bölgüsü) prinsipiniz nədir?" },
  { c: "leadership", q: "Uzaqdan işləyən komandanı necə motivasiya edirsiniz?" },
  { c: "sales", q: "Sizə 'yox' deyən müştərini necə inandırırsınız?" },
  { c: "sales", q: "Satış hədəflərinizə çatmadığınız zaman nə edirsiniz?" },
  { c: "sales", q: "Uzun satış tsiklini necə idarə edirsiniz?" },
  { c: "sales", q: "Ən çətin qapadığınız satışı təsvir edin." },
  { c: "sales", q: "Müştəri etirazlarına (objection) necə cavab verirsiniz?" },
  { c: "marketing", q: "Uğurlu bir kampaniyanı necə ölçürsünüz — hansı KPI-lara baxırsınız?" },
  { c: "marketing", q: "Məhdud büdcə ilə maksimum nəticəyə necə nail olursunuz?" },
  { c: "marketing", q: "Brend mesajını fərqli auditoriyalar üçün necə uyğunlaşdırırsınız?" },
  { c: "marketing", q: "A/B test aparmağa hansı yanaşmanız var?" },
  { c: "marketing", q: "Sosial media və SEO strategiyanızda nələrə üstünlük verirsiniz?" },
  { c: "it", q: "Kod keyfiyyətini necə təmin edirsiniz — test, code review prosesi?" },
  { c: "it", q: "İstehsalda (production) kritik bir bug tapdıqda addımlarınız nədir?" },
  { c: "it", q: "Texniki borcu (technical debt) necə idarə edirsiniz?" },
  { c: "it", q: "Yeni bir texnologiyanı necə öyrənirsiniz — son öyrəndiyiniz nə idi?" },
  { c: "it", q: "Sistemin performansını necə optimallaşdırmısınız — konkret bir nümunə verin." },
  { c: "it", q: "Agile/Scrum prosesində rolunuz necə olub?" },
  { c: "finance", q: "Büdcə planlaşdırmasında ən çox hansı metodologiyaya güvənirsiniz?" },
  { c: "finance", q: "Maliyyə hesabatlarında uyğunsuzluq tapdıqda necə hərəkət edirsiniz?" },
  { c: "finance", q: "Xərcləri necə optimallaşdırmısınız — konkret nəticə ilə misal verin." },
  { c: "finance", q: "Riskin qiymətləndirilməsinə yanaşmanız nədir?" },
  { c: "finance", q: "Audit prosesində iştirakınız necə olub?" },
  { c: "cs", q: "Qəzəbli bir müştəri ilə necə davranırsınız?" },
  { c: "cs", q: "Eyni problemi dəfələrlə həll etməli olduqda motivasiyanızı necə saxlayırsınız?" },
  { c: "cs", q: "Müştəri məmnuniyyətini necə ölçürsünüz?" },
  { c: "cs", q: "Şirkət siyasətinə uyğun olmayan bir tələbi olan müştəriyə necə yanaşırsınız?" },
  { c: "cs", q: "Bir müştərini itirdiyiniz halı təsvir edin — nə fərqli edərdiniz?" },
  { c: "hr", q: "Namizədin mədəni uyğunluğunu (culture fit) necə qiymətləndirirsiniz?" },
  { c: "hr", q: "İşdən çıxma prosesini (offboarding) necə həssaslıqla idarə edirsiniz?" },
  { c: "hr", q: "Çətin bir işə qəbul prosesini təsvir edin — nə öyrəndiniz?" },
  { c: "hr", q: "İşçi münasibətlərində qərəzsizliyi necə təmin edirsiniz?" },
  { c: "hr", q: "Performans qiymətləndirməsi prosesinə yanaşmanız nədir?" },
  { c: "hr", q: "Yeni işçinin adaptasiyasını (onboarding) necə effektiv edirsiniz?" },
  { c: "ba", q: "Bir biznes probleminin kök səbəbini necə müəyyən edirsiniz?" },
  { c: "ba", q: "Tələblərin toplanması (requirements gathering) prosesinizi təsvir edin." },
  { c: "ba", q: "Maraqlı tərəflər (stakeholders) arasında ziddiyyətli tələbləri necə həll edirsiniz?" },
  { c: "ba", q: "Məlumat əsasında (data-driven) bir tövsiyəni necə formalaşdırdınız — konkret misal verin." },
  { c: "ba", q: "SWOT və ya digər analitik çərçivələrdən necə istifadə edirsiniz?" },
  { c: "ba", q: "Bir prosesi necə xəritələndirirsiniz (process mapping) və təkmilləşdirmə təklif edirsiniz?" },
  { c: "esg", q: "ESG hesabatlılığında hansı standartlarla (GRI, SASB, TCFD) işləmisiniz?" },
  { c: "esg", q: "Bir şirkətdə davamlılıq (sustainability) strategiyasını necə formalaşdırardınız?" },
  { c: "esg", q: "Karbon izinin ölçülməsi və azaldılmasına yanaşmanız nədir?" },
  { c: "esg", q: "Sosial təsir (social impact) layihələrini necə qiymətləndirirsiniz?" },
  { c: "esg", q: "Korporativ idarəetmə (governance) risklərini necə müəyyən edirsiniz?" },
  { c: "esg", q: "Maraqlı tərəflərlə (investorlar, tənzimləyicilər) ESG mövzusunda necə ünsiyyət qurursunuz?" },
  { c: "ta", q: "Passiv namizədləri (passive candidates) necə tapıb cəlb edirsiniz?" },
  { c: "ta", q: "İşəgötürən brendini (employer branding) gücləndirmək üçün nə edirsiniz?" },
  { c: "ta", q: "Çətin doldurulan (hard-to-fill) vakansiyaya yanaşmanız necədir?" },
  { c: "ta", q: "Namizəd təcrübəsini (candidate experience) necə yaxşılaşdırırsınız?" },
  { c: "ta", q: "İşə qəbul metriklərini (time-to-hire, cost-per-hire) necə izləyirsiniz?" },
  { c: "ta", q: "Sourcing üçün hansı alət və platformalardan istifadə edirsiniz?" },
];

function InterviewScreen() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.c === active);

  return (
    <div>
      <SectionLabel>Sahəyə görə süz</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <Chip label="Hamısı" active={active === "all"} onClick={() => setActive("all")} color={C.green} bg="#EAE7DC" />
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.key}
            label={cat.label}
            active={active === cat.key}
            onClick={() => setActive(cat.key)}
            color={cat.color}
            bg={cat.bg}
          />
        ))}
      </div>

      <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14 }}>
        {filtered.length} sual {active !== "all" ? `· ${CATEGORIES.find((c) => c.key === active)?.label}` : ""}
      </div>

      {filtered.map((item, i) => {
        const cat = CATEGORIES.find((c) => c.key === item.c);
        return (
          <div
            key={i}
            style={{
              background: C.card,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 10,
              borderLeft: `4px solid ${cat.color}`,
              boxShadow: "0 1px 3px rgba(30,42,34,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: cat.color,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              {cat.label}
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: C.ink }}>{item.q}</div>
          </div>
        );
      })}
    </div>
  );
}

function Chip({ label, active, onClick, color, bg }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? color : C.border}`,
        background: active ? bg : "#fff",
        color: active ? color : C.muted,
        fontSize: 12.5,
        fontWeight: 600,
        padding: "7px 13px",
        borderRadius: 20,
        cursor: "pointer",
        transition: "all 150ms ease",
      }}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 12, letterSpacing: 1, color: C.gold, fontWeight: 700, marginBottom: 10 }}>
      {children.toString().toUpperCase()}
    </div>
  );
}

const cardStyle = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 16,
  marginBottom: 22,
  boxShadow: "0 2px 8px rgba(30,42,34,0.05)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${C.border}`,
  borderRadius: 9,
  padding: "10px 12px",
  fontSize: 14,
  background: "#FDFCF8",
  color: C.ink,
  marginBottom: 10,
  outline: "none",
  fontFamily: FONT_SANS,
};

const dropZoneStyle = {
  width: "100%",
  border: `1.5px dashed ${C.gold}`,
  background: C.goldSoft,
  borderRadius: 10,
  padding: "18px 12px",
  textAlign: "center",
  cursor: "pointer",
};

const addBtnStyle = {
  width: "100%",
  padding: "11px",
  background: "transparent",
  border: `1.5px dashed ${C.gold}`,
  borderRadius: 10,
  color: "#8A5F2E",
  fontSize: 13.5,
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: 6,
};

const removeBtnStyle = {
  border: "none",
  background: "transparent",
  color: C.muted,
  fontSize: 15,
  cursor: "pointer",
  padding: "4px 8px",
};

const swapBtnStyle = {
  border: `1px solid ${C.green}`,
  background: "#fff",
  color: C.green,
  fontSize: 11.5,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

const errorBoxStyle = {
  marginTop: 14,
  padding: "10px 12px",
  background: "#FAE7E1",
  border: `1px solid #E9BDAC`,
  borderRadius: 10,
  color: C.danger,
  fontSize: 13.5,
};

const analyzeBtnStyle = {
  width: "100%",
  marginTop: 16,
  padding: "14px",
  background: `linear-gradient(90deg, ${C.green}, ${C.greenBright})`,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: 0.2,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(47,74,62,0.25)",
};


