function pgDaily() {
  // ─── PREMIUM DESIGN STYLESHEET INJECTION ──────────────────────────
  var styleId = "studylab-premium-daily-css";
  if (!document.getElementById(styleId)) {
    var styleNode = document.createElement("style");
    styleNode.id = styleId;
    styleNode.innerHTML = `
      .sl-daily-layout {
        max-width: 550px;
        margin: 0 auto;
        padding: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      /* Gamified Hero Banner */
      .sl-hero-streak-card {
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        border-radius: 24px;
        padding: 24px;
        color: #ffffff !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
        position: relative;
        overflow: hidden;
      }
      .sl-hero-streak-card::before {
        content: "";
        position: absolute;
        right: -20px;
        bottom: -20px;
        width: 120px;
        height: 120px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
      }
      .sl-streak-metric {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .sl-fire-badge {
        font-size: 2.8rem;
        animation: pulse-fire 2s infinite alternate;
      }
      @keyframes pulse-fire {
        0% { transform: scale(1); }
        100% { transform: scale(1.08); }
      }
      .sl-streak-count {
        font-size: 2.2rem;
        font-weight: 800;
        line-height: 1;
      }
      .sl-streak-text {
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        opacity: 0.9;
      }
      
      /* Subject Badge Tag */
      .sl-subject-badge {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(4px);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      /* Clean Minimal Card for Question */
      .sl-quiz-container {
        background: var(--card);
        border: 1.5px solid var(--border);
        border-radius: 24px;
        padding: 28px;
        box-shadow: var(--shadow-card);
      }
      .sl-quiz-meta {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--accent);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
      }
      .sl-question-statement {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.45;
        margin: 0 0 24px 0;
      }

      /* Premium Interactive Option Rows */
      .sl-interactive-option {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-radius: 16px;
        margin-bottom: 12px;
        border: 1.5px solid var(--border);
        background: var(--bg);
        color: var(--text);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .sl-interactive-option:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
      }
      .sl-opt-index {
        width: 28px;
        height: 28px;
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
      
      /* State Classes */
      .sl-interactive-option.is-wrong {
        border-color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.06) !important;
        color: #ef4444 !important;
      }
      .sl-interactive-option.is-wrong .sl-opt-index {
        background: #ef4444 !important;
        color: #ffffff !important;
      }
      .sl-interactive-option.is-correct {
        border-color: #22c55e !important;
        background: rgba(34, 197, 94, 0.06) !important;
        color: #22c55e !important;
      }
      .sl-interactive-option.is-correct .sl-opt-index {
        background: #22c55e !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(styleNode);
  }

  // Fetch current details from your window database state wrappers
  var currentStreak = 5; // Example Streak Count
  var subjectName = "Geography"; // Example Subject Data
  var hasPlayedToday = false; 

  var root = el("div", { cls: "sl-daily-layout" });

  // 1. HERO BANNER: Fixed gradient ensures contrast is ALWAYS 100% perfect in light or dark mode
  var heroCard = el("div", { cls: "sl-hero-streak-card" }, [
    el("div", { cls: "sl-streak-metric" }, [
      el("div", { cls: "sl-fire-badge", txt: "🔥" }),
      el("div", {}, [
        el("div", { cls: "sl-streak-count", txt: String(currentStreak) + " Days" }),
        el("div", { cls: "sl-streak-text", txt: "CURRENT STREAK" })
      ])
    ]),
    el("div", { cls: "sl-subject-badge", txt: "🎯 " + subjectName })
  ]);
  root.appendChild(heroCard);

  // 2. QUIZ CONTAINER CARD
  var quizBox = el("div", { cls: "sl-quiz-container" }, [
    el("div", { cls: "sl-quiz-meta" }, [
      el("span", { txt: "Question of the Day" }),
      el("span", { txt: hasPlayedToday ? "Status: Done" : "Status: Active" })
    ]),
    el("h3", { 
      cls: "sl-question-statement", 
      txt: "Rana Pratap Sagar Hydro Electricity Station is situated at" 
    })
  ]);

  // Options Data Array
  var options = [
    { key: "A", val: "Kota", state: "is-wrong" },
    { key: "B", val: "Udaipur", state: "normal" },
    { key: "C", val: "Rawatbhata", state: "is-correct" },
    { key: "D", val: "Bikaner", state: "normal" }
  ];

  options.forEach(function(opt) {
    var row = el("div", { 
      cls: "sl-interactive-option " + (opt.state !== "normal" ? opt.state : ""),
      onclick: function() {
        if(!hasPlayedToday) {
           toast("Option " + opt.key + " Selected!");
        }
      }
    }, [
      el("div", { cls: "sl-opt-index", txt: opt.key }),
      el("span", { txt: opt.val })
    ]);
    quizBox.appendChild(row);
  });

  root.appendChild(quizBox);
  return root;
}
