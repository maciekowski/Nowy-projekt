/* BeatTheATS i18n — minimal dictionary-based translation layer.
   Adding a new language later = adding one more key to I18N and PRICING. No structural change needed. */

const PRICING = {
  pl: { display: "29 zł", currency: "PLN" },
  en: { display: "€7.99", currency: "EUR" },
};

const I18N = {
  pl: {
    page_title: "BeatTheATS — Darmowe sprawdzenie CV pod ATS",
    page_description: "Sprawdź, czy Twoje CV przejdzie przez systemy ATS, zanim wyślesz je do pracodawcy. Darmowy wynik w 10 sekund.",
    nav_cta: "Sprawdź CV za darmo",
    hero_h1_html: "Twoje CV może zostać odrzucone przez <span class=\"hl\">robota</span>, zanim zobaczy je człowiek.",
    hero_sub: "Coraz więcej firm w Polsce i Europie filtruje CV systemami ATS, zanim rekruter je zobaczy. Wklej CV i ogłoszenie o pracę poniżej, aby zobaczyć swój wynik dopasowania w 10 sekund. Za darmo.",
    hero_cta: "Sprawdź CV — za darmo",
    hero_trust: "Bez rejestracji. Bez podawania e-maila. Twój tekst nie opuszcza przeglądarki, dopóki nie zdecydujesz się odblokować pełnego raportu.",
    step1_title: "Wklej",
    step1_desc: "Treść swojego CV oraz ogłoszenie o pracę, na które aplikujesz.",
    step2_title: "Wynik",
    step2_desc: "Natychmiastowy wynik dopasowania ATS + czego brakuje, prosto w przeglądarce.",
    step3_title: "Popraw",
    step3_desc: "Odblokuj pełny raport braków słów kluczowych za {price} i popraw CV przed wysłaniem.",
    tool_h2: "Sprawdź swoje CV",
    resume_label: "Twoje CV (wklej jako zwykły tekst)",
    resume_placeholder: "Wklej tutaj pełną treść swojego CV...",
    job_label: "Ogłoszenie o pracę, na które aplikujesz",
    job_placeholder: "Wklej tutaj pełną treść ogłoszenia o pracę...",
    analyze_btn: "Analizuj dopasowanie →",
    error_msg: "Wklej pełną treść CV oraz pełną treść ogłoszenia o pracę (co najmniej kilka zdań każde), aby uzyskać dokładny wynik.",
    matched_h3: "✅ Słowa kluczowe, które już masz",
    matched_none: "brak dopasowań",
    missing_h3: "⚠️ Brakujące słowa kluczowe",
    locked_text: "Jeszcze <strong>{count}</strong> brakujących słów kluczowych, poprawek formatowania i konkretnych sugestii znajdziesz w pełnym raporcie.",
    unlock_btn: "Odblokuj pełny raport — {price}",
    tips_h3: "🛠️ Szybkie wskazówki",
    print_btn: "Pobierz / wydrukuj pełny raport (PDF)",
    footer_text: "BeatTheATS — odpowiadamy na jedno pytanie: dlaczego nawet nie oddzwonili? Bez konta, bez śledzenia poza anonimowymi licznikami użycia. Kontakt: hello@beattheats.example",
    score_headline_good: "Dobre dopasowanie — drobne braki do uzupełnienia",
    score_headline_partial: "Częściowe dopasowanie — realne braki do naprawienia",
    score_headline_low: "Niskie dopasowanie — to CV najprawdopodobniej nie przejdzie przez ATS dla tej oferty",
    score_text: "Dopasowano {matched} z {total} kluczowych terminów z ogłoszenia, plus {passed}/{checks} sprawdzeń formatowania zaliczonych.",
    tip_missing_keywords: "Dodaj te brakujące słowa kluczowe w naturalny sposób do swoich punktów w CV: {list}.",
    tip_email: "Dodaj czytelny adres e-mail blisko góry CV — niektóre systemy ATS nie odczytują danych kontaktowych z nagłówków/stopek.",
    tip_phone: "Dodaj numer telefonu jako zwykły tekst, nie w polu tekstowym ani obrazku.",
    tip_length: "Twoje CV wygląda na krótkie — ATS i rekruterzy oczekują wystarczającej ilości szczegółów (celuj w 1 pełną stronę, 400+ słów).",
    tip_experience: "Użyj standardowego nagłówka sekcji, dosłownie „Doświadczenie zawodowe” — kreatywne nagłówki mogą mylić parsery ATS.",
    tip_education: "Dodaj wyraźnie oznaczoną sekcję „Wykształcenie”.",
    tip_skills: "Dodaj osobną sekcję „Umiejętności” z listą kluczowych narzędzi/technologii — wiele systemów ATS mocno ją waży.",
    tip_score_high: "Twój wynik dopasowania jest wysoki — przed wysłaniem wystarczą drobne poprawki.",
    tip_score_low: "Twój wynik dopasowania jest niski — to CV prawdopodobnie wymaga dodania konkretnych słów kluczowych przed aplikowaniem na to stanowisko.",
  },
  en: {
    page_title: "BeatTheATS — Free ATS Resume Checker for Europe",
    page_description: "Check whether your resume will pass ATS screening before you send it. Free score in 10 seconds. Built for Poland & Europe.",
    nav_cta: "Check my resume free",
    hero_h1_html: "Your resume might be getting rejected by a <span class=\"hl\">robot</span> — before a human ever sees it.",
    hero_sub: "A growing number of employers across Poland and Europe filter resumes with ATS software before a recruiter reads them. Paste your resume and the job ad below to see your match score in 10 seconds. Free.",
    hero_cta: "Check my resume — free",
    hero_trust: "No signup. No email required. Your text never leaves your browser until you choose to unlock the full report.",
    step1_title: "Paste",
    step1_desc: "Your resume text and the job description you're applying to.",
    step2_title: "Score",
    step2_desc: "Instant ATS match score + what's missing, right in your browser.",
    step3_title: "Fix",
    step3_desc: "Unlock the full keyword gap report for {price} and fix it before you apply.",
    tool_h2: "Check your resume",
    resume_label: "Your resume (paste as plain text)",
    resume_placeholder: "Paste your full resume text here...",
    job_label: "Job description you're applying to",
    job_placeholder: "Paste the full job posting here...",
    analyze_btn: "Analyze match →",
    error_msg: "Please paste your full resume and the full job description (at least a few sentences each) for an accurate score.",
    matched_h3: "✅ Keywords you already have",
    matched_none: "none found",
    missing_h3: "⚠️ Missing keywords",
    locked_text: "<strong>{count}</strong> more missing keywords, formatting fixes, and specific rewrite suggestions are in the full report.",
    unlock_btn: "Unlock full report — {price}",
    tips_h3: "🛠️ Quick tips",
    print_btn: "Download / Print full report (PDF)",
    footer_text: "BeatTheATS — built to answer one question: why didn't I even get a callback? No account, no tracking beyond anonymous usage counts. Contact: hello@beattheats.example",
    score_headline_good: "Good match — small gaps to close",
    score_headline_partial: "Partial match — real gaps to fix",
    score_headline_low: "Low match — this resume likely won't pass ATS for this job",
    score_text: "Matched {matched} of {total} key terms from the job description, plus {passed}/{checks} formatting checks passed.",
    tip_missing_keywords: "Add these missing keywords naturally into your bullet points: {list}.",
    tip_email: "Add a clear email address near the top — some ATS parsers can't extract contact info from headers/footers.",
    tip_phone: "Add a phone number in plain text, not inside an image or text box.",
    tip_length: "Your resume looks short — ATS and recruiters both expect enough detail to match against the job (aim for 1 full page, 400+ words).",
    tip_experience: 'Use a standard section header literally named "Experience" or "Work Experience" — creative headers can confuse ATS parsers.',
    tip_education: 'Add a clearly labeled "Education" section.',
    tip_skills: 'Add a dedicated "Skills" section listing key tools/technologies — many ATS systems weight this section heavily.',
    tip_score_high: "Your match score is strong — minor tweaks only before you apply.",
    tip_score_low: "Your match score is low — this resume likely needs targeted keyword additions before applying to this specific job.",
  },
};

function detectDefaultLang() {
  try {
    const saved = localStorage.getItem("bta_lang");
    if (saved && I18N[saved]) return saved;
  } catch (e) {}
  const nav = ((navigator && navigator.language) || "pl").toLowerCase();
  return nav.startsWith("pl") ? "pl" : "en";
}

let currentLang = detectDefaultLang();

function t(key, vars) {
  let str = (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  if (vars) {
    Object.keys(vars).forEach(k => { str = str.split(`{${k}}`).join(vars[k]); });
  }
  return str;
}

function currentPrice() {
  return PRICING[currentLang] || PRICING.en;
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.title = t("page_title");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", t("page_description"));

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"), { price: currentPrice().display });
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"), { price: currentPrice().display });
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
  });
}
