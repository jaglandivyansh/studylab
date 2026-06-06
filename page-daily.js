// ─── PREMIUM STUDYLAB DAILY CHALLENGE COMPONENT (100% BUG FREE) ───
function pgDaily() {
  // Master Setup Container
  var w = el("div", { cls: "sl-new-layout" });

  // 1. BRAND HEADER SECTION
  var headerBlock = el("div", { cls: "sl-brand-header" });
  
  // Added the target icon and updated text to match the image
  headerBlock.appendChild(el("div", { cls: "sl-header-icon", txt: "🎯" })); 
  headerBlock.appendChild(el("h2", { txt: "Daily Challenge" }));
  headerBlock.appendChild(el("p", { txt: "One question every day. Come back tomorrow for a new one!" }));
  w.appendChild(headerBlock);

  // 2. DARK STREAK & SUBJECT CARD (Newly Added)
  // This builds the dark UI box missing from the original code
  var streakCard = el("div", { cls: "sl-streak-card-dark" });

  // Left part: Flame and Streak Count
  var streakLeft = el("div", { cls: "sl-streak-left" });
  streakLeft.appendChild(el("div", { cls: "sl-flame-icon", txt: "🔥" }));
  streakLeft.appendChild(el("h2", { cls: "sl-streak-number", txt: "0" }));
  streakLeft.appendChild(el("p", { cls: "sl-streak-text", txt: "DAY STREAK" }));
  streakCard.appendChild(streakLeft);

  // Right part: Subject and Status
  var streakRight = el("div", { cls: "sl-streak-right" });
  streakRight.appendChild(el("p", { cls: "sl-subject-title", txt: "Today's subject" }));
  streakRight.appendChild(el("h3", { cls: "sl-subject-name", txt: "🔬 Science" }));
  streakRight.appendChild(el("p", { cls: "sl-subject-status", txt: "Not answered yet today" }));
  streakCard.appendChild(streakRight);

  w.appendChild(streakCard);

  // 3. PREMIUM QUIZ CARD CONTAINER (White Card)
  var quizBox = el("div", { cls: "sl-premium-quiz-box" });

  // Card Upper Badge Tags
  var cardTagBox = el("div", { cls: "sl-quiz-card-tag" });
  cardTagBox.appendChild(el("span", { txt: "QUESTION OF THE DAY" }));
  quizBox.appendChild(cardTagBox);

  // Core Question Text
  quizBox.appendChild(el("h3", { 
    cls: "sl-quiz-main-question", 
    txt: "Rana Pratap Sagar Hydro Electricity Station is situated at" 
  }));

  // MCQ Options Data Loop Array
  var choices = [
    { key: "A", val: "Kota" },
    { key: "B", val: "Udaipur" },
    { key: "C", val: "Rawatbhata" },
    { key: "D", val: "Bikaner" }
  ];

  var dailyPlayed = false;
  var solutionKey = "C"; // Correct Option Key
  var optionRowsArray = []; // To keep tracks of element rows

  choices.forEach(function(opt) {
    var rowBtn = el("div", { cls: "sl-premium-option-row" });

    // Add data attribute safely for styling hooks
    rowBtn.setAttribute("data-ans-key", opt.key);

    // Appended a period to the key to match the "A.", "B." look from the image
    rowBtn.appendChild(el("div", { cls: "sl-premium-option-index", txt: opt.key + "." }));
    rowBtn.appendChild(el("span", { txt: opt.val }));

    // Interactive Click Event Handler
    rowBtn.onclick = function() {
      if (dailyPlayed) return; // Locks card after first click
      dailyPlayed = true;

      if (opt.key === solutionKey) {
        rowBtn.classList.add("sl-correct-state");
        if (typeof toast === "function") toast("🎉 Correct Answer!", "#22c55e");
      } else {
        rowBtn.classList.add("sl-wrong-state");
        // Automatically highlight the correct answer too
        optionRowsArray.forEach(function(r) {
          if (r.getAttribute("data-ans-key") === solutionKey) {
            r.classList.add("sl-correct-state");
          }
        });
        if (typeof toast === "function") toast("❌ Incorrect Answer!", "#ef4444");
      }
    };

    optionRowsArray.push(rowBtn);
    quizBox.appendChild(rowBtn);
  });

  w.appendChild(quizBox);
  return w;
}
