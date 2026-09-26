import { useState } from "react";

const TABS = [
  { id: "emas", label: "ƏMAS", title: "ƏMAS bələdçisi" },
  { id: "isb", label: "İSB", title: "İSB — Sosial sığorta" },
  { id: "vergi", label: "Vergilər", title: "Gəlir vergisi" },
  { id: "numune", label: "Nümunə", title: "Hesablama nümunəsi" },
  { id: "emeliyyat", label: "Əməliyyatlar", title: "HR əməliyyatları" },
];

const PANELS = {
  emas: `
    <div class="lead"><strong>ƏMAS</strong> — "Əmək və Məşğulluq" altsistemi — Əmək və Əhalinin Sosial Müdafiəsi Nazirliyinin idarə etdiyi dövlət platformasıdır. Sadə dillə desək: iş yerinizlə bağlı bütün rəsmi sənədləşmə (müqavilə, məzuniyyət, xitam və s.) artıq kağız üzərində deyil, bu sayt/tətbiq üzərində edilir. 2024-cü ildən etibarən əmək müqaviləsi yalnız burada hər iki tərəf imzaladıqdan sonra hüquqi qüvvəyə minir — yəni sadəcə kağız üzərində əl ilə imza kifayət etmir.</div>

    <div class="card">
      <span class="tag">NƏ ÜÇÜN YARADILIB</span>
      <h3>Problemi nə idi, həlli nədir</h3>
      <p>Əvvəllər əmək müqavilələri kağız üzərində saxlanılırdı və bir çox hallarda işəgötürənlər işçini heç bir yerdə qeydə almadan işə götürürdü ("qeyri-rəsmi" işləmə). Bu, işçinin pensiya stajının, sosial müavinətinin itməsinə səbəb olurdu, dövlət də vergi və sığorta gəliri itirirdi. ƏMAS bunu aradan qaldırmaq üçün yaradılıb:</p>
      <ul>
        <li><strong>Şəffaflıq</strong> — hər müqavilə vahid dövlət bazasında qeydə alınır, gizli qala bilmir</li>
        <li><strong>Rəsmiləşdirmə</strong> — "əldən-ələ", sənədsiz işləmə praktiki olaraq mümkünsüzləşir</li>
        <li><strong>Sürət</strong> — kağız gəzdirmək, imza toplamaq üçün vaxt sərf etməyə ehtiyac qalmır</li>
        <li><strong>Statistika</strong> — dövlət real vaxtda ölkə üzrə məşğulluq mənzərəsini görür</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">NECƏ İŞLƏYİR</span>
      <h3>Addım-addım proses</h3>
      <p>Sistem "bir pəncərə" prinsipi ilə işləyir — yəni bütün tərəflər eyni platformada bir-birini tapır və əməliyyatı orada bitirir:</p>
      <ul>
        <li><strong>1. Qeydiyyat</strong> — işəgötürən ƏMAS-da öz təşkilatının profilini yaradır (bir dəfəlik)</li>
        <li><strong>2. Müqavilənin daxil edilməsi</strong> — işəgötürənin səlahiyyətli nümayəndəsi yeni işçi üçün elektron müqavilə formasını doldurur</li>
        <li><strong>3. Elektron imza</strong> — həm işçi, həm işəgötürən müqaviləni "ASAN İmza", "SİMA İmza" və ya Elektron imza (SİMA Token) vasitəsilə təsdiqləyir</li>
        <li><strong>4. Qüvvəyə minmə</strong> — hər iki imza tamamlanan kimi müqavilə avtomatik hüquqi qüvvə qazanır</li>
        <li><strong>5. Sonrakı dəyişikliklər</strong> — maaş artımı, vəzifə dəyişikliyi, məzuniyyət, xitam kimi hər hansı dəyişiklik yenə eyni sistemdə edilir</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">FUNKSİYALAR</span>
      <h3>HR mütəxəssisi ƏMAS-da konkret nə edir</h3>
      <ul>
        <li><strong>Məzuniyyət əmrləri</strong> — illik, ödənişsiz və digər məzuniyyət növlərini rəsmiləşdirmək</li>
        <li><strong>Ezamiyyə əmrləri</strong> — ölkədaxili və xarici ezamiyyələri qeydə almaq</li>
        <li><strong>Xəstəlik vərəqələri</strong> — tibb müəssisələrinin sənədləri avtomatik sistemə düşür</li>
        <li><strong>İş tarixçəsi</strong> — işçinin əvvəlki rəsmi iş yerləri barədə məlumat</li>
        <li><strong>İnzibati hesabatlıq</strong> — cərimə və uyğunsuzluqlar barədə hesabatlar</li>
      </ul>
    </div>

    <p class="note">Yadda saxlamaq lazım olan əsas qayda: kağız üzərində imzalanmış müqavilə ƏMAS-da təsdiqlənmədən <strong>hüquqi qüvvəyə minmir</strong>.</p>
  `,

  isb: `
    <div class="lead"><strong>İSB</strong> (İcbari Sosial Sığorta, tam adı: Məcburi Dövlət Sosial Sığortası — MDSS) — hər ay əməkhaqqından avtomatik tutulan və büdcəyə köçürülən icbari ödənişdir. Bu, işçinin gələcək pensiyasını və hazırkı sosial müavinətlərini (xəstəlik, hamiləlik-doğum, dəfn) maliyyələşdirən məcburi qənaətdir.</div>

    <div class="card">
      <span class="tag">KİM ÖDƏYİR</span>
      <h3>İki tərəfli ödəniş sistemi</h3>
      <ul>
        <li><strong>İşçi payı</strong> — əməkhaqqından avtomatik tutulur, netto məbləğdən azalır</li>
        <li><strong>İşəgötürən payı</strong> — işəgötürənin öz büdcəsindən əlavə ödənilir</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">2026 — DƏRƏCƏLƏR</span>
      <h3>Qeyri-neft-qaz, özəl sektor üzrə cədvəl</h3>
      <div class="tablewrap">
        <table>
          <tr><th>Aylıq əməkhaqqı</th><th>İşçi payı</th><th>İşəgötürən payı</th></tr>
          <tr><td>200 manatadək</td><td>3%</td><td>22%</td></tr>
          <tr><td>200–2500 manat</td><td>6 m. + 10% (200-dən yuxarı)</td><td>44 m. + 15% (200-dən yuxarı)</td></tr>
          <tr><td>8000-dən yuxarı hissə</td><td>10%</td><td>11%</td></tr>
        </table>
      </div>
      <p>Cəmi birlikdə əsasən 25% təşkil edir, 8000 manatdan yuxarı hissədə 21%-ə enir.</p>
    </div>

    <div class="card">
      <span class="tag">ƏLAVƏ, AYRICA ÖDƏNİŞ</span>
      <h3>İcbari tibbi sığorta nədir</h3>
      <p>Sosial sığortadan <strong>tamam ayrı</strong> bir ödənişdir. Cəmi 4% — işçidən 2%, işəgötürəndən 2%.</p>
    </div>

    <div class="card">
      <span class="tag">MƏNTİQ</span>
      <h3>Niyə dərəcələr pillə-pillə dəyişir</h3>
      <ul>
        <li>Aşağı əməkhaqqıda işçi payı çox aşağıdır — ən az qazananları qorumaq üçün</li>
        <li>Yüksək əməkhaqqıda ümumi dərəcə azaldılır — yüksək maaşların rəsmi bəyanını təşviq etmək üçün</li>
      </ul>
    </div>
  `,

  vergi: `
    <div class="lead"><strong>Gəlir vergisi</strong> (FŞGV) — işəgötürən tərəfindən əməkhaqqından mənbədə tutulan və birbaşa dövlət büdcəsinə köçürülən vergidir. Əsas iş yeri üzrə işçi ayrıca bəyannamə vermir.</div>

    <div class="card">
      <span class="tag">TARİXİ KONTEKST</span>
      <h3>Niyə bu, HR üçün xüsusilə vacibdir</h3>
      <p>2019–2025 arasında qeyri-neft özəl sektorda 8000 manatadək əməkhaqqı tam vergidən azad idi. <strong>2026-cı ildən bu güzəşt bitib</strong> və mərhələli keçid dövrü başlayıb.</p>
    </div>

    <div class="card">
      <span class="tag">2026 — DƏRƏCƏLƏR</span>
      <h3>Qeyri-neft-qaz, özəl sektor üzrə cədvəl</h3>
      <div class="tablewrap">
        <table>
          <tr><th>Aylıq gəlir</th><th>Dərəcə</th></tr>
          <tr><td>200 manatadək</td><td>tutulmur (tam azad)</td></tr>
          <tr><td>200–2500 manat</td><td>3% (200-dən yuxarı hissəyə)</td></tr>
          <tr><td>2500–8000 manat</td><td>75 m. + 10% (2500-dən yuxarı)</td></tr>
          <tr><td>8000-dən yuxarı</td><td>625 m. + 14% (8000-dən yuxarı)</td></tr>
        </table>
      </div>
    </div>

    <div class="card">
      <span class="tag">GƏLƏCƏK TƏQVİMİ</span>
      <h3>Ən aşağı pillənin mərhələli artımı</h3>
      <ul>
        <li><strong>2026:</strong> 3%</li>
        <li><strong>2027:</strong> 5%</li>
        <li><strong>2028 və sonrası:</strong> 7%</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">HR ÜÇÜN ƏMƏLİ MƏNA</span>
      <h3>Danışıqlarda nəyə diqqət etmək lazımdır</h3>
      <ul>
        <li><strong>Brutto vs netto fərqi</strong> — hansı rəqəmdən danışdığınızı aydın bildirin</li>
        <li><strong>Gözlənti idarəetməsi</strong> — 2026-da netto əvvəlkindən aşağı ola bilər</li>
        <li><strong>Büdcə planlaması</strong> — köhnə güzəştli hesablamalara əsaslanmayın</li>
      </ul>
    </div>
  `,

  numune: `
    <div class="lead">1000 manat brutto əməkhaqqı üzərindən, öyrənmək məqsədilə, addım-addım hesablama (2026 dərəcələri).</div>

    <div class="card">
      <span class="tag">ADDIM 1 — İŞÇİDƏN TUTULANLAR</span>
      <h3>Netto hesablama</h3>
      <ul>
        <li><strong>Gəlir vergisi:</strong> 30 manat</li>
        <li><strong>Sosial sığorta:</strong> 6 + 80 = 86 manat</li>
        <li><strong>Tibbi sığorta:</strong> 20 manat</li>
      </ul>
      <p><strong>Netto = 1000 − 30 − 86 − 20 = 864 manat</strong></p>
    </div>

    <div class="card">
      <span class="tag">ADDIM 2 — İŞƏGÖTÜRƏNDƏN ƏLAVƏ</span>
      <h3>İşəgötürənin real xərci</h3>
      <ul>
        <li><strong>Sosial sığorta:</strong> 44 + 120 = 164 manat</li>
        <li><strong>Tibbi sığorta:</strong> 20 manat</li>
      </ul>
      <p><strong>Ümumi xərc = 1000 + 164 + 20 = 1184 manat</strong></p>
    </div>

    <div class="card">
      <span class="tag">YEKUN CƏDVƏL</span>
      <h3>Bir baxışda</h3>
      <div class="tablewrap">
        <table>
          <tr><th>Göstərici</th><th>Məbləğ</th></tr>
          <tr><td>Brutto əməkhaqqı</td><td>1000 ₼</td></tr>
          <tr><td>İşçidən tutulan cəmi</td><td>136 ₼</td></tr>
          <tr><td>Netto</td><td>864 ₼</td></tr>
          <tr><td>İşəgötürənin ümumi xərci</td><td>1184 ₼</td></tr>
        </table>
      </div>
    </div>

    <p class="note">Sadələşdirilmiş öyrədici nümunədir — real hesablamalar üçün rəsmi kalkulyator istifadə edin.</p>
  `,

  emeliyyat: `
    <div class="lead">İşçinin işə qəbulundan işdən çıxmasına qədər, HR-in konkret olaraq etməli olduğu əməliyyatlar.</div>

    <div class="card">
      <span class="tag">MƏRHƏLƏ 1</span>
      <h3>İşə qəbul zamanı</h3>
      <ul>
        <li>Vəzifə profilini yazılı təsdiqləyin</li>
        <li>Brutto/netto fərqini təklif məktubunda göstərin</li>
        <li>ƏMAS-da yeni əmək müqaviləsini yaradın və doldurun</li>
        <li>Elektron imza (ASAN İmza/SİMA İmza) tələb edin</li>
        <li>Müqavilənin hər iki imzadan sonra qüvvəyə mindiyini yoxlayın</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">MƏRHƏLƏ 2</span>
      <h3>Hər ay təkrarlanan əməliyyatlar</h3>
      <ul>
        <li>Brutto əməkhaqqını hesablayın</li>
        <li>Gəlir vergisini, sosial və tibbi sığortanı hesablayıb tutun</li>
        <li>İşəgötürən payını ayrıca hesablayın</li>
        <li>Netto məbləği köçürün, tutumları dövlət hesablarına köçürün</li>
        <li>Aylıq hesabatları (e-taxes, sosial.gov.az) təqdim edin</li>
        <li>Əməkhaqqı vərəqəsini işçiyə əlçatan edin</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">MƏRHƏLƏ 3</span>
      <h3>Məzuniyyət, xəstəlik və ezamiyyət zamanı</h3>
      <ul>
        <li>İllik məzuniyyəti ƏMAS-da rəsmiləşdirin</li>
        <li>Xəstəlik vərəqəsinin ƏMAS-a düşdüyünü yoxlayın</li>
        <li>Ezamiyyə əmrini ƏMAS-da qeydə alın</li>
        <li>Ödənişsiz məzuniyyətdə tutum olmadığını nəzərə alın</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">MƏRHƏLƏ 4</span>
      <h3>Əməkhaqqı dəyişikliyi zamanı</h3>
      <ul>
        <li>Yeni məbləği ƏMAS-da müqaviləyə dəyişiklik kimi qeydə alın</li>
        <li>Yeni vergi/sığorta dilimini yenidən yoxlayın</li>
        <li>Bonusları da eyni qaydalarla vergiyə cəlb edin</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">MƏRHƏLƏ 5</span>
      <h3>İşdən çıxma (xitam) zamanı</h3>
      <ul>
        <li>Xitamın növünü düzgün müəyyən edin</li>
        <li>Son ödənişləri (məzuniyyət kompensasiyası daxil) hesablayın</li>
        <li>Xitamı ƏMAS-da rəsmiləşdirin</li>
        <li>Tələb olunarsa arayış təqdim edin</li>
      </ul>
    </div>

    <div class="card">
      <span class="tag">MƏRHƏLƏ 6</span>
      <h3>İllik/dövrü nəzarət</h3>
      <ul>
        <li>Yeni il dərəcələrini yoxlayın (2027: 5%)</li>
        <li>ƏMAS-dakı məlumatların aktuallığını yoxlayın</li>
        <li>Ödəniş hesabatlarını arxivləşdirin</li>
      </ul>
    </div>

    <p class="note">Konkret hüquqi tələblər üçün Əmək Məcəlləsinə və rəsmi dövlət portallarına istinad edin.</p>
  `,
};

export default function EmasIsbVergiGuide() {
  const [active, setActive] = useState("emas");
  const activeTab = TABS.find((t) => t.id === active);

  return (
    <div className="emas-guide">
      <style>{`
        .emas-guide{
          --ink:#1c2b22; --green-dark:#173226; --green-mid:#22503b;
          --cream:#f8f4e9; --card:#ffffff; --gold:#c8933f; --line:#e4ddc9;
          background:var(--cream); color:var(--ink);
          font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          border-radius:16px; overflow:hidden;
        }
        @media (prefers-color-scheme: dark){
          .emas-guide{ --cream:#12140f; --card:#1c2018; --ink:#eee7d6; --line:#33392c; }
        }
        .emas-guide .eg-header{
          background:linear-gradient(135deg,var(--green-dark),var(--green-mid));
          color:#f3efe0; padding:24px 20px 20px; position:relative; overflow:hidden;
        }
        .emas-guide .eg-eyebrow{ font-size:12px; letter-spacing:.06em; color:var(--gold); font-weight:700; margin-bottom:6px; }
        .emas-guide .eg-title{ font-family:Georgia,"Times New Roman",serif; font-weight:400; font-size:24px; margin:0 0 16px; }
        .emas-guide .eg-tabs{ display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; }
        .emas-guide .eg-tabs::-webkit-scrollbar{ display:none; }
        .emas-guide .eg-tab-btn{
          flex:0 0 auto; border:1px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.08);
          color:#f3efe0; padding:9px 15px; border-radius:999px; font-size:13.5px; font-weight:600;
          cursor:pointer; white-space:nowrap; transition:background .15s ease;
        }
        .emas-guide .eg-tab-btn.active{ background:var(--cream); color:var(--green-dark); border-color:var(--cream); }
        .emas-guide .eg-main{ padding:18px; }
        .emas-guide .lead{ background:rgba(34,80,59,0.08); border:1px solid var(--line); border-radius:14px; padding:14px 16px; font-size:14.5px; line-height:1.55; margin-bottom:14px; }
        .emas-guide .card{ background:var(--card); border:1px solid var(--line); border-radius:14px; padding:16px; margin-bottom:12px; }
        .emas-guide .card h3{ font-family:Georgia,"Times New Roman",serif; font-weight:400; font-size:17px; margin:0 0 8px; }
        .emas-guide .card p, .emas-guide .card li{ font-size:14px; line-height:1.6; margin:0 0 6px; }
        .emas-guide .card ul{ margin:6px 0 0; padding-left:18px; }
        .emas-guide table{ width:100%; border-collapse:collapse; font-size:13px; margin-top:6px; }
        .emas-guide th, .emas-guide td{ text-align:left; padding:7px 6px; border-bottom:1px solid var(--line); }
        .emas-guide th{ color:var(--green-mid); font-size:11.5px; }
        .emas-guide .tablewrap{ overflow-x:auto; }
        .emas-guide .tag{ display:inline-block; font-size:11px; font-weight:700; color:var(--green-mid); background:rgba(34,80,59,0.1); padding:3px 9px; border-radius:999px; margin-bottom:9px; }
        .emas-guide .note{ font-size:12.5px; color:#7a7360; margin-top:12px; line-height:1.5; }
      `}</style>

      <div className="eg-header">
        <div className="eg-eyebrow">HR MATE</div>
        <h2 className="eg-title">{activeTab.title}</h2>
        <nav className="eg-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`eg-tab-btn${active === tab.id ? " active" : ""}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="eg-main">
        <div dangerouslySetInnerHTML={{ __html: PANELS[active] }} />
      </div>
    </div>
  );
}