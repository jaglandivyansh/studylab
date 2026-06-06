// ─── STUDYLAB COMPLETE INDEPENDENT DAILY CHALLENGE ──────────────────
function pgDaily() {
  // 1. INJECT ALL CSS (Self-Contained Styling for Themes & Animations)
  var styleId = "studylab-standalone-daily-css";
  if (!document.getElementById(styleId)) {
    var styleNode = document.createElement("style");
    styleNode.id = styleId;
    styleNode.innerHTML = `
      .sl-wrapper {
        max-width: 550px;
        margin: 0 auto;
        padding: 16px 16px 50px 16px;
        font-family: system-ui, -apple-system, sans-serif;
      }
      
      /* Dynamic Premium Header */
      .sl-main-header {
        text-align: center;
        margin-bottom: 24px;
      }
      .sl-main-header h2 {
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--text);
        margin: 0 0 4px 0;
      }
      .sl-main-header p {
        font-size: 0.85rem;
        color: var(--muted);
        margin: 0;
      }

      /* Hero Fire Streak Banner - Gradient ensures 100% contrast always */
      .sl-premium-streak-card {
        background: linear-gradient(135deg, #ff5e62, #ff9966);
        border-radius: 20px;
        padding: 22px 24px;
        color: #ffffff !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        box-shadow: 0 8px 25px rgba(255, 94, 98, 0.25);
      }
      .sl-streak-flex {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .sl-streak-icon-fire {
        font-size: 2.6rem;
        animation: slPulse 1.5s infinite alternate;
      }
      @keyframes slPulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.08); }
      }
      .sl-counter-num {
        font-size: 2.1rem;
        font-weight: 800;
        line-height: 1;
      }
      .sl-counter-lbl {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        opacity: 0.9;
      }
      .sl-badge-subject {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }

      /* Quiz Base Card Box */
      .sl-question-box {
        background: var(--card);
        border: 1.5px solid var(--border);
        border-radius: 22px;
        padding: 26px;
        box-shadow: var(--shadow-card);
      }
      .sl-box-tag {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--accent, #3b82f6);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 12px;
        display: block;
      }
      .sl-main-question {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.45;
        margin: 0 0 24px 0;
      }

      /* Interactive Option Rows */
      .sl-row-option {
        display: flex;
        align-items: center;
        padding: 16px 18px;
        border-radius: 14px;
        margin-bottom: 12px;
        border: 1.5px solid var(--border);
        background: transparent;
        color: var(--text);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .sl-row-option:hover {
        border-color: var(--accent, #3b82f6);
        background: rgba(128, 128, 128, 0.03);
      }
      .sl-row-index {
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

      /* Interactive States (Selected, Correct, Wrong) via Click */
      .sl-row-option.correct-ans {
        border-color: #22c55e !important;
        background: rgba(34, 197, 94, 0.08) !important;
        color: #22c55e !important;
      }
      .sl-row-option.correct-ans .sl-row-index {
        background: #22c55e !important;
        color: #ffffff !important;
      }
      .sl-row-option.wrong-ans {
        border-color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.08) !important;
        color: #ef4444 !important;
      }
      .sl-row-option.wrong-ans .sl-row-index {
        background: #ef4444 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(styleNode);
  }

  // 2. INTERNAL STATE DATA (Bahr se kisi file ki dependency nahi)
  var userStreakCount = 12; // Aap isse window.localStorage.getItem('streak') se link kar sakte hain
  var activeSubject = "Science"; 
  var rightAnswerKey = "C"; 
  var questionPlayed = false;

  // 3. GENERATE LAYOUT
  var mainView = el("div", { cls: "sl-wrapper" });

  // Premium Top Header Block
  var headerBlock = el("div", { cls: "sl-main-header" });
  headerBlock.appendChild(el("h2", { txt: "Daily Challenge" }));
  headerBlock.appendChild(el("p", { txt: "Test your skills with one premium core question every day." }));
  mainView.appendChild(headerBlock);

  // Gamified Dynamic Streak Card
  var streakCard = el("div", { cls: "sl-premium-streak-card" });
  var leftFlex = el("div", { cls: "sl-streak-flex" });
  leftFlex.appendChild(el("div", { cls: "sl-streak-icon-fire", txt: "🔥" }));
  
  var textWrapper = el("div", {});
  textWrapper.appendChild(el("div", { cls: "sl-counter-num", txt: String(userStreakCount) + " Days" }));
  textWrapper.appendChild(el("div", { cls: "sl-counter-lbl", txt: "ACTIVE STREAK" }));
  leftFlex.appendChild(textWrapper);
  
  streakCard.appendChild(leftFlex);
  streakCard.appendChild(el("div", { cls: "sl-badge-subject", txt: "🔬 " + activeSubject }));
  mainView.appendChild(streakCard);

  // Quiz Statement Body Card
  var quizBox = el("div", { cls: "sl-question-box" });
  quizBox.appendChild(el("span", { cls: "sl-box-tag", txt: "Question of the Day" }));
  quizBox.appendChild(el("h3", { cls: "sl-main-question", txt: "Rana Pratap Sagar Hydro Electricity Station is situated at" }));

  // Options Configurations Setup
  var optionsData = [
    { key: "A", val: "Kota" },
    { key: "B", val: "Udaipur" },
    { key: "C", val: "Rawatbhata" },
    { key: "D", val: "Bikaner" }
  ];

  // Array to hold references of rendered row DOM objects
  var optionElements = {};

  optionsData.forEach(function(opt) {
    var optionRow = el("div", { 
      cls: "sl-row-option",
      onclick: function() {
        // Prevent multiple clicks if already answered
        if (questionPlayed) return;
        questionPlayed = true;

        // Feedback Logic: Check if selected answer matches rightAnswerKey
        if (opt.key === rightAnswerKey) {
          optionRow.classList.add("correct-ans");
          if (typeof toast === "function") toast("🎉 Correct Answer! Streak Maintained.");
        } else {
          optionRow.classList.add("wrong-ans");
          // Automatically highlight the correct answer too
          if (optionElements[rightAnswerKey]) {
            optionElements[rightAnswerKey].classList.add("correct-ans");
          }
          if (typeof toast === "function") toast("❌ Incorrect! Try again tomorrow.");
        }
      }
    });

    optionRow.appendChild(el("div", { cls: "sl-row-index", txt: opt.key }));
    optionRow.appendChild(el("span", { txt: opt.val }));
    
    // Store reference to handle post-click visual state corrections
    optionElements[opt.key] = optionRow;
    quizBox.appendChild(optionRow);
  });

  mainView.appendChild(quizBox);
  return mainView;
}
