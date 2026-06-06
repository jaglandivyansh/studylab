// ─── PREMIUM STUDYLAB DAILY CHALLENGE COMPONENT (100% BUG FREE) ───
function pgDaily() {
  // Master Setup Container
  var w = el("div", { cls: "sl-new-layout" });

  // 1. BRAND HEADER SECTION
  var headerBlock = el("div", { cls: "sl-brand-header" });
  headerBlock.appendChild(el("h1", { txt: "Daily Challenge" }));
  headerBlock.appendChild(el("p", { txt: "Sharpen your knowledge with today's handpicked competitive question." }));
  w.appendChild(headerBlock);

  // 2. PREMIUM QUIZ CARD CONTAINER
  var quizBox = el("div", { cls: "sl-premium-quiz-box" });
  
  // Card Upper Badge Tags
  var cardTagBox = el("div", { cls: "sl-quiz-card-tag" });
  cardTagBox.appendChild(el("span", { txt: "Question of the Day" }));
  cardTagBox.appendChild(el("span", { cls: "sl-subject-pill", txt: "🔬 Science" }));
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
    
    rowBtn.appendChild(el("div", { cls: "sl-premium-option-index", txt: opt.key }));
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
