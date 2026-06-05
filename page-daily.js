// ─── DAILY CHALLENGE ────────────────────────────────────────────
function pgDaily() {
  // 🔥 LIGHT/DARK MODE STREAK BANNER VISIBILITY FIX
  // Yeh block directly aapke header banner element ko target karke colors ko real-time correct karega.
  var styleId = "fix-streak-banner-css";
  if (!document.getElementById(styleId)) {
    var styleNode = document.createElement("style");
    styleNode.id = styleId;
    styleNode.innerHTML = `
      /* Pure top layout block ko global control karega */
      div:has(> .nav-item) [data-page="daily"], 
      div:has(> [txt*="STREAK"]), 
      div:has(> div:contains("STREAK")),
      .streak-card-selector-fallback { 
        background: var(--card) !important;
        border: 1.5px solid var(--border) !important;
      }
      /* Jis text element me 'Science' ya subject aa raha hai aur jo gayab ho jata hai use control karega */
      div[txt="Science"], div:contains("Science"), .subject-title-text {
        color: var(--text) !important;
        font-weight: 700 !important;
      }
      /* Question text and typography options visibility patch */
      div:contains("Question of the day"), div[txt*="Question"] {
        color: var(--text) !important;
      }
    `;
    document.head.appendChild(styleNode);
  }

  var w = el("div", { css: { maxWidth: "700px", margin: "0 auto", paddingBottom: "40px" } });

  // 1. Header
  var hdr = el("div", { css: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1.5px solid var(--border)" } });
  hdr.appendChild(el("div", { css: { flex: "1" } }, [
    el("div", { css: { fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: "🎯 Daily Smart Review" }),
    el("div", { css: { fontSize: ".8rem", color: "var(--muted)", marginTop: "2px" }, txt: "Powered by Spaced Repetition" })
  ]));
  w.appendChild(hdr);

  // 2. The SRS Engine: Gather Due Cards
  var now = Date.now();
  var dueCards = [];
  var totalKnown = 0;

  // Scan every subject in your database
  window.SUBJ.forEach(function(subj) {
    var sv = Sv.get("fc_" + subj);
    if (!sv || !sv.k) return;

    var knownData = sv.k; // The timestamps saved from flashcard ratings
    var subjQuestions = window.QD[subj] || [];

    // Check every question to see if it is known AND due for review
    subjQuestions.forEach(function(q) {
      var qId = q.q.slice(0, 35);
      if (knownData[qId]) {
        totalKnown++;
        if (knownData[qId] < now) {
          dueCards.push({ subject: subj, q: q, id: qId });
        }
      }
    });
  });

  // 3. UI Dashboard
  var dash = el("div", { css: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" } });

  // Stat: Cards Due Today (Dynamic Background and Tints for Themes)
  var dueColor = dueCards.length > 0 ? "#f59e0b" : "#4ade80";
  var dueBg = dueCards.length > 0 ? "rgba(245,158,11,0.15)" : "rgba(74,222,128,0.15)";

  var dueBox = el("div", { css: { background: dueBg, border: "1.5px solid " + dueColor, borderRadius: "16px", padding: "24px", textAlign: "center" } });
  dueBox.appendChild(el("div", { css: { fontSize: "2.5rem", fontWeight: "800", color: dueColor, lineHeight: "1" }, txt: String(dueCards.length) }));
  dueBox.appendChild(el("div", { css: { fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text)", fontWeight: "600", marginTop: "8px" }, txt: "Cards Due" }));
  dash.appendChild(dueBox);

  // Stat: Total Cards Memorized
  var memBox = el("div", { css: { background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: "16px", padding: "24px", textAlign: "center", boxShadow: "var(--shadow-card)" } });
  memBox.appendChild(el("div", { css: { fontSize: "2.5rem", fontWeight: "800", color: "var(--accent)", lineHeight: "1" }, txt: String(totalKnown) }));
  memBox.appendChild(el("div", { css: { fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", fontWeight: "600", marginTop: "8px" }, txt: "In Learning Phase" }));
  dash.appendChild(memBox);
  w.appendChild(dash);

  // 4. Action Area
  if (dueCards.length === 0) {
    var allClear = el("div", { css: { textAlign: "center", padding: "40px 20px", background: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" } });
    allClear.appendChild(el("div", { css: { fontSize: "3rem", marginBottom: "12px" }, txt: "🎉" }));
    allClear.appendChild(el("div", { css: { fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px", color: "var(--text)" }, txt: "You're all caught up!" }));
    allClear.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", marginBottom: "20px" }, txt: "You have reviewed all your due cards for today. Go start a new quiz to add more cards to your learning phase." }));
    allClear.appendChild(el("button", { cls: "btn btnp", onclick: function() { go("home"); } }, "Explore Subjects"));
    w.appendChild(allClear);
  } else {
    var startBox = el("div", { css: { textAlign: "center", padding: "32px 20px", background: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" } });
    startBox.appendChild(el("div", { css: { fontSize: ".9rem", color: "var(--text)", marginBottom: "20px" }, txt: "You have flashcards waiting for review. The algorithm determines these are the cards you are most likely to forget today." }));
    startBox.appendChild(el("button", { cls: "btn btnp", css: { width: "100%", padding: "14px", fontSize: "1.05rem" }, onclick: function() {
      toast("Daily Review Engine launching soon!", "#3b82f6");
    } }, "Start Daily Review 🚀"));
    w.appendChild(startBox);
  }

  return w;
}

// ─── SHARE SCORE ────────────────────────────────────────────────
function shareScore(subj,correct,streak){
  var text="\uD83D\uDCDA StudyLab Daily Challenge\n"+(correct?"\u2705 Answered correctly!":"\u274C Missed today's question")+"\n\uD83D\uDD25 Current streak: "+streak+" days\n\uD83C\uDF93 Subject: "+subj+"\n\n🌐 https://studylab-inky.vercel.app";
  if(navigator.share){navigator.share({title:"StudyLab Daily Challenge",text:text});}
  else{navigator.clipboard.writeText(text).then(function(){toast("Result copied! Share it \uD83D\uDE80");});}
}
