/* BeatTheATS — client-side ATS match scoring engine.
   No backend, no LLM call: pure keyword/heuristic algorithm so unit cost per analysis is 0. */

// ---- CONFIG -----------------------------------------------------------
// TODO(owner): replace with your real Gumroad/Stripe Payment Link product URL.
// Set the product's "post-purchase redirect URL" to:
//   https://<your-domain>/index.html?unlocked=1
// so the buyer lands back here with the full report unlocked.
const PAYMENT_LINK_URL = "https://gumroad.com/YOUR_PRODUCT_HERE";

const STOPWORDS = new Set(("a about above after again against all am an and any are aren't as at be because "+
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
"demonstrated proven track record years' minimum bonus nice have must haves").split(/\s+/));

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
  "quickbooks","excel","powerpoint","word","java","c++","c#","html","css","rest api","graphql"
];

const REQUIREMENT_SECTION_HINTS = ["requirement","qualification","must have","you have","you bring",
  "what you'll need","what we're looking for","skills","responsibilities","preferred"];

// ---- TEXT UTILS ---------------------------------------------------------
function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#. \n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    const found = k.includes(" ") ? resumeNorm.includes(k) : new RegExp(`\\b${escapeRegex(k)}\\b`).test(resumeNorm);
    (found ? matched : missing).push(k);
  });

  const keywordScore = keywords.length ? (matched.length / keywords.length) : 1;

  // formatting / parseability checks
  const wordCount = (resumeText || "").trim().split(/\s+/).filter(Boolean).length;
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText || "");
  const hasPhone = /(\+?\d[\d .()-]{7,}\d)/.test(resumeText || "");
  const hasExperienceSection = /experience|employment|work history/i.test(resumeText || "");
  const hasEducationSection = /education|degree|university|college/i.test(resumeText || "");
  const hasSkillsSection = /skills/i.test(resumeText || "");

  const formatChecks = [
    { label: "Contact email detected", pass: hasEmail },
    { label: "Phone number detected", pass: hasPhone },
    { label: "Resume length is sufficient (150+ words)", pass: wordCount >= 150 },
    { label: `"Experience" section header found`, pass: hasExperienceSection },
    { label: `"Education" section header found`, pass: hasEducationSection },
    { label: `"Skills" section header found`, pass: hasSkillsSection },
  ];
  const formatScore = formatChecks.filter(c => c.pass).length / formatChecks.length;

  const overall = Math.round((keywordScore * 0.7 + formatScore * 0.3) * 100);

  const tips = buildTips({ overall, missing, formatChecks, wordCount });

  return { overall, matched, missing, formatChecks, tips, keywordCount: keywords.length };
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function buildTips({ overall, missing, formatChecks, wordCount }) {
  const tips = [];
  if (missing.length > 0) {
    tips.push(`Add these missing keywords naturally into your bullet points: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? ", …" : ""}.`);
  }
  formatChecks.filter(c => !c.pass).forEach(c => {
    if (c.label.includes("email")) tips.push("Add a clear email address near the top — some ATS parsers can't extract contact info from headers/footers.");
    else if (c.label.includes("Phone")) tips.push("Add a phone number in plain text, not inside an image or text box.");
    else if (c.label.includes("length")) tips.push("Your resume looks short — ATS and recruiters both expect enough detail to match against the job (aim for 1 full page, 400+ words).");
    else if (c.label.includes("Experience")) tips.push('Use a standard section header literally named "Experience" or "Work Experience" — creative headers can confuse ATS parsers.');
    else if (c.label.includes("Education")) tips.push('Add a clearly labeled "Education" section.');
    else if (c.label.includes("Skills")) tips.push('Add a dedicated "Skills" section listing key tools/technologies — many ATS systems weight this section heavily.');
  });
  if (overall >= 80) tips.push("Your match score is strong — minor tweaks only before you apply.");
  else if (overall < 40) tips.push("Your match score is low — this resume likely needs targeted keyword additions before applying to this specific job.");
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
    ? "Good match — small gaps to close"
    : result.overall >= 40
      ? "Partial match — real gaps to fix"
      : "Low match — this resume likely won't pass ATS for this job";
  $("#scoreText").textContent = `Matched ${result.matched.length} of ${result.keywordCount} key terms from the job description, plus ${result.formatChecks.filter(c=>c.pass).length}/${result.formatChecks.length} formatting checks passed.`;

  const matchedList = $("#matchedList");
  matchedList.innerHTML = "";
  (result.matched.length ? result.matched : ["none found"]).forEach(k => {
    const li = document.createElement("li"); li.textContent = k; matchedList.appendChild(li);
  });

  const freeMissing = result.missing.slice(0, 2);
  const lockedCount = Math.max(result.missing.length - freeMissing.length, 0);

  const missingFree = $("#missingListFree");
  missingFree.innerHTML = "";
  freeMissing.forEach(k => { const li = document.createElement("li"); li.textContent = k; li.style.borderColor = "var(--danger)"; li.style.color = "var(--danger)"; missingFree.appendChild(li); });

  $("#lockedCount").textContent = lockedCount > 0 ? `+${lockedCount}` : "0";
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

document.addEventListener("DOMContentLoaded", () => {
  trackEvent("page_view");

  $("#analyzeBtn").addEventListener("click", () => {
    const resumeText = $("#resumeInput").value.trim();
    const jobText = $("#jobInput").value.trim();
    const err = $("#errorMsg");

    if (resumeText.length < 50 || jobText.length < 50) {
      err.hidden = false;
      err.textContent = "Please paste your full resume and the full job description (at least a few sentences each) for an accurate score.";
      return;
    }
    err.hidden = true;

    const result = analyze(resumeText, jobText);
    try { localStorage.setItem("bta_last_result", JSON.stringify(result)); } catch (e) {}
    trackEvent("analysis_run");
    renderResults(result);
  });

  $("#unlockBtn").addEventListener("click", () => {
    trackEvent("unlock_click");
    window.location.href = PAYMENT_LINK_URL;
  });

  $("#printBtn").addEventListener("click", () => window.print());

  // Returning from a successful payment: Gumroad/Stripe redirect includes ?unlocked=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("unlocked") === "1") {
    try {
      const cached = JSON.parse(localStorage.getItem("bta_last_result") || "null");
      if (cached) {
        renderResults(cached);
        unlockFullReport();
        trackEvent("purchase_completed");
      }
    } catch (e) {}
  }
});
