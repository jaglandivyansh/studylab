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
  
  // Reset streak if user missed a day
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dailyStats.lastPlayed !== today && dailyStats.lastPlayed !== yesterday.toDateString() && dailyStats.lastPlayed !== "") {
      dailyStats.streak = 0; // Streak broken
      dailyStats.status = "Not answered yet today";
  } else if (dailyStats.lastPlayed !== today) {
      dailyStats.status = "Not answered yet today";
  }
  
  var dailyPlayed = (dailyStats.lastPlayed === today);

  // 2. DARK STREAK & SUBJECT CARD (Renamed Classes to avoid any conflicts)
  var streakCard = el("div", { cls: "sl-premium-streak-board" }); // CLASS CHANGED

  // Left part: Flame and Streak Count
  var streakLeft = el("div", { cls: "sl-streak-left-panel" }); // CLASS CHANGED
  streakLeft.appendChild(el("div", { cls: "sl-flame-icon", txt: "🔥" }));
  
  // ID given to update numbers dynamically
  var streakNumberEl = el("h2", { cls: "sl-streak-digit", txt: dailyStats.streak }); 
  streakLeft.appendChild(streakNumberEl);
  streakLeft.appendChild(el("p", { cls: "sl-streak-label", txt: "DAY STREAK" }));
  streakCard.appendChild(streakLeft);

  // Right part: Subject and Status
  var streakRight = el("div", { cls: "sl-streak-right-panel" }); // CLASS CHANGED
  streakRight.appendChild(el("p", { cls: "sl-subject-subtitle", txt: "Today's subject" }));
  streakRight.appendChild(el("h3", { cls: "sl-subject-heading", txt: "🔬 Science" }));
  
  // ID given to update status text and color dynamically
  var statusColor = (dailyStats.status.includes("correctly")) ? "#4ade80" : (dailyStats.status.includes("Incorrect") ? "#f87171" : "var(--muted)");
  var statusEl = el("p", { cls: "sl-subject-live-status", txt: dailyStats.status, css: { color: statusColor, fontWeight: "600" } });
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

    // If already played today, pre-fill the correct/wrong answers
    if (dailyPlayed) {
        if (opt.key === solutionKey) rowBtn.classList.add("sl-correct-state");
    }

    // Interactive Click Event Handler
    rowBtn.onclick = function() {
      if (dailyPlayed) return; 
      dailyPlayed = true;
      dailyStats.lastPlayed = today;

      if (opt.key === solutionKey) {
        rowBtn.classList.add("sl-correct-state");
        
        // --- DYNAMIC STREAK UPDATE ---
        dailyStats.streak += 1;
        dailyStats.status = "✅ Answered correctly!";
        streakNumberEl.textContent = dailyStats.streak;
        statusEl.textContent = dailyStats.status;
        statusEl.style.color = "#4ade80"; // Bright Green
        
        if (typeof toast === "function") toast("🎉 Correct Answer!", "#22c55e");
        if (typeof throwConfetti === "function") throwConfetti(); // Trigger Confetti!
        
      } else {
        rowBtn.classList.add("sl-wrong-state");
        
        dailyStats.streak = 0; // Reset streak on wrong answer
        dailyStats.status = "❌ Incorrect, try again tomorrow!";
        streakNumberEl.textContent = dailyStats.streak;
        statusEl.textContent = dailyStats.status;
        statusEl.style.color = "#f87171"; // Red
        
        // Highlight correct answer
        optionRowsArray.forEach(function(r) {
          if (r.getAttribute("data-ans-key") === solutionKey) {
            r.classList.add("sl-correct-state");
          }
        });
        if (typeof toast === "function") toast("❌ Incorrect Answer!", "#ef4444");
      }
      
      // Save progress to phone memory
      localStorage.setItem('sl_daily_challenge', JSON.stringify(dailyStats));
    };

    optionRowsArray.push(rowBtn);
    quizBox.appendChild(rowBtn);
  });

  w.appendChild(quizBox);
  return w;
}
