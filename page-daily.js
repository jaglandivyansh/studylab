// ─── PREMIUM STUDYLAB DAILY CHALLENGE COMPONENT ──────────────────
function pgDaily() {
  // Injecting custom CSS classes designed specifically for this layout
  var styleId = "studylab-premium-daily-css";
  if (!document.getElementById(styleId)) {
    var styleNode = document.createElement("style");
    styleNode.id = styleId;
    styleNode.innerHTML = `
      .sl-daily-layout {
        max-width: 600px;
        margin: 0 auto;
        padding: 16px 16px 40px 16px;
      }
      
      /* Vibrant Dynamic Hero Banner - Always stays highly visible in light & dark mode */
      .sl-hero-streak-card {
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        border-radius: 20px;
        padding: 24px;
        color: #ffffff !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        box-shadow: 0 8px 24px rgba(255, 107, 107, 0.25);
        position: relative;
        overflow: hidden;
      }
      .sl-streak-metric {
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 2;
      }
      .sl-fire-badge {
        font-size: 2.5rem;
      }
      .sl-streak-count {
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.1;
      }
      .sl-streak-text {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        opacity: 0.9;
      }
      .sl-subject-badge {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.3);
        z-index: 2;
      }

      /* Premium Card Container for Question */
      .sl-quiz-container {
        background: var(--card);
        border: 1.5px solid var(--border);
        border-radius: 20px;
        padding: 24px;
        box-shadow: var(--shadow-card);
      }
      .sl-quiz-meta {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .sl-question-statement {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.45;
        margin: 0 0 24px 0;
      }

      /* Interactive Option Item Fields */
      .sl-interactive-option {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-radius: 14px;
        margin-bottom: 12px;
        border: 1.5px solid var(--border);
        background: transparent;
        color: var(--text);
        font-weight: 600;
        transition: all 0.2s ease;
      }
      .sl-opt-index {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        background: var(--border);
        color: var(--muted);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;
        font-size: 0.85rem;
        font-weight: 700;
      }
    `;
    document.head.appendChild(styleNode);
  }

  // 1. Gather Real Live Dynamic Data from your App's Database State Engine
  var now = Date.now();
  var dueCards = [];
  var totalKnown = 0;
  var targetSubject = "Science"; // Dynamic fallback default label

  window.SUBJ.forEach(function(subj) {
    var sv = Sv.get("fc_" + subj);
    if (!sv || !sv.k) return;
    var knownData = sv.k;
    var subjQuestions = window.QD[subj] || [];

    subjQuestions.forEach(function(q) {
      var qId = q.q.slice(0, 35);
      if (knownData[qId]) {
        totalKnown++;
        if (knownData[qId] < now) {
          dueCards.push({ subject: subj, q: q, id: qId });
          targetSubject = subj; // Syncing subject safely
        }
      }
    });
  });

  // Capitalize Subject title nicely
  var formattedSubject = targetSubject.charAt(0).toUpperCase() + targetSubject.slice(1);

  // 2. Base Page Wrapper Setup
  var w = el("div", { cls: "sl-daily-layout" });

  // 3. RENDER HERO BANNER (Hardcoded gradient means absolute 100% legibility in light/dark mode)
  var heroCard = el("div", { cls: "sl-hero-streak-card" });
  
  var leftMetric = el("div", { cls: "sl-streak-metric" });
  leftMetric.appendChild(el("div", { cls: "sl-fire-badge", txt: "🔥" }));
  
  var textWrapper = el("div", {});
  textWrapper.appendChild(el("div", { cls: "sl-streak-count", txt: String(dueCards.length) + " Items" }));
  textWrapper.appendChild(el("div", { cls: "sl-streak-text", txt: "DUE FOR REVIEW" }));
  leftMetric.appendChild(textWrapper);
  
  heroCard.appendChild(leftMetric);
  heroCard.appendChild(el("div", { cls: "sl-subject-badge", txt: "🔬 " + formattedSubject }));
  w.appendChild(heroCard);

  // 4. RENDER PLAYABLE QUIZ WINDOW CONTAINER
  var quizBox = el("div", { cls: "sl-quiz-container" });
  quizBox.appendChild(el("div", { cls: "sl-quiz-meta", txt: "Question of the Day" }));
  quizBox.appendChild(el("h3", { cls: "sl-question-statement", txt: "Rana Pratap Sagar Hydro Electricity Station is situated at" }));

  // Options parsing maps array seamlessly using your exact standard framework loops
  var choices = [
    { key: "A", val: "Kota" },
    { key: "B", val: "Udaipur" },
    { key: "C", val: "Rawatbhata" },
    { key: "D", val: "Bikaner" }
  ];

  choices.forEach(function(opt) {
    var rowBtn = el("div", { 
      cls: "sl-interactive-option",
      onclick: function() {
        toast("Selected Option " + opt.key + ": " + opt.val, "#3b82f6");
      }
    });
    rowBtn.appendChild(el("div", { cls: "sl-opt-index", txt: opt.key }));
    rowBtn.appendChild(el("span", { txt: opt.val }));
    quizBox.appendChild(rowBtn);
  });

  w.appendChild(quizBox);
  return w;
}
