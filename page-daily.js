// ─── PREMIUM MODERN STUDYLAB DAILY CHALLENGE ENGINE ──────────────────
function pgDaily() {
  // 1. Standalone CSS Injection (Pure Custom Premium Theme)
  var styleId = "studylab-premium-redesign-css";
  if (!document.getElementById(styleId)) {
    var styleNode = document.createElement("style");
    styleNode.id = styleId;
    styleNode.innerHTML = `
      .sl-new-layout {
        max-width: 520px;
        margin: 0 auto;
        padding: 20px 16px 60px 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      /* Main App Heading Branding */
      .sl-brand-header {
        text-align: center;
        margin-bottom: 28px;
      }
      .sl-brand-header h1 {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--text);
        margin: 0 0 6px 0;
        letter-spacing: -0.02em;
      }
      .sl-brand-header p {
        font-size: 0.88rem;
        color: var(--muted);
        margin: 0;
        line-height: 1.4;
      }

      /* Premium Gamified Fire Streak Card */
      .sl-premium-streak-card {
        background: linear-gradient(135deg, #ff416c, #ff4b2b);
        border-radius: 24px;
        padding: 24px;
        color: #ffffff !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28px;
        box-shadow: 0 10px 25px rgba(255, 65, 108, 0.3);
        position: relative;
        overflow: hidden;
      }
      .sl-premium-streak-card::after {
        content: ""; position: absolute; right: -15px; top: -15px;
        width: 90px; height: 90px; background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
      }
      .sl-streak-left-side {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .sl-streak-fire-emoji {
        font-size: 2.8rem;
        animation: fireFloat 2s infinite alternate ease-in-out;
      }
      @keyframes fireFloat {
        0% { transform: translateY(0) scale(1); }
        100% { transform: translateY(-4px) scale(1.06); }
      }
      .sl-streak-numbers-box {
        display: flex;
        flex-direction: column;
      }
      .sl-streak-digits {
        font-size: 2.2rem;
        font-weight: 900;
        line-height: 1;
      }
      .sl-streak-lbl-txt {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        opacity: 0.9;
        margin-top: 2px;
      }
      .sl-badge-topic {
        background: rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        padding: 8px 16px;
        border-radius: 30px;
        font-size: 0.85rem;
        font-weight: 800;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      /* Premium Main Question Paper Card */
      .sl-premium-quiz-box {
        background: var(--card);
        border: 1.5px solid var(--border);
        border-radius: 24px;
        padding: 28px;
        box-shadow: var(--shadow-card);
      }
      .sl-quiz-card-tag {
        font-size: 0.75rem;
        font-weight: 800;
        color: #3b82f6;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 14px;
        display: block;
      }
      .sl-quiz-main-question {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.5;
        margin: 0 0 28px 0;
      }

      /* Premium Interactive Modern Row Option Layouts */
      .sl-premium-option-row {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-radius: 16px;
        margin-bottom: 14px;
        border: 1.5px solid var(--border);
        background: transparent;
        color: var(--text);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .sl-premium-option-row:hover {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.03);
        transform: translateY(-2px);
      }
      .sl-premium-option-row:last-child {
        margin-bottom: 0;
      }
      .sl-premium-option-index {
        width: 28px;
        height: 28px;
        border-radius: 10px;
        background: var(--border);
        color: var(--muted);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        font-size: 0.88rem;
        font-weight: 800;
        transition: all 0.2s ease;
      }

      /* Verified Click Animation Status Classes */
      .sl-premium-option-row.sl-correct-state {
        border-color: #22c55e !important;
        background: rgba(34, 197, 94, 0.08) !important;
        color: #22c55e !important;
      }
      .sl-premium-option-row.sl-correct-state .sl-premium-option-index {
        background: #22c55e !important;
        color: #ffffff !important;
      }
      .sl-premium-option-row.sl-wrong-state {
        border-color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.08) !important;
        color: #ef4444 !important;
      }
      .sl-premium-option-row.sl-wrong-state .sl-premium-option-index {
        background: #ef4444 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(styleNode);
  }

  // 2. Pure Vanilla DOM Creation Logic (Bypasses any faulty custom app helper functions)
  var viewWrapper = document.createElement("div");
  viewWrapper.className = "sl-new-layout";

  // Inject Beautiful Structural Layout Components
  viewWrapper.innerHTML = `
    <div class="sl-brand-header">
      <h1>Daily Challenge</h1>
      <p>Sharpen your knowledge with today's handpicked competitive question.</p>
    </div>
    
    <div class="sl-premium-streak-card">
      <div class="sl-streak-left-side">
        <div class="sl-streak-fire-emoji">🔥</div>
        <div class="sl-streak-numbers-box">
          <div class="sl-streak-digits">05 Days</div>
          <div class="sl-streak-lbl-txt">CURRENT STREAK</div>
        </div>
      </div>
      <div class="sl-badge-topic">🔬 Science</div>
    </div>

    <div class="sl-premium-quiz-box">
      <span class="sl-quiz-card-tag">Question of the Day</span>
      <h3 class="sl-quiz-main-question">Rana Pratap Sagar Hydro Electricity Station is situated at</h3>
      
      <div class="sl-premium-option-row" data-ans-key="A"><div class="sl-premium-option-index">A</div><span>Kota</span></div>
      <div class="sl-premium-option-row" data-ans-key="B"><div class="sl-premium-option-index">B</div><span>Udaipur</span></div>
      <div class="sl-premium-option-row" data-ans-key="C"><div class="sl-premium-option-index">C</div><span>Rawatbhata</span></div>
      <div class="sl-premium-option-row" data-ans-key="D"><div class="sl-premium-option-index">D</div><span>Bikaner</span></div>
    </div>
  `;

  // 3. Independent Click Event Listeners
  var dailyPlayed = false;
  var solutionKey = "C";

  viewWrapper.querySelectorAll(".sl-premium-option-row").forEach(function(elementRow) {
    elementRow.addEventListener("click", function() {
      if (dailyPlayed) return; // Disables tapping after selecting an answer
      dailyPlayed = true;

      var userSelection = elementRow.getAttribute("data-ans-key");
      
      if (userSelection === solutionKey) {
        elementRow.classList.add("sl-correct-state");
        if (typeof toast === "function") {
          toast("🎉 Correct! Streak saved.", "#22c55e");
        }
      } else {
        elementRow.classList.add("sl-wrong-state");
        // Automatically find and highlight the right row option
        var targetCorrectRow = viewWrapper.querySelector('.sl-premium-option-row[data-ans-key="' + solutionKey + '"]');
        if (targetCorrectRow) {
          targetCorrectRow.classList.add("sl-correct-state");
        }
        if (typeof toast === "function") {
          toast("❌ Incorrect answer! Try again tomorrow.", "#ef4444");
        }
      }
    });
  });

  return viewWrapper;
}
