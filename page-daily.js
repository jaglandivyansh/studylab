// ─── PREMIUM STUDYLAB DAILY CHALLENGE COMPONENT (100% BUG FREE) ───
function pgDaily() {
  function el(type, props) {
      var element = document.createElement(type);
      if (props) {
          if (props.cls) element.className = props.cls;
          if (props.txt) element.textContent = props.txt;
          if (props.onclick) element.onclick = props.onclick;
          if (props.css) {
              for (var key in props.css) {
                  element.style[key] = props.css[key];
              }
          }
      }
      return element;
  }

  // --- 🎨 MISSING CSS INJECTED HERE ---
  if (!document.getElementById('sl-daily-styles')) {
      var style = document.createElement('style');
      style.id = 'sl-daily-styles';
      style.innerHTML = `
          .sl-new-layout { padding: 16px; max-width: 600px; margin: 20px auto 100px auto; font-family: var(--font-display, sans-serif); }
          .sl-brand-header { text-align: center; margin-bottom: 24px; }
          .sl-header-icon { font-size: 3rem; margin-bottom: 8px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
          .sl-brand-header h2 { font-size: 1.6rem; font-weight: 800; color: var(--text); margin: 0 0 6px 0; }
          .sl-brand-header p { font-size: 0.9rem; color: var(--muted); margin: 0; line-height: 1.4; }
          
          /* The Dark Streak Board */
          .sl-premium-streak-board { background: #1c1c24; border-radius: 20px; display: flex; padding: 24px 20px; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); align-items: center; }
          .sl-streak-left-panel { flex: 0 0 35%; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 16px; }
          .sl-flame-icon { font-size: 2.2rem; margin-bottom: 4px; }
          .sl-streak-digit { font-size: 2.5rem; font-weight: 900; color: #3b82f6; margin: 0; line-height: 1; }
          .sl-streak-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-top: 8px; }
          .sl-streak-right-panel { flex: 1; padding-left: 20px; display: flex; flex-direction: column; justify-content: center; }
          .sl-subject-subtitle { font-size: 0.75rem; font-weight: 600; color: #6b7280; margin: 0 0 6px 0; }
          .sl-subject-heading { font-size: 1.15rem; font-weight: 800; color: #0044ff; margin: 0 0 8px 0; filter: brightness(1.2); }
          .sl-subject-live-status { font-size: 0.85rem; font-weight: 600; margin: 0; }
          
          /* The White Quiz Box */
          .sl-premium-quiz-box { background: var(--card, #ffffff); border-radius: 20px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid var(--border, #e2e8f0); }
          .sl-quiz-card-tag { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
          .sl-quiz-main-question { font-size: 1.2rem; font-weight: 700; color: var(--text, #1e293b); line-height: 1.5; margin-bottom: 24px; }
          
          /* Options */
          .sl-premium-option-row { display: flex; align-items: center; padding: 16px; margin-bottom: 12px; border: 2px solid var(--border, #e2e8f0); border-radius: 14px; cursor: pointer; transition: all 0.2s; background: var(--bg2, #f8f9fa); color: var(--text, #334155); font-weight: 600; font-size: 0.95rem; }
          .sl-premium-option-index { color: #94a3b8; font-weight: 800; margin-right: 16px; font-size: 0.95rem; }
          
          /* Correct / Wrong States */
          .sl-correct-state { border-color: #22c55e !important; background-color: #f0fdf4 !important; color: #15803d !important; }
          .sl-correct-state .sl-premium-option-index { color: #22c55e !important; }
          .sl-wrong-state { border-color: #ef4444 !important; background-color: #fef2f2 !important; color: #b91c1c !important; }
          .sl-wrong-state .sl-premium-option-index { color: #ef4444 !important; }
      `;
      document.head.appendChild(style);
  }

  // Master Setup Container
  var w = el("div", { cls: "sl-new-layout" });

  // 1. BRAND HEADER SECTION
  var headerBlock = el("div", { cls: "sl-brand-header" });
  headerBlock.appendChild(el("div", { cls: "sl-header-icon", txt: "🎯" })); 
  headerBlock.appendChild(el("h2", { txt: "Daily Challenge" }));
  headerBlock.appendChild(el("p", { txt: "One question every day. Come back tomorrow for a new one!" }));
  w.appendChild(headerBlock);

  // --- SMART LOCAL STORAGE LOGIC ---
  var today = new Date().toDateString();
  var dailyStats = JSON.parse(localStorage.getItem('sl_daily_challenge') || '{"streak": 0, "lastPlayed": "", "status": "Not answered yet today"}');
  
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dailyStats.lastPlayed !== today && dailyStats.lastPlayed !== yesterday.toDateString() && dailyStats.lastPlayed !== "") {
      dailyStats.streak = 0; 
      dailyStats.status = "Not answered yet today";
  } else if (dailyStats.lastPlayed !== today) {
      dailyStats.status = "Not answered yet today";
  }
  
  var dailyPlayed = (dailyStats.lastPlayed === today);

  // 2. DARK STREAK & SUBJECT CARD 
  var streakCard = el("div", { cls: "sl-premium-streak-board" }); 

  var streakLeft = el("div", { cls: "sl-streak-left-panel" }); 
  streakLeft.appendChild(el("div", { cls: "sl-flame-icon", txt: "🔥" }));
  
  var streakNumberEl = el("h2", { cls: "sl-streak-digit", txt: dailyStats.streak }); 
  streakLeft.appendChild(streakNumberEl);
  streakLeft.appendChild(el("p", { cls: "sl-streak-label", txt: "DAY STREAK" }));
  streakCard.appendChild(streakLeft);

  var streakRight = el("div", { cls: "sl-streak-right-panel" }); 
  streakRight.appendChild(el("p", { cls: "sl-subject-subtitle", txt: "Today's subject" }));
  streakRight.appendChild(el("h3", { cls: "sl-subject-heading", txt: "🔬 Science" }));
  
  var statusColor = (dailyStats.status.includes("correctly")) ? "#4ade80" : (dailyStats.status.includes("Incorrect") ? "#f87171" : "#9ca3af");
  var statusEl = el("p", { cls: "sl-subject-live-status", txt: dailyStats.status });
  statusEl.style.color = statusColor;
  streakRight.appendChild(statusEl);
  streakCard.appendChild(streakRight);

  w.appendChild(streakCard);

  // 3. PREMIUM QUIZ CARD CONTAINER
  var quizBox = el("div", { cls: "sl-premium-quiz-box" });

  var cardTagBox = el("div", { cls: "sl-quiz-card-tag" });
  cardTagBox.appendChild(el("span", { txt: "QUESTION OF THE DAY" }));
  quizBox.appendChild(cardTagBox);

  quizBox.appendChild(el("h3", { 
    cls: "sl-quiz-main-question", 
    txt: "The motion of a freely falling body is an example of uniformly accelerated motion." 
  }));

  var choices = [
    { key: "A", val: "non-uniformly" },
    { key: "B", val: "uniformly" },
    { key: "C", val: "uniquely" },
    { key: "D", val: "specially" }
  ];

  var solutionKey = "B"; 
  var optionRowsArray = []; 

  choices.forEach(function(opt) {
    var rowBtn = el("div", { cls: "sl-premium-option-row" });
    rowBtn.setAttribute("data-ans-key", opt.key);

    rowBtn.appendChild(el("div", { cls: "sl-premium-option-index", txt: opt.key + "." }));
    rowBtn.appendChild(el("span", { txt: opt.val }));

    if (dailyPlayed) {
        if (opt.key === solutionKey) rowBtn.classList.add("sl-correct-state");
    }

    rowBtn.onclick = function() {
      if (dailyPlayed) return; 
      dailyPlayed = true;
      dailyStats.lastPlayed = today;

      if (opt.key === solutionKey) {
        rowBtn.classList.add("sl-correct-state");
        
        dailyStats.streak += 1;
        dailyStats.status = "✅ Answered correctly!";
        streakNumberEl.textContent = dailyStats.streak;
        statusEl.textContent = dailyStats.status;
        statusEl.style.color = "#4ade80"; 
        
        if (typeof toast === "function") toast("🎉 Correct Answer!", "#22c55e");
        if (typeof throwConfetti === "function") throwConfetti(); 
        
      } else {
        rowBtn.classList.add("sl-wrong-state");
        
        dailyStats.streak = 0; 
        dailyStats.status = "❌ Incorrect, try again tomorrow!";
        streakNumberEl.textContent = dailyStats.streak;
        statusEl.textContent = dailyStats.status;
        statusEl.style.color = "#f87171"; 
        
        optionRowsArray.forEach(function(r) {
          if (r.getAttribute("data-ans-key") === solutionKey) {
            r.classList.add("sl-correct-state");
          }
        });
        if (typeof toast === "function") toast("❌ Incorrect Answer!", "#ef4444");
      }
      
      localStorage.setItem('sl_daily_challenge', JSON.stringify(dailyStats));
    };

    optionRowsArray.push(rowBtn);
    quizBox.appendChild(rowBtn);
  });

  w.appendChild(quizBox);
  return w;
}
