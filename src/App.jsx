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

function ScoreBar(props) {
  const score = props.score;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 60);
    return () => clearTimeout(t);
  }, [score]);
  const theme = scoreTheme(score);
  return (
    <div style={{ height: 8, background: "#EDE8D8", borderRadius: 20, overflow: "hidden", marginTop: 8 }}>
      <div style={{ height: "100%", width: width + "%", background: theme.bar, borderRadius: 20, transition: "width 900ms cubic-bezier(.22,1,.36,1)" }} />
    </div>
  );
}

/* ============================= TOP-LEVEL APP ============================= */

const TABS = [
  { key: "cv", label: "CV skrininqi", icon: "🔍" },
  { key: "interview", label: "Müsahibə sualları", icon: "💬" },
  { key: "laborcode", label: "Əmək Məcəlləsi", icon: "⚖️" },
  { key: "handbook", label: "HR kitabçası", icon: "📗" },
  { key: "kpi", label: "KPI & 360°", icon: "🎯" },
];

const TAB_TITLES = {
  cv: "Ən uyğun namizədi tap",
  interview: "Müsahibə sualları bankı",
  laborcode: "Əmək Məcəlləsi bələdçisi",
  handbook: "HR stolüstü kitabçası",
  kpi: "KPI çərçivəsi və 360° qiymətləndirmə",
};

export default function HRMate() {
  const [screen, setScreen] = useState("cv");
  return (
    <div style={{ fontFamily: FONT_SANS, background: C.bg, minHeight: "100%", boxSizing: "border-box" }}>
      <Header screen={screen} setScreen={setScreen} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 18px 60px" }}>
        {screen === "cv" && <CVScreen />}
        {screen === "interview" && <InterviewScreen />}
        {screen === "laborcode" && <LaborCodeScreen />}
        {screen === "handbook" && <HandbookScreen />}
        {screen === "kpi" && <KpiScreen />}
      </div>
    </div>
  );
}

function Header(props) {
  const screen = props.screen;
  const setScreen = props.setScreen;
  return (
    <div
      style={{
        background: "linear-gradient(135deg, " + C.greenDeep + " 0%, " + C.green + " 55%, " + C.greenBright + " 100%)",
        padding: "28px 18px 22px",
        marginBottom: 22,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(201,155,78,0.18)" }} />
      <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, color: C.gold, fontWeight: 700, marginBottom: 6 }}>HR MATE</div>
        <h1 style={{ fontFamily: FONT_SERIF, fontWeight: 400, fontSize: 23, color: "#FFFDF8", margin: "0 0 18px", lineHeight: 1.3 }}>
          {TAB_TITLES[screen]}
        </h1>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.12)", borderRadius: 30, padding: 4, gap: 4, overflowX: "auto" }}>
          {TABS.map(function (t) {
            return <TabBtn key={t.key} active={screen === t.key} onClick={function () { setScreen(t.key); }} label={t.label} icon={t.icon} />;
          })}
        </div>
      </div>
    </div>
  );
}

function TabBtn(props) {
  return (
    <button
      onClick={props.onClick}
      style={{
        flex: "1 0 auto",
        border: "none",
        borderRadius: 24,
        padding: "10px 12px",
        fontSize: 12.5,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        background: props.active ? "#FFFDF8" : "transparent",
        color: props.active ? C.greenDeep : "#F1EFE4",
        transition: "all 200ms ease",
      }}
    >
      <span style={{ marginRight: 6 }}>{props.icon}</span>
      {props.label}
    </button>
  );
}

/* ============================= CV SCREEN (unchanged logic) ============================= */

function CVScreen() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [candidates, setCandidates] = useState([emptyCandidate(), emptyCandidate()]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputs = useRef({});

  function addCandidate() {
    setCandidates(function (cs) { return cs.concat([emptyCandidate()]); });
  }
  function removeCandidate(id) {
    setCandidates(function (cs) { return cs.filter(function (c) { return c.id !== id; }); });
  }
  function updateName(id, name) {
    setCandidates(function (cs) {
      return cs.map(function (c) { return c.id === id ? Object.assign({}, c, { name: name }) : c; });
    });
  }
  async function onFilePicked(id, file) {
    setCandidates(function (cs) {
      return cs.map(function (c) { return c.id === id ? Object.assign({}, c, { status: "loading", fileName: file.name }) : c; });
    });
    try {
      const parsed = await readFile(file);
      setCandidates(function (cs) {
        return cs.map(function (c) { return c.id === id ? Object.assign({}, c, parsed, { status: "ready", fileName: file.name }) : c; });
      });
    } catch (e) {
      setCandidates(function (cs) {
        return cs.map(function (c) { return c.id === id ? Object.assign({}, c, { status: "error", fileName: file.name }) : c; });
      });
    }
  }
  async function analyze() {
    setError("");
    if (!jobDesc.trim()) { setError("Əvvəlcə vakansiya təsvirini daxil et."); return; }
    const valid = candidates.filter(function (c) { return c.status === "ready"; });
    if (valid.length === 0) { setError("Ən azı bir namizədin CV faylını yüklə."); return; }
    setLoading(true);
    setResults(null);
    try {
      const introText = "Sən təcrübəli HR / Talent Acquisition mütəxəssisisən. Aşağıdakı vakansiyaya uyğun olaraq hər namizədin CV-sini qiymətləndir.\n\nVAKANSİYA: " + (jobTitle || "Qeyd olunmayıb") + "\nTƏSVİR:\n" + jobDesc.trim() + "\n\nAşağıda namizədlərin CV-ləri veriləcək (mətn və ya sənəd formatında).";
      const parts = [{ text: introText }];
      valid.forEach(function (c, i) {
        parts.push({ text: "\n--- NAMİZƏD " + (i + 1) + " (id: " + c.id + ") - " + (c.name || c.fileName) + " ---" });
        if (c.fileType === "pdf") {
          parts.push({ inlineData: { mimeType: "application/pdf", data: c.base64 } });
        } else {
          parts.push({ text: c.textContent });
        }
      });
      const instructionText = "\nHər namizəd üçün JSON obyekti qaytar. Cavab YALNIZ JSON array formatında olsun:\n\n[\n  {\n    \"id\": \"namizədin id-si (yuxarıda verilən id ilə eyni olsun)\",\n    \"name\": \"namizədin adı\",\n    \"score\": 0-100 arası tam ədəd,\n    \"verdict\": \"Güclü uyğunluq\" | \"Orta uyğunluq\" | \"Zəif uyğunluq\",\n    \"strengths\": [\"qısa güclü tərəf 1\", \"qısa güclü tərəf 2\", \"qısa güclü tərəf 3\"],\n    \"gaps\": [\"qısa boşluq 1\", \"qısa boşluq 2\"],\n    \"summary\": \"1-2 cümləlik qiymətləndirmə\"\n  }\n]\n\nBütün mətnlər Azərbaycan dilində olsun. score real təhlilə əsaslansın.";
      parts.push({ text: instructionText });
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parts: parts }),
      });
      if (!response.ok) {
        const errBody = await response.json().catch(function () { return {}; });
        throw new Error(errBody.error || "Server xətası");
      }
      const data = await response.json();
      const rawText = data.text;
      if (!rawText) throw new Error("Cavab alınmadı");
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const merged = parsed.map(function (r) {
        const orig = valid.find(function (c) { return c.id === r.id; });
        return Object.assign({}, r, { name: r.name || (orig && orig.name) || (orig && orig.fileName) });
      });
      merged.sort(function (a, b) { return b.score - a.score; });
      setResults(merged);
    } catch (e) {
      console.error(e);
      setError("XƏTA: " + (e.message || "naməlum"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionLabel>Vakansiya</SectionLabel>
      <div style={cardStyle}>
        <input value={jobTitle} onChange={function (e) { setJobTitle(e.target.value); }} placeholder="Vakansiyanın adı, məs: Senior Frontend Developer" style={inputStyle} />
        <textarea value={jobDesc} onChange={function (e) { setJobDesc(e.target.value); }} placeholder="Tələb olunan bacarıqlar, təcrübə, öhdəliklər..." rows={5} style={Object.assign({}, inputStyle, { marginBottom: 0, resize: "vertical", lineHeight: 1.55 })} />
      </div>

      <SectionLabel>Namizədlər</SectionLabel>
      {candidates.map(function (c, idx) {
        return (
          <div key={c.id} style={Object.assign({}, cardStyle, { marginBottom: 12 })}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
              <input value={c.name} onChange={function (e) { updateName(c.id, e.target.value); }} placeholder={"Namizəd " + (idx + 1) + " adı (istəyə bağlı)"} style={Object.assign({}, inputStyle, { marginBottom: 0, flex: 1 })} />
              {candidates.length > 1 && (
                <button onClick={function () { removeCandidate(c.id); }} aria-label="Sil" style={removeBtnStyle}>✕</button>
              )}
            </div>
            <input ref={function (el) { fileInputs.current[c.id] = el; }} type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={function (e) { e.target.files[0] && onFilePicked(c.id, e.target.files[0]); }} />
            {c.status === "empty" && (
              <button onClick={function () { fileInputs.current[c.id] && fileInputs.current[c.id].click(); }} style={dropZoneStyle}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>⬆️</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.green }}>CV faylını yüklə</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>PDF, Word (.docx) və ya .txt</div>
              </button>
            )}
            {c.status === "loading" && (
              <div style={Object.assign({}, dropZoneStyle, { borderStyle: "solid" })}>
                <div style={{ fontSize: 13.5, color: C.muted }}>{c.fileName} oxunur...</div>
              </div>
            )}
            {c.status === "ready" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#EEF5EE", border: "1px solid #C9DEC5", borderRadius: 10, padding: "10px 12px" }}>
                <span style={{ fontSize: 20 }}>{fileIcon(c.fileType)}</span>
                <span style={{ fontSize: 13, color: C.green, fontWeight: 600, flex: 1, wordBreak: "break-all" }}>{c.fileName}</span>
                <button onClick={function () { fileInputs.current[c.id] && fileInputs.current[c.id].click(); }} style={swapBtnStyle}>Dəyiş</button>
              </div>
            )}
            {c.status === "error" && (
              <div style={{ background: "#FAE7E1", border: "1px solid #E9BDAC", borderRadius: 10, padding: "10px 12px", fontSize: 12.5, color: C.danger }}>
                {c.fileName} oxuna bilmədi. Dəstəklənən formatlar: PDF, DOCX, TXT.
                <button onClick={function () { fileInputs.current[c.id] && fileInputs.current[c.id].click(); }} style={Object.assign({}, swapBtnStyle, { marginTop: 6 })}>Yenidən yüklə</button>
              </div>
            )}
          </div>
        );
      })}

      <button onClick={addCandidate} style={addBtnStyle}>+ Namizəd əlavə et</button>

      {error && <div style={errorBoxStyle}>{error}</div>}

      <button onClick={analyze} disabled={loading} style={Object.assign({}, analyzeBtnStyle, { opacity: loading ? 0.75 : 1 })}>
        {loading ? "Təhlil edilir..." : "🔍 Namizədləri təhlil et"}
      </button>

      {results && (
        <div style={{ marginTop: 30 }}>
          <SectionLabel>Nəticələr · uyğunluq sırası ilə</SectionLabel>
          {results.map(function (r, i) {
            const theme = scoreTheme(r.score);
            return (
              <div key={r.id || i} style={Object.assign({}, cardStyle, { marginBottom: 14, border: i === 0 ? ("2px solid " + C.green) : ("1px solid " + C.border), position: "relative" })}>
                {i === 0 && (
                  <div style={{ position: "absolute", top: -11, left: 16, background: "linear-gradient(90deg, " + C.green + ", " + C.greenBright + ")", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.4, padding: "4px 12px", borderRadius: 20 }}>
                    ⭐ ƏN UYĞUN
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: i === 0 ? 8 : 0 }}>
                  <div>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 17.5, color: C.greenDeep }}>{r.name}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{r.verdict}</div>
                  </div>
                  <div style={{ background: theme.bg, color: theme.text, border: "1px solid " + theme.border, borderRadius: 10, padding: "5px 11px", fontSize: 16, fontWeight: 700 }}>{r.score}</div>
                </div>
                <ScoreBar score={r.score} />
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.ink, margin: "12px 0" }}>{r.summary}</p>
                {r.strengths && r.strengths.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.greenBright, marginBottom: 4 }}>✓ GÜCLÜ TƏRƏFLƏR</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                      {r.strengths.map(function (s, j) { return <li key={j}>{s}</li>; })}
                    </ul>
                  </div>
                )}
                {r.gaps && r.gaps.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.danger, marginBottom: 4 }}>⚠ BOŞLUQLAR</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                      {r.gaps.map(function (g, j) { return <li key={j}>{g}</li>; })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================= INTERVIEW QUESTIONS (expanded) ============================= */

const CATEGORIES = [
  { key: "general", label: "Ümumi / Davranış", color: "#2F4A3E", bg: "#E4F1E1" },
  { key: "logic", label: "Praktiki / Məntiq", color: "#5A4A1E", bg: "#F3ECD2" },
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
  // GENERAL / BEHAVIOURAL
  { c: "general", q: "Özünüzdən və peşəkar yolunuzdan qısaca danışın." },
  { c: "general", q: "Sizin üçün ən böyük peşəkar nailiyyət nə olub və niyə?" },
  { c: "general", q: "Komandada işlədiyiniz çətin bir konflikti necə həll etdiniz?" },
  { c: "general", q: "Uğursuz olduğunuz bir layihədən nə öyrəndiniz?" },
  { c: "general", q: "Eyni vaxtda bir neçə prioriteti necə idarə edirsiniz?" },
  { c: "general", q: "Bu vəzifəyə niyə maraq göstərirsiniz və 3 ildən sonra özünüzü harada görürsünüz?" },
  { c: "general", q: "Son bir ildə aldığınız ən dəyərli tənqid hansı olub və ona necə reaksiya verdiniz?" },
  { c: "general", q: "Stresli bir dövrdə işinizin keyfiyyətini necə qoruyursunuz?" },
  { c: "general", q: "Rəhbərinizlə fikir ayrılığına düşdüyünüz halı danışın - nəticə nə oldu?" },
  { c: "general", q: "Öz işinizdə ən çox nədən motivasiya alırsınız?" },
  { c: "general", q: "Komanda yoldaşınızın səhvini gördükdə necə davranırsınız?" },
  { c: "general", q: "Vaxt çatışmazlığı olan bir tapşırığı necə prioritetləşdirirsiniz?" },
  { c: "general", q: "Sizin güclü və zəif tərəfləriniz hansılardır - konkret nümunə ilə izah edin." },
  { c: "general", q: "İş yerində dəyişikliyə (yeni sistem, struktur) necə uyğunlaşırsınız?" },
  { c: "general", q: "Son işinizdən ayrılma səbəbiniz nə olub?" },
  { c: "general", q: "Komanda daxilində etimadı necə qazanırsınız?" },
  { c: "general", q: "Uzunmüddətli hədəf ilə qısamüddətli təzyiqlər arasında balansı necə saxlayırsınız?" },
  { c: "general", q: "Sizə uyğun olmayan bir tapşırıq verildikdə necə hərəkət edirsiniz?" },

  // LOGIC / PRACTICAL (new)
  { c: "logic", q: "Komandanızda bir tapşırığın son tarixi yaxınlaşır, amma vacib məlumat çatışmır. Nə edirsiniz?" },
  { c: "logic", q: "İki vacib layihə eyni gün üçün son tarixə malikdir və resurslarınız kifayət etmir. Prioritetləşdirmə addımlarınızı izah edin." },
  { c: "logic", q: "Bir prosesi 30% sürətləndirmək tapşırığı aldınız, amma büdcəniz yoxdur. Necə yanaşarsınız?" },
  { c: "logic", q: "Komanda üzvünüz tez-tez son tarixi ötürür, amma səbəbini deyə bilmir. Situasiyanı necə araşdırardınız?" },
  { c: "logic", q: "Sizə 100 səhifəlik hesabat verilib və 1 saat vaxtınız var. Məlumatı necə emal edərdiniz?" },
  { c: "logic", q: "Bir müştəri sizdən mümkün olmayan bir tələb edir. Onu necə idarə edərdiniz?" },
  { c: "logic", q: "Komandanızda gizli bir münaqişə hiss edirsiniz, amma heç kim açıq danışmır. İlk addımınız nə olar?" },
  { c: "logic", q: "Rəqəm əsaslı bir qərar ilə intuisiyanız ziddiyyət təşkil edəndə hansına üstünlük verirsiniz və niyə?" },
  { c: "logic", q: "Yeni başlayan bir işçiyə mürəkkəb bir prosesi necə izah edərdiniz - addım-addım göstərin." },
  { c: "logic", q: "Əgər sabahdan komandanızın yarısı işə çıxmasa, gündəlik işi necə davam etdirərdiniz?" },

  // LEADERSHIP
  { c: "leadership", q: "Komandanı çətin bir dəyişiklik prosesindən necə keçirmisiniz?" },
  { c: "leadership", q: "Zəif performans göstərən bir işçiyə necə yanaşırsınız?" },
  { c: "leadership", q: "Qərar qəbul edərkən komandanın fikrini nə dərəcədə nəzərə alırsınız?" },
  { c: "leadership", q: "Komanda üzvləri arasında münaqişəni necə həll edirsiniz?" },
  { c: "leadership", q: "Delegasiya (tapşırıq bölgüsü) prinsipiniz nədir?" },
  { c: "leadership", q: "Uzaqdan işləyən komandanı necə motivasiya edirsiniz?" },
  { c: "leadership", q: "Komandanın etimadını itirdiyiniz bir anı və onu necə bərpa etdiyinizi danışın." },
  { c: "leadership", q: "Öz komandanızda istedadı necə inkişaf etdirirsiniz?" },
  { c: "leadership", q: "Populyar olmayan bir qərarı komandaya necə çatdırırsınız?" },
  { c: "leadership", q: "Liderlik tərzinizi 3 sözlə necə təsvir edərdiniz?" },
  { c: "leadership", q: "Komandada psixoloji təhlükəsizliyi necə formalaşdırırsınız?" },
  { c: "leadership", q: "Səhv etdiyiniz zaman komandaya bunu necə bildirirsiniz?" },
  { c: "leadership", q: "Yüksək performanslı, amma çətin xasiyyətli işçini necə idarə edirsiniz?" },
  { c: "leadership", q: "Strategiyanı əməliyyat səviyyəsinə necə tərcümə edirsiniz?" },

  // SALES
  { c: "sales", q: "Sizə yox deyən müştərini necə inandırırsınız?" },
  { c: "sales", q: "Satış hədəflərinizə çatmadığınız zaman nə edirsiniz?" },
  { c: "sales", q: "Uzun satış tsiklini necə idarə edirsiniz?" },
  { c: "sales", q: "Ən çətin qapadığınız satışı təsvir edin." },
  { c: "sales", q: "Müştəri etirazlarına (objection) necə cavab verirsiniz?" },
  { c: "sales", q: "Soyuq zəng (cold call) zamanı ilk 30 saniyəni necə qurursunuz?" },
  { c: "sales", q: "Müştəri ilə uzunmüddətli münasibəti necə qururşunuz?" },
  { c: "sales", q: "Qiymət danışıqlarında öz mövqeyinizi necə qoruyursunuz?" },
  { c: "sales", q: "CRM və satış hunisini (funnel) necə izləyirsiniz?" },
  { c: "sales", q: "Rəqib təklifi ilə müqayisədə öz məhsulunuzu necə fərqləndirirsiniz?" },
  { c: "sales", q: "Bir müştərini itirdiniz - səbəbi araşdırmaq üçün nə edərdiniz?" },
  { c: "sales", q: "Cross-sell və up-sell fürsətlərini necə müəyyən edirsiniz?" },

  // MARKETING
  { c: "marketing", q: "Uğurlu bir kampaniyanı necə ölçürsünüz - hansı KPI-lara baxırsınız?" },
  { c: "marketing", q: "Məhdud büdcə ilə maksimum nəticəyə necə nail olursunuz?" },
  { c: "marketing", q: "Brend mesajını fərqli auditoriyalar üçün necə uyğunlaşdırırsınız?" },
  { c: "marketing", q: "A/B test aparmağa hansı yanaşmanız var?" },
  { c: "marketing", q: "Sosial media və SEO strategiyanızda nələrə üstünlük verirsiniz?" },
  { c: "marketing", q: "Bir kampaniya uğursuz olduqda, buradan hansı nəticələri çıxarırsınız?" },
  { c: "marketing", q: "Marka mövqeləndirməsini (positioning) necə müəyyən edirsiniz?" },
  { c: "marketing", q: "İçerik təqviminizi necə planlaşdırırsınız?" },
  { c: "marketing", q: "Müştəri seqmentasiyasına yanaşmanız nədir?" },
  { c: "marketing", q: "Marketinq və satış komandaları arasında əlaqələndirməni necə qurursunuz?" },

  // IT
  { c: "it", q: "Kod keyfiyyətini necə təmin edirsiniz - test, code review prosesi?" },
  { c: "it", q: "İstehsalda (production) kritik bir bug tapdıqda addımlarınız nədir?" },
  { c: "it", q: "Texniki borcu (technical debt) necə idarə edirsiniz?" },
  { c: "it", q: "Yeni bir texnologiyanı necə öyrənirsiniz - son öyrəndiyiniz nə idi?" },
  { c: "it", q: "Sistemin performansını necə optimallaşdırmısınız - konkret bir nümunə verin." },
  { c: "it", q: "Agile/Scrum prosesində rolunuz necə olub?" },
  { c: "it", q: "Sistem arxitekturası qurarkən hansı prinsiplərə üstünlük verirsiniz?" },
  { c: "it", q: "Kod review zamanı komanda yoldaşınıza tənqidi rəyi necə çatdırırsınız?" },
  { c: "it", q: "Təhlükəsizlik (security) məsələlərinə inkişaf prosesində necə diqqət yetirirsiniz?" },
  { c: "it", q: "CI/CD prosesini necə qururdunuz və ya təkmilləşdirmisiniz?" },
  { c: "it", q: "Verilənlər bazasının performans problemi ilə qarşılaşdığınız halı təsvir edin." },
  { c: "it", q: "Sənədləşdirməyə (documentation) yanaşmanız nədir?" },

  // FINANCE
  { c: "finance", q: "Büdcə planlaşdırmasında ən çox hansı metodologiyaya güvənirsiniz?" },
  { c: "finance", q: "Maliyyə hesabatlarında uyğunsuzluq tapdıqda necə hərəkət edirsiniz?" },
  { c: "finance", q: "Xərcləri necə optimallaşdırmısınız - konkret nəticə ilə misal verin." },
  { c: "finance", q: "Riskin qiymətləndirilməsinə yanaşmanız nədir?" },
  { c: "finance", q: "Audit prosesində iştirakınız necə olub?" },
  { c: "finance", q: "Nağd axını (cash flow) proqnozlaşdırmasını necə aparırsınız?" },
  { c: "finance", q: "İnvestisiya qərarını necə əsaslandırırsınız - hansı göstəricilərə baxırsınız?" },
  { c: "finance", q: "Maliyyə məlumatını qeyri-maliyyəçi rəhbərliyə necə izah edirsiniz?" },
  { c: "finance", q: "Vergi qanunvericiliyindəki dəyişiklikləri necə izləyirsiniz?" },
  { c: "finance", q: "Maliyyə hesabatlarının vaxtında hazırlanmasını necə təmin edirsiniz?" },

  // CUSTOMER SERVICE
  { c: "cs", q: "Qəzəbli bir müştəri ilə necə davranırsınız?" },
  { c: "cs", q: "Eyni problemi dəfələrlə həll etməli olduqda motivasiyanızı necə saxlayırsınız?" },
  { c: "cs", q: "Müştəri məmnuniyyətini necə ölçürsünüz?" },
  { c: "cs", q: "Şirkət siyasətinə uyğun olmayan bir tələbi olan müştəriyə necə yanaşırsınız?" },
  { c: "cs", q: "Bir müştərini itirdiyiniz halı təsvir edin - nə fərqli edərdiniz?" },
  { c: "cs", q: "Bir neçə müştərinin eyni anda müraciət etdiyi halda prioritetləşdirməni necə edirsiniz?" },
  { c: "cs", q: "Müştəri rəylərini (feedback) məhsul komandasına necə çatdırırsınız?" },
  { c: "cs", q: "Cavab vermək çətin olan bir sualla qarşılaşdıqda nə edirsiniz?" },
  { c: "cs", q: "Müştəri sadiqliyini (loyalty) artırmaq üçün hansı addımları atmısınız?" },

  // HR
  { c: "hr", q: "Namizədin mədəni uyğunluğunu (culture fit) necə qiymətləndirirsiniz?" },
  { c: "hr", q: "İşdən çıxma prosesini (offboarding) necə həssaslıqla idarə edirsiniz?" },
  { c: "hr", q: "Çətin bir işə qəbul prosesini təsvir edin - nə öyrəndiniz?" },
  { c: "hr", q: "İşçi münasibətlərində qərəzsizliyi necə təmin edirsiniz?" },
  { c: "hr", q: "Performans qiymətləndirməsi prosesinə yanaşmanız nədir?" },
  { c: "hr", q: "Yeni işçinin adaptasiyasını (onboarding) necə effektiv edirsiniz?" },
  { c: "hr", q: "İşçi məmnuniyyətini necə ölçür və artırırsınız?" },
  { c: "hr", q: "Konfidensial işçi məlumatlarını necə qoruyursunuz?" },
  { c: "hr", q: "Əmək mübahisəsini (disiplinar məsələ) necə həll etmisiniz?" },
  { c: "hr", q: "Çeşidlilik və inklüziya (D&I) təşəbbüslərinə necə töhfə vermisiniz?" },
  { c: "hr", q: "Kadr ehtiyatı planlaşdırmasına (succession planning) yanaşmanız nədir?" },

  // BUSINESS ANALYTICS
  { c: "ba", q: "Bir biznes probleminin kök səbəbini necə müəyyən edirsiniz?" },
  { c: "ba", q: "Tələblərin toplanması (requirements gathering) prosesinizi təsvir edin." },
  { c: "ba", q: "Maraqlı tərəflər (stakeholders) arasında ziddiyyətli tələbləri necə həll edirsiniz?" },
  { c: "ba", q: "Məlumat əsasında (data-driven) bir tövsiyəni necə formalaşdırdınız - konkret misal verin." },
  { c: "ba", q: "SWOT və ya digər analitik çərçivələrdən necə istifadə edirsiniz?" },
  { c: "ba", q: "Bir prosesi necə xəritələndirirsiniz (process mapping) və təkmilləşdirmə təklif edirsiniz?" },
  { c: "ba", q: "Verilənlər vizuallaşdırmasında hansı prinsiplərə əməl edirsiniz?" },
  { c: "ba", q: "Bir layihənin ROI-sini necə hesablayardınız?" },
  { c: "ba", q: "Fərziyyələrinizi necə test edir və doğrulayırsınız?" },

  // ESG
  { c: "esg", q: "ESG hesabatlılığında hansı standartlarla (GRI, SASB, TCFD) işləmisiniz?" },
  { c: "esg", q: "Bir şirkətdə davamlılıq (sustainability) strategiyasını necə formalaşdırardınız?" },
  { c: "esg", q: "Karbon izinin ölçülməsi və azaldılmasına yanaşmanız nədir?" },
  { c: "esg", q: "Sosial təsir (social impact) layihələrini necə qiymətləndirirsiniz?" },
  { c: "esg", q: "Korporativ idarəetmə (governance) risklərini necə müəyyən edirsiniz?" },
  { c: "esg", q: "Maraqlı tərəflərlə (investorlar, tənzimləyicilər) ESG mövzusunda necə ünsiyyət qurursunuz?" },
  { c: "esg", q: "ESG məlumatlarının toplanması və doğrulanmasında hansı çətinliklərlə rastlaşmısınız?" },
  { c: "esg", q: "Tədarük zəncirində (supply chain) davamlılıq riskini necə qiymətləndirirsiniz?" },

  // TALENT ACQUISITION
  { c: "ta", q: "Passiv namizədləri (passive candidates) necə tapıb cəlb edirsiniz?" },
  { c: "ta", q: "İşəgötürən brendini (employer branding) gücləndirmək üçün nə edirsiniz?" },
  { c: "ta", q: "Çətin doldurulan (hard-to-fill) vakansiyaya yanaşmanız necədir?" },
  { c: "ta", q: "Namizəd təcrübəsini (candidate experience) necə yaxşılaşdırırsınız?" },
  { c: "ta", q: "İşə qəbul metriklərini (time-to-hire, cost-per-hire) necə izləyirsiniz?" },
  { c: "ta", q: "Sourcing üçün hansı alət və platformalardan istifadə edirsiniz?" },
  { c: "ta", q: "Yüksək vəzifə üçün çoxmərhələli müsahibə prosesini necə qururdunuz?" },
  { c: "ta", q: "İşə qəbul zamanı qərəzi (bias) necə minimuma endirirsiniz?" },
  { c: "ta", q: "Bir vakansiyaya çox sayda müraciət gəldikdə ilkin süzgəcdən necə keçirirsiniz?" },
];

function InterviewScreen() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? QUESTIONS : QUESTIONS.filter(function (q) { return q.c === active; });
  return (
    <div>
      <SectionLabel>Sahəyə görə süz</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <Chip label="Hamısı" active={active === "all"} onClick={function () { setActive("all"); }} color={C.green} bg="#EAE7DC" />
        {CATEGORIES.map(function (cat) {
          return <Chip key={cat.key} label={cat.label} active={active === cat.key} onClick={function () { setActive(cat.key); }} color={cat.color} bg={cat.bg} />;
        })}
      </div>
      <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14 }}>
        {filtered.length} sual {active !== "all" ? ("· " + (CATEGORIES.find(function (c) { return c.key === active; }) || {}).label) : ""}
      </div>
      {filtered.map(function (item, i) {
        const cat = CATEGORIES.find(function (c) { return c.key === item.c; });
        return (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: "14px 16px", marginBottom: 10, borderLeft: "4px solid " + cat.color, boxShadow: "0 1px 3px rgba(30,42,34,0.06)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: cat.color, marginBottom: 5, textTransform: "uppercase" }}>{cat.label}</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: C.ink }}>{item.q}</div>
          </div>
        );
      })}
    </div>
  );
}

function Chip(props) {
  return (
    <button
      onClick={props.onClick}
      style={{
        border: "1px solid " + (props.active ? props.color : C.border),
        background: props.active ? props.bg : "#fff",
        color: props.active ? props.color : C.muted,
        fontSize: 12.5,
        fontWeight: 600,
        padding: "7px 13px",
        borderRadius: 20,
        cursor: "pointer",
        transition: "all 150ms ease",
      }}
    >
      {props.label}
    </button>
  );
}

/* ============================= LABOR CODE (structured reference, not verbatim) ============================= */

const LABOR_CODE_SECTIONS = [
  {
    title: "Ümumi müddəalar",
    points: [
      "Əmək Məcəlləsi işçi ilə işəgötürən arasındakı əmək münasibətlərinin minimum təminat səviyyəsini müəyyən edir.",
      "İşçi — işəgötürənlə yazılı əmək müqaviləsi (kontrakt) bağlayaraq haqqı ödənilməklə çalışan fiziki şəxsdir.",
      "İşəgötürən — işçi ilə əmək müqaviləsi bağlamaq, ona xitam vermək və şərtlərini dəyişmək hüququ olan tərəfdir.",
      "Əcnəbi işçilərin cəlbi Miqrasiya Məcəlləsi ilə əlaqəli əlavə qaydalara (iş icazəsi və s.) tabedir.",
    ],
  },
  {
    title: "Əmək müqaviləsi",
    points: [
      "Əmək müqaviləsi yazılı formada bağlanır və qanunla müəyyən olunmuş məcburi rekvizitləri (tərəflər, vəzifə, əməkhaqqı, iş rejimi və s.) əks etdirməlidir.",
      "Sınaq müddəti təyin oluna bilər; onun maksimum uzunluğu və hansı hallarda tətbiq edilə bilməyəcəyi qanunla tənzimlənir.",
      "Əmək müqaviləsinin şərtlərinin dəyişdirilməsi, adətən, tərəflərin razılığını tələb edir.",
      "Müqavilənin ləğvi/xitamı üçün qanunda bir sıra əsaslar (tərəflərin razılığı, müddətin bitməsi, işəgötürənin təşəbbüsü, işçinin təşəbbüsü və s.) nəzərdə tutulub.",
    ],
  },
  {
    title: "İş vaxtı və istirahət vaxtı",
    points: [
      "Normal iş vaxtının həftəlik maksimum həddi qanunla müəyyən edilir; müəyyən kateqoriyalar üçün qısaldılmış iş vaxtı tətbiq oluna bilər.",
      "Növbədənkənar iş (overtime) yalnız qanunda göstərilən hallarda və əlavə haqq ödənilməklə tətbiq edilə bilər.",
      "İşçilərin gündəlik və həftəlik istirahət hüququ, habelə bayram/qeyri-iş günləri qanunla qorunur.",
    ],
  },
  {
    title: "Əmək məzuniyyəti",
    points: [
      "İşçinin əsas illik ödənişli məzuniyyət hüququ var; minimum müddət qanunla təsbit olunub.",
      "İlk iş ili üçün məzuniyyətdən istifadə hüququ, adətən, müəyyən minimum iş stajından (məsələn, altı ay) sonra yaranır.",
      "Bəzi kateqoriyalar (əlillər, döyüş veteranları, xüsusi xidmətləri olanlar və s.) üçün əlavə və ya güzəştli məzuniyyət şərtləri nəzərdə tutulub.",
      "Sosial məzuniyyətlər (hamiləlik və doğuşla bağlı, uşağa qulluq və s.) ayrıca tənzimlənir.",
    ],
  },
  {
    title: "Əməyin ödənilməsi",
    points: [
      "Əməkhaqqı dövlət tərəfindən müəyyən olunan minimum həddən aşağı ola bilməz.",
      "Əməkhaqqının ödənilmə vaxtı, forması və gecikmə halında məsuliyyət qanunla tənzimlənir.",
      "Növbədənkənar iş, gecə vaxtı işi, bayram günü işi üçün əlavə ödəniş tələb oluna bilər.",
    ],
  },
  {
    title: "Əmək müqaviləsinə xitam",
    points: [
      "İşəgötürənin təşəbbüsü ilə xitam yalnız qanunda sadalanan əsaslara (ştatların ixtisarı, işçinin uyğunsuzluğu, intizam pozuntusu və s.) əsaslanmalıdır.",
      "Müəyyən hallarda işəgötürən işçini əvvəlcədən xəbərdar etməli və/və ya kompensasiya ödəməlidir.",
      "Bəzi işçi kateqoriyaları (hamilə qadınlar, azyaşlı uşağı olanlar və s.) əlavə müdafiəyə malikdir.",
    ],
  },
  {
    title: "Əmək intizamı və məsuliyyət",
    points: [
      "İntizam tənbehləri (irad, töhmət, işdən azad etmə) qanunla müəyyən olunmuş qaydada və ardıcıllıqla tətbiq edilir.",
      "İşçinin maddi məsuliyyəti, adətən, onun günahı sübut olunduqda və qanunda göstərilən hədlər daxilində yaranır.",
    ],
  },
  {
    title: "Əməyin mühafizəsi",
    points: [
      "İşəgötürən təhlükəsiz və sağlam əmək şəraiti yaratmağa borcludur (avadanlıq, təlimat, fərdi qoruyucu vasitələr və s.).",
      "İşçi əmək funksiyasını yerinə yetirərkən təhlükəsizlik qaydalarına əməl etməlidir.",
      "İş yerində baş vermiş bədbəxt hadisələr müəyyən qaydada araşdırılmalı və qeydə alınmalıdır.",
    ],
  },
  {
    title: "Kollektiv əmək münasibətləri",
    points: [
      "İşçilər həmkarlar ittifaqı yaratmaq və ona üzv olmaq hüququna malikdirlər.",
      "Kollektiv müqavilə və sazişlər tərəflər arasında əlavə hüquq və öhdəliklər müəyyən edə bilər.",
      "Kollektiv əmək mübahisələri qanunla nəzərdə tutulan xüsusi qaydada (danışıqlar, barışdırıcı komissiya və s.) həll olunur.",
    ],
  },
  {
    title: "Nəzarət və mübahisələrin həlli",
    points: [
      "Əmək qanunvericiliyinə əməl olunmasına dövlət nəzarətini müvafiq icra hakimiyyəti orqanı həyata keçirir.",
      "Fərdi əmək mübahisələri, adətən, əvvəlcə işəgötürənlə birbaşa danışıqlar, sonra məhkəmə qaydasında həll olunur.",
    ],
  },
];

function LaborCodeScreen() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div style={{ background: C.goldSoft, border: "1px solid " + C.gold, borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontSize: 12.5, lineHeight: 1.6, color: "#5A4520" }}>
        ⚠️ Bu bölmə Əmək Məcəlləsinin əsas mövzularının <b>ümumiləşdirilmiş, sadələşdirilmiş bələdçisidir</b> — konkret maddə mətni deyil. Konkret maddə nömrəsi və dəqiq hüquqi ifadə lazım olduqda rəsmi mənbəyə (e-qanun.az) və ya hüquq məsləhətçisinə müraciət edin.
      </div>
      <SectionLabel>Mövzular üzrə bələdçi</SectionLabel>
      {LABOR_CODE_SECTIONS.map(function (sec, i) {
        const isOpen = open === i;
        return (
          <div key={i} style={Object.assign({}, cardStyle, { marginBottom: 10, padding: 0, overflow: "hidden" })}>
            <button
              onClick={function () { setOpen(isOpen ? null : i); }}
              style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span style={{ fontFamily: FONT_SERIF, fontSize: 15.5, color: C.greenDeep }}>{sec.title}</span>
              <span style={{ color: C.gold, fontSize: 16 }}>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 16px 16px" }}>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.65, color: C.ink }}>
                  {sec.points.map(function (p, j) { return <li key={j} style={{ marginBottom: 6 }}>{p}</li>; })}
                </ul>
              </div>
            )}
          </div>
        );
      })}
      <a href="https://e-qanun.az" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", marginTop: 10, padding: "12px", borderRadius: 10, border: "1.5px dashed " + C.gold, color: "#8A5F2E", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
        Rəsmi mətni e-qanun.az saytında oxu →
      </a>
    </div>
  );
}

/* ============================= HR HANDBOOK ============================= */

const HANDBOOK_SECTIONS = [
  {
    title: "İşə qəbul",
    icon: "🧭",
    items: [
      "Vakansiya elan olunmazdan əvvəl vəzifə profili (öhdəliklər, tələblər, uğur meyarları) yazılı təsdiqlənsin.",
      "Bütün namizədlərə eyni struktur üzrə müsahibə aparın — subyektivliyi azaldır.",
      "Referans yoxlanışını təklif mərhələsindən əvvəl planlaşdırın, sonuncu ana saxlamayın.",
      "Namizədə cavab müddətini əvvəlcədən bildirin — hətta rədd olduqda belə, nəzakətli geri dönüş göndərin.",
    ],
  },
  {
    title: "Onboarding (uyğunlaşma)",
    icon: "🌱",
    items: [
      "İlk gün üçün checklist hazırlayın: avadanlıq, sistem girişləri, komanda ilə tanışlıq.",
      "İlk 30/60/90 gün üçün aydın gözləntilər və kiçik hədəflər müəyyən edin.",
      "Yeni işçiyə 'buddy' (dəstək yoldaşı) təyin edin - rəsmi iyerarxiyadan kənar sual vermə kanalı.",
      "30-cu gündə qısa geri-bildirim söhbəti keçirin: nə yaxşı gedir, harada dəstək lazımdır.",
    ],
  },
  {
    title: "Performans idarəetməsi",
    icon: "📈",
    items: [
      "Rəy vermə üçün SBI modelindən istifadə edin: Situasiya → Davranış (Behaviour) → Təsir (Impact).",
      "Rəsmi qiymətləndirmədən əvvəl sürprizlərin olmaması üçün müntəzəm 1:1 görüşlər aparın.",
      "Güclü tərəfləri inkişaf etdirməyə, zəif tərəfləri isə minimuma endirməyə bərabər diqqət ayırın.",
      "Qiymətləndirməni yazılı sənədləşdirin - həm işçi, həm işəgötürən üçün şəffaflıq təmin edir.",
    ],
  },
  {
    title: "Çətin söhbətlər",
    icon: "💬",
    items: [
      "Söhbətdən əvvəl faktları (tarix, konkret nümunə) hazırlayın - ümumi ifadələrdən qaçın.",
      "Şəxsi otaqda, kənar müdaxilə olmadan aparın.",
      "Əvvəlcə dinləyin, sonra öz mövqeyinizi bildirin.",
      "Söhbətin sonunda konkret növbəti addımları və tarixləri razılaşdırın.",
    ],
  },
  {
    title: "İşdən azad etmə (offboarding)",
    icon: "🚪",
    items: [
      "Prosesi ləyaqətlə və məxfi şəkildə aparın - komanda içində şayiələrin yayılmasının qarşısını alın.",
      "Çıxış müsahibəsi (exit interview) vasitəsilə səmimi geri-bildirim toplayın.",
      "Bütün sistem girişlərinin, korporativ avadanlığın vaxtında geri alınmasını təmin edin.",
      "Son haqq-hesab və sənədləşdirmənin qanuni müddətdə tamamlanmasını yoxlayın.",
    ],
  },
  {
    title: "Məzuniyyət və qayğı",
    icon: "🏖️",
    items: [
      "İllik məzuniyyət planını əvvəlcədən komanda ilə əlaqələndirin ki, iş fasiləsiz davam etsin.",
      "Xəstəlik və digər sosial məzuniyyət tələblərini həssaslıqla, məxfi şəkildə emal edin.",
      "Uzunmüddətli qayğı tələb edən hallarda fasiləsiz ünsiyyət kanalı saxlayın.",
    ],
  },
  {
    title: "Uyğunluq və etika",
    icon: "⚖️",
    items: [
      "Ayrı-seçkiliyə qarşı sıfır tolerantlıq siyasətini aydın şəkildə elan edin və tətbiq edin.",
      "Şikayət/bildiriş kanalının anonim və məxfi olmasını təmin edin.",
      "Bütün intizam qərarlarını sənədləşdirin və ardıcıl tətbiq edin - eyni pozuntuya fərqli cəza verməyin.",
    ],
  },
];

function HandbookScreen() {
  return (
    <div>
      <div style={{ background: "#EEF5EE", border: "1px solid #C9DEC5", borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontSize: 12.5, lineHeight: 1.6, color: C.greenDeep }}>
        📗 Gündəlik HR təcrübəsi üçün sürətli istinad kitabçası. Hər bölmə əməli, tətbiq oluna bilən tövsiyələr toplusudur.
      </div>
      {HANDBOOK_SECTIONS.map(function (sec, i) {
        return (
          <div key={i} style={Object.assign({}, cardStyle, { marginBottom: 14 })}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{sec.icon}</span>
              <span style={{ fontFamily: FONT_SERIF, fontSize: 16.5, color: C.greenDeep }}>{sec.title}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.65, color: C.ink }}>
              {sec.items.map(function (it, j) { return <li key={j} style={{ marginBottom: 6 }}>{it}</li>; })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ============================= KPI & 360 ============================= */

const KPI_FRAMEWORKS = [
  { title: "SMART meyarları", desc: "Hər KPI Konkret (Specific), Ölçülə bilən (Measurable), Əlçatan (Achievable), Aidiyyatlı (Relevant) və Vaxt çərçivəli (Time-bound) olmalıdır." },
  { title: "OKR (Objectives & Key Results)", desc: "Böyük, ilhamverici məqsəd (Objective) və onu ölçən 2-4 konkret nəticə (Key Result) təyin edilir - adətən rüblük." },
  { title: "Balanced Scorecard", desc: "Performansı 4 perspektivdən izləyir: Maliyyə, Müştəri, Daxili proseslər, Öyrənmə və inkişaf." },
  { title: "Nəticə vs Davranış KPI-ları", desc: "Yalnız nəticəyə (məs. satış həcmi) deyil, ora aparan davranışlara (məs. müştəri görüşü sayı) da baxın." },
];

const KPI_EXAMPLES_BY_DEPT = [
  { dept: "Satış", kpis: ["Aylıq satış həcmi", "Konversiya faizi", "Orta əməliyyat dəyəri", "Müştəri saxlama (retention) faizi"] },
  { dept: "Marketinq", kpis: ["Lead sayı", "CAC (müştəri cəlbi dəyəri)", "Kampaniya ROI-si", "Marka tanınma indeksi"] },
  { dept: "İT", kpis: ["Sistem uptime faizi", "Bug həll müddəti", "Deployment tezliyi", "Kod əhatə dairəsi (test coverage)"] },
  { dept: "HR", kpis: ["Time-to-hire", "İşçi dövriyyəsi (turnover) faizi", "İşçi məmnuniyyəti indeksi (eNPS)", "Təlimə sərf olunan saat"] },
  { dept: "Müştəri xidməti", kpis: ["Orta cavab müddəti", "İlk müraciətdə həll faizi (FCR)", "Müştəri məmnuniyyəti (CSAT)", "NPS"] },
];

const FEEDBACK_360_DIMENSIONS = [
  { key: "communication", label: "Kommunikasiya", questions: ["Fikirlərini aydın və qısa çatdırır", "Aktiv dinləyir və başqalarının fikrini nəzərə alır", "Çətin mesajları nəzakətlə, amma birbaşa çatdırır"] },
  { key: "collaboration", label: "Əməkdaşlıq", questions: ["Komanda məqsədlərinə töhfə verir", "Digər şöbələrlə effektiv işləyir", "Konflikt zamanı konstruktiv mövqe tutur"] },
  { key: "leadership", label: "Liderlik / Təşəbbüskarlıq", questions: ["Məsuliyyəti öz üzərinə götürür", "Başqalarını inkişaf etdirməyə töhfə verir", "Qeyri-müəyyənlik şəraitində qərar qəbul edir"] },
  { key: "execution", label: "İcra keyfiyyəti", questions: ["Öhdəlikləri vaxtında yerinə yetirir", "İşin keyfiyyətinə diqqət göstərir", "Prioritetləri düzgün müəyyən edir"] },
  { key: "growth", label: "İnkişaf təşəbbüsü", questions: ["Öz inkişafı üçün məsuliyyət götürür", "Rəyi (feedback) qəbul edir və tətbiq edir", "Yeni bacarıqlar öyrənməyə açıqdır"] },
];

function KpiScreen() {
  const [ratings, setRatings] = useState({});

  function setRating(key, val) {
    setRatings(function (r) { return Object.assign({}, r, { [key]: val }); });
  }

  const values = Object.values(ratings);
  const avg = values.length > 0 ? (values.reduce(function (a, b) { return a + b; }, 0) / values.length) : 0;

  return (
    <div>
      <SectionLabel>KPI çərçivələri</SectionLabel>
      {KPI_FRAMEWORKS.map(function (f, i) {
        return (
          <div key={i} style={Object.assign({}, cardStyle, { marginBottom: 10, padding: "14px 16px" })}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: C.greenDeep, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: C.ink }}>{f.desc}</div>
          </div>
        );
      })}

      <SectionLabel>Şöbələrə görə nümunə KPI-lar</SectionLabel>
      {KPI_EXAMPLES_BY_DEPT.map(function (d, i) {
        return (
          <div key={i} style={Object.assign({}, cardStyle, { marginBottom: 10, padding: "14px 16px" })}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: C.greenDeep, marginBottom: 8 }}>{d.dept}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {d.kpis.map(function (k, j) {
                return <span key={j} style={{ fontSize: 12, background: C.goldSoft, color: "#8A5F2E", padding: "5px 10px", borderRadius: 20 }}>{k}</span>;
              })}
            </div>
          </div>
        );
      })}

      <SectionLabel>360° qiymətləndirmə - sürətli kalkulyator</SectionLabel>
      <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14 }}>Hər ölçü üzrə 1-5 bal seçin (1 = zəif, 5 = əla). Nümunə sual bankı ilə birlikdə istifadə edin.</div>

      {FEEDBACK_360_DIMENSIONS.map(function (dim) {
        return (
          <div key={dim.key} style={Object.assign({}, cardStyle, { marginBottom: 12, padding: "14px 16px" })}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: C.greenDeep, marginBottom: 8 }}>{dim.label}</div>
            <ul style={{ margin: "0 0 10px", paddingLeft: 18, fontSize: 12.5, lineHeight: 1.6, color: C.muted }}>
              {dim.questions.map(function (q, j) { return <li key={j}>{q}</li>; })}
            </ul>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map(function (n) {
                const selected = ratings[dim.key] === n;
                return (
                  <button
                    key={n}
                    onClick={function () { setRating(dim.key, n); }}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      border: "1px solid " + (selected ? C.green : C.border),
                      background: selected ? C.green : "#fff",
                      color: selected ? "#fff" : C.muted,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {values.length > 0 && (
        <div style={Object.assign({}, cardStyle, { textAlign: "center", border: "2px solid " + C.green })}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>ÜMUMİ ORTA BAL ({values.length}/{FEEDBACK_360_DIMENSIONS.length} ölçü qiymətləndirilib)</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 34, color: C.greenDeep }}>{avg.toFixed(1)} / 5</div>
        </div>
      )}
    </div>
  );
}

/* ============================= SHARED STYLES ============================= */

function SectionLabel(props) {
  return (
    <div style={{ fontSize: 12, letterSpacing: 1, color: C.gold, fontWeight: 700, marginBottom: 10 }}>
      {props.children.toString().toUpperCase()}
    </div>
  );
}

const cardStyle = {
  background: C.card,
  border: "1px solid " + C.border,
  borderRadius: 14,
  padding: 16,
  marginBottom: 22,
  boxShadow: "0 2px 8px rgba(30,42,34,0.05)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid " + C.border,
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
  border: "1.5px dashed " + C.gold,
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
  border: "1.5px dashed " + C.gold,
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
  border: "1px solid " + C.green,
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
  border: "1px solid #E9BDAC",
  borderRadius: 10,
  color: C.danger,
  fontSize: 13.5,
};

const analyzeBtnStyle = {
  width: "100%",
  marginTop: 16,
  padding: "14px",
  background: "linear-gradient(90deg, " + C.green + ", " + C.greenBright + ")",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: 0.2,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(47,74,62,0.25)",
};