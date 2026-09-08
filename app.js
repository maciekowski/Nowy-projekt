/* BeatTheATS — client-side ATS match scoring engine.
   No backend, no LLM call: pure keyword/heuristic algorithm so unit cost per analysis is 0. */

// ---- CONFIG -----------------------------------------------------------
// TODO(owner): replace with your real Gumroad/Stripe Payment Link product URL.
// Set the product's "post-purchase redirect URL" to:
//   https://<your-domain>/index.html?unlocked=1
// so the buyer lands back here with the full report unlocked.
const PAYMENT_LINK_URL = "https://gumroad.com/YOUR_PRODUCT_HERE";

const STOPWORDS_EN = ("a about above after again against all am an and any are aren't as at be because "+
"been before being below between both but by can't cannot could couldn't did didn't do does doesn't doing don't "+
"down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here "+
"here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's "+
"me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own "+
"same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them "+
"themselves then there there's these they they'd they'll they're they've this those through to too under until "+
"up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who "+
"who's whom why why's will with won't would wouldn't you you'd you'll you're you've your yours yourself "+
"yourselves will using use used able etc within across per year years work team role experience strong good "+
"excellent including include including looking related job company job's ideal candidate candidates preferred "+
"required requirements responsibilities responsible ability skills skill plus new join joining opportunity "+
"environment environment's client clients business please apply familiarity familiar knowledge understanding "+
"demonstrated proven track record years' minimum bonus nice have must haves").split(/\s+/);

// Polish stopwords — needed because Polish job ads/CVs otherwise have almost nothing filtered out.
const STOPWORDS_PL = ("i oraz lub oraz w we na do od dla o z ze za pod nad po przez między bez dla jako aby żeby "+
"się to jest są być był była było byli były ten ta te ci tego tej tych temu tym która który które którzy "+
"jak gdzie kiedy dlaczego co kto czy nie tak już jeszcze bardzo tylko może można trzeba musi powinien "+
"nasz nasza nasze nasi twój twoja twoje jego jej ich swój swoja swoje mój moja moje "+
"praca pracy pracownik pracownika pracownicy firma firmy firmie oferujemy oferta ofercie wymagania "+
"wymagamy oczekujemy mile widziane doświadczenie doświadczenia znajomość umiejętności obowiązki "+
"zakres odpowiedzialności osoba osoby kandydat kandydatka kandydaci zespół zespole rok lata lat "+
"miesiąc miesiące proszę aplikuj aplikacja aplikacji kontakt kontaktu numer telefon email adres "+
"stanowisko stanowisku dołącz dołączyć min minimum plus nowe nowy nowa dodatkowo także również "+
"przy przy tym poprzez wśród jednak natomiast oraz aktualnie obecnie poszukujemy poszukuje kat widziana widziane "+
"widziany szukamy zatrudnimy zatrudnię").split(/\s+/);

const STOPWORDS = new Set([...STOPWORDS_EN, ...STOPWORDS_PL]);

// Multi-word skill phrases we specifically look for (checked before single-word tokenizing).
const SKILL_PHRASES = [
  "project management","product management","customer service","customer success","data analysis",
  "data analytics","machine learning","deep learning","artificial intelligence","google analytics",
  "microsoft excel","microsoft office","google ads","social media","content marketing","email marketing",
  "search engine optimization","paid media","public speaking","team leadership","people management",
  "time management","problem solving","critical thinking","attention to detail","cross-functional",
  "stakeholder management","agile methodology","scrum master","software development","full stack",
  "front end","back end","user experience","user interface","quality assurance","supply chain",
  "financial modeling","financial analysis","account management","business development","sales pipeline",
  "salesforce","power bi","tableau","python","javascript","typescript","react","node.js","sql","aws",
  "azure","gcp","kubernetes","docker","git","figma","adobe photoshop","adobe illustrator","hubspot",
  "quickbooks","excel","powerpoint","word","java","c++","c#","html","css","rest api","graphql",
  // Polish skill/qualification phrases commonly found in Polish job ads.
  "obsługa klienta","obsługa komputera","znajomość języka angielskiego","znajomość języka niemieckiego",
  "prawo jazdy kat. b","prawo jazdy","praca w zespole","zarządzanie projektem","zarządzanie zespołem",
  "analiza danych","obsługa kasy fiskalnej","dyspozycyjność","komunikatywność","sumienność",
  "mile widziane","pakiet office","microsoft office","język angielski","język niemiecki",
  "obsługa programów księgowych","prowadzenie dokumentacji","sprzedaż bezpośrednia","obsługa magazynu"
];

const REQUIREMENT_SECTION_HINTS = ["requirement","qualification","must have","you have","you bring",
  "what you'll need","what we're looking for","skills","responsibilities","preferred",
  "wymagania","oczekujemy","mile widziane","zakres obowiązków","obowiązki","wymagamy"];

// ---- TEXT UTILS ---------------------------------------------------------
function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9ąćęłńóśźż+#. \n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Cheap inflection tolerance for Polish (and harmless for English): compare a shortened
// prefix instead of requiring an exact match, only for longer words where this is safe.
function stem(word) {
  if (word.length >= 7) return word.slice(0, word.length - 3);
  if (word.length >= 5) return word.slice(0, word.length - 1);
  return word;
}

function fuzzyContains(normText, word) {
  if (new RegExp(`\\b${escapeRegex(word)}\\b`).test(normText)) return true;
  if (word.length < 5) return false;
  const wordStem = stem(word);
  return new RegExp(`\\b${escapeRegex(wordStem)}\\w*`).test(normText);
}

function tokenize(normText) {
  return normText
    .split(" ")
    .map(w => w.replace(/^\.+|\.+$/g, "")) // strip stray leading/trailing dots, keep internal ones (node.js)
    .filter(w => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
}

function containsPhrase(normText, phrase) {
  return new RegExp(`\\b${escapeRegex(phrase)}\\b`).test(normText);
}

// ---- CORE ANALYSIS -------------------------------------------------------
function extractKeywords(jobText) {
  const norm = normalize(jobText);
  const lines = (jobText || "").toLowerCase().split("\n");

  // weight lines that look like a requirements/skills section higher
  const boostedText = lines
    .map(line => {
      const isBoosted = REQUIREMENT_SECTION_HINTS.some(h => line.includes(h));
      return isBoosted ? (line + " " + line) : line; // duplicate to double-weight
    })
    .join(" ");
  const boostedNorm = normalize(boostedText);

  const freq = {};
  tokenize(boostedNorm).forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  // detect known multi-word skill phrases present in the JD
  const phraseHits = SKILL_PHRASES.filter(p => containsPhrase(norm, p));

  // remove single words that are already covered by a matched phrase (avoid double counting)
  const phraseWords = new Set(phraseHits.join(" ").split(" "));
  const rankedWords = Object.entries(freq)
    .filter(([w]) => !phraseWords.has(w))
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);

  const combined = [...phraseHits, ...rankedWords];
  // dedupe, cap at 20 keywords total
  const seen = new Set();
  const keywords = [];
  for (const k of combined) {
    if (!seen.has(k)) { seen.add(k); keywords.push(k); }
    if (keywords.length >= 20) break;
  }
  return keywords;
}

function analyze(resumeText, jobText) {
  const resumeNorm = normalize(resumeText);
  const keywords = extractKeywords(jobText);

  const matched = [];
  const missing = [];
  keywords.forEach(k => {
    const found = k.includes(" ") ? resumeNorm.includes(k) : fuzzyContains(resumeNorm, k);
    (found ? matched : missing).push(k);
  });

  const keywordScore = keywords.length ? (matched.length / keywords.length) : 1;

  // formatting / parseability checks
  const wordCount = (resumeText || "").trim().split(/\s+/).filter(Boolean).length;
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText || "");
  const hasPhone = /(\+?\d[\d .()-]{7,}\d)/.test(resumeText || "");
  const hasExperienceSection = /experience|employment|work history|doświadczenie|zatrudnienie|przebieg (zatrudnienia|pracy)/i.test(resumeText || "");
  const hasEducationSection = /education|degree|university|college|wykształcenie|edukacja|uczelni|studia/i.test(resumeText || "");
  const hasSkillsSection = /skills|umiejętności|kompetencje/i.test(resumeText || "");

  const formatChecks = [
    { key: "email", pass: hasEmail },
    { key: "phone", pass: hasPhone },
    { key: "length", pass: wordCount >= 150 },
    { key: "experience", pass: hasExperienceSection },
    { key: "education", pass: hasEducationSection },
    { key: "skills", pass: hasSkillsSection },
  ];
  const formatScore = formatChecks.filter(c => c.pass).length / formatChecks.length;

  const overall = Math.round((keywordScore * 0.7 + formatScore * 0.3) * 100);

  const tips = buildTips({ overall, missing, formatChecks, wordCount });

  return { overall, matched, missing, formatChecks, tips, keywordCount: keywords.length };
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

const TIP_KEY_BY_CHECK = {
  email: "tip_email", phone: "tip_phone", length: "tip_length",
  experience: "tip_experience", education: "tip_education", skills: "tip_skills",
};

function buildTips({ overall, missing, formatChecks }) {
  const tips = [];
  if (missing.length > 0) {
    const list = missing.slice(0, 6).join(", ") + (missing.length > 6 ? ", …" : "");
    tips.push(t("tip_missing_keywords", { list }));
  }
  formatChecks.filter(c => !c.pass).forEach(c => {
    const key = TIP_KEY_BY_CHECK[c.key];
    if (key) tips.push(t(key));
  });
  if (overall >= 80) tips.push(t("tip_score_high"));
  else if (overall < 40) tips.push(t("tip_score_low"));
  return tips;
}

// ---- UI WIRING -----------------------------------------------------------
const $ = sel => document.querySelector(sel);

function renderResults(result) {
  $("#results").hidden = false;
  $("#results").scrollIntoView({ behavior: "smooth" });

  $("#scoreValue").textContent = result.overall;
  const circle = $("#scoreCircle");
  circle.style.borderColor = result.overall >= 70 ? "var(--accent-2)" : result.overall >= 40 ? "var(--warn)" : "var(--danger)";

  $("#scoreHeadline").textContent = result.overall >= 70
    ? t("score_headline_good")
    : result.overall >= 40
      ? t("score_headline_partial")
      : t("score_headline_low");
  $("#scoreText").textContent = t("score_text", {
    matched: result.matched.length,
    total: result.keywordCount,
    passed: result.formatChecks.filter(c => c.pass).length,
    checks: result.formatChecks.length,
  });

  const matchedList = $("#matchedList");
  matchedList.innerHTML = "";
  (result.matched.length ? result.matched : [t("matched_none")]).forEach(k => {
    const li = document.createElement("li"); li.textContent = k; matchedList.appendChild(li);
  });

  const freeMissing = result.missing.slice(0, 2);
  const lockedCount = Math.max(result.missing.length - freeMissing.length, 0);

  const missingFree = $("#missingListFree");
  missingFree.innerHTML = "";
  freeMissing.forEach(k => { const li = document.createElement("li"); li.textContent = k; li.style.borderColor = "var(--danger)"; li.style.color = "var(--danger)"; missingFree.appendChild(li); });

  $("#lockedText").innerHTML = t("locked_text", { count: `+${lockedCount}` });
  $("#lockedOverlay").hidden = lockedCount === 0;

  const missingFull = $("#missingListFull");
  missingFull.innerHTML = "";
  result.missing.forEach(k => { const li = document.createElement("li"); li.textContent = k; missingFull.appendChild(li); });

  const tipsFree = $("#tipsListFree");
  tipsFree.innerHTML = "";
  result.tips.slice(0, 2).forEach(t => { const li = document.createElement("li"); li.textContent = t; tipsFree.appendChild(li); });

  const tipsFull = $("#tipsListFull");
  tipsFull.innerHTML = "";
  result.tips.forEach(t => { const li = document.createElement("li"); li.textContent = t; tipsFull.appendChild(li); });
}

function unlockFullReport() {
  $("#missingListFree").hidden = true;
  $("#lockedOverlay").hidden = true;
  $("#missingListFull").hidden = false;
  $("#tipsListFree").hidden = true;
  $("#tipsListFull").hidden = false;
  $("#fullReportActions").hidden = false;
}

function trackEvent(name) {
  try {
    const key = "bta_events";
    const events = JSON.parse(localStorage.getItem(key) || "{}");
    events[name] = (events[name] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(events));
  } catch (e) { /* localStorage unavailable — non-fatal */ }
}

let lastResult = null;
let isUnlocked = false;

document.addEventListener("DOMContentLoaded", () => {
  applyStaticTranslations();
  trackEvent("page_view");

  $("#analyzeBtn").addEventListener("click", () => {
    const resumeText = $("#resumeInput").value.trim();
    const jobText = $("#jobInput").value.trim();
    const err = $("#errorMsg");

    if (resumeText.length < 50 || jobText.length < 50) {
      err.hidden = false;
      err.textContent = t("error_msg");
      return;
    }
    err.hidden = true;

    const result = analyze(resumeText, jobText);
    lastResult = result;
    isUnlocked = false;
    try { localStorage.setItem("bta_last_result", JSON.stringify(result)); } catch (e) {}
    trackEvent("analysis_run");
    renderResults(result);
  });

  $("#unlockBtn").addEventListener("click", () => {
    trackEvent("unlock_click");
    window.location.href = PAYMENT_LINK_URL;
  });

  $("#printBtn").addEventListener("click", () => window.print());

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      currentLang = lang;
      try { localStorage.setItem("bta_lang", lang); } catch (e) {}
      applyStaticTranslations();
      if (lastResult) {
        renderResults(lastResult);
        if (isUnlocked) unlockFullReport();
      }
    });
  });

  // Returning from a successful payment: Gumroad/Stripe redirect includes ?unlocked=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("unlocked") === "1") {
    try {
      const cached = JSON.parse(localStorage.getItem("bta_last_result") || "null");
      if (cached) {
        lastResult = cached;
        isUnlocked = true;
        renderResults(cached);
        unlockFullReport();
        trackEvent("purchase_completed");
      }
    } catch (e) {}
  }
});
