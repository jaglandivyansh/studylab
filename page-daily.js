function pgDaily() {
  // 1. CSS Injected automatically
  var styleId = "studylab-standalone-daily-css";
  if (!document.getElementById(styleId)) {
    var styleNode = document.createElement("style");
    styleNode.id = styleId;
    styleNode.innerHTML = `
      .sl-wrapper { max-width: 550px; margin: 0 auto; padding: 16px 16px 50px 16px; font-family: system-ui, -apple-system, sans-serif; }
      .sl-main-header { text-align: center; margin-bottom: 24px; }
      .sl-main-header h2 { font-size: 1.6rem; font-weight: 800; color: var(--text); margin: 0 0 4px 0; }
      .sl-main-header p { font-size: 0.85rem; color: var(--muted); margin: 0; }
      .sl-premium-streak-card { background: linear-gradient(135deg, #ff5e62, #ff9966); border-radius: 20px; padding: 22px 24px; color: #ffffff !important; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; box-shadow: 0 8px 25px rgba(255, 94, 98, 0.25); }
      .sl-streak-flex { display: flex; align-items: center; gap: 14px; }
      .sl-streak-icon-fire { font-size: 2.6rem; animation: slPulse 1.5s infinite alternate; }
      @keyframes slPulse { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
      .sl-counter-num { font-size: 2.1rem; font-weight: 800; line-height: 1; }
      .sl-counter-lbl { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; opacity: 0.9; }
      .sl-badge-subject { background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.25); }
      .sl-question-box { background: var(--card); border: 1.5px solid var(--border); border-radius: 22px; padding: 26px; box-shadow: var(--shadow-card); }
      .sl-box-tag { font-size: 0.75rem; font-weight: 700; color: var(--accent, #3b82f6); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; display: block; }
      .sl-main-question { font-size: 1.25rem; font-weight: 700; color: var(--text); line-height: 1.45; margin: 0 0 24px 0; }
      .sl-row-option { display: flex; align-items: center; padding: 16px 18px; border-radius: 14px; margin-bottom: 12px; border: 1.5px solid var(--border); background: transparent; color: var(--text); font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
      .sl-row-option:hover { border-color: var(--accent, #3b82f6); background: rgba(128, 128, 128, 0.03); }
      .sl-row-index { width: 26px; height: 26px; border-radius: 8px; background: var(--border); color: var(--muted); display: flex; align-items: center; justify-content: center; margin-right: 14px; font-size: 0.85rem; font-weight: 700; }
      .sl-row-option.correct-ans { border-color: #22c55e !important; background: rgba(34, 197, 94, 0.08) !important; color: #22c55e !important; }
      .sl-row-option.correct-ans .sl-row-index { background: #22c55e !important; color: #ffffff !important; }
      .sl-row-option.wrong-ans { border-color: #ef4444 !important; background: rgba(239, 68, 68, 0.08) !important; color: #ef4444 !important; }
      .sl-row-option.wrong-ans .sl-row-index { background: #ef4444 !important; color: #ffffff !important; }
    `;
    document.head.appendChild(styleNode);
  }

  // 2. Main Wrapper Element (Using vanilla JS instead of el() function)
  var w = document.createElement("div");
  w.className = "sl-wrapper";

  // Pure HTML Markup Architecture String
  w.innerHTML = `
    <div class="sl-main-header">
      <h2>Daily Challenge</h2>
      <p>Test your skills with one premium core question every day.</p>
    </div>
    <div class="sl-premium-streak-card">
      <div class="sl-streak-flex">
        <div class="sl-streak-icon-fire">🔥</div>
        <div>
          <div class="sl-counter-num">12 Days</div>
          <div class="sl-counter-lbl">ACTIVE STREAK</div>
        </div>
      </div>
      <div class="sl-badge-subject">🔬 Science</div>
    </div>
    <div class="sl-question-box">
      <span class="sl-box-tag">Question of the Day</span>
      <h3 class="sl-main-question">Rana Pratap Sagar Hydro Electricity Station is situated at</h3>
      
      <div class="sl-row-option" data-key="A"><div class="sl-row-index">A</div><span>Kota</span></div>
      <div class="sl-row-option" data-key="B"><div class="sl-row-index">B</div><span>Udaipur</span></div>
      <div class="sl-row-option" data-key="C"><div class="sl-row-index">C</div><span>Rawatbhata</span></div>
      <div class="sl-row-option" data-key="D"><div class="sl-row-index">D</div><span>Bikaner</span></div>
    </div>
  `;

  // 3. Add Dynamic Click Interactions directly
  var hasPlayed = false;
  var correctKey = "C";

  w.querySelectorAll(".sl-row-option").forEach(function(row) {
    row.addEventListener("click", function() {
      if (hasPlayed) return;
      hasPlayed = true;

      var selectedKey = row.getAttribute("data-key");
      if (selectedKey === correctKey) {
        row.classList.add("correct-ans");
        if (typeof toast === "function") toast("🎉 Correct Answer!");
      } else {
        row.classList.add("wrong-ans");
        var rightRow = w.querySelector('.sl-row-option[data-key="' + correctKey + '"]');
        if (rightRow) rightRow.classList.add("correct-ans");
        if (typeof toast === "function") toast("❌ Incorrect Option!");
      }
    });
  });

  return w;
}
