// ─── DAILY CHALLENGE ────────────────────────────────────────────
function pgDaily() {
  var w = el("div", { css: { maxWidth: "700px", margin: "0 auto", paddingBottom: "40px" } });
  
  // 1. Header
  var hdr = el("div", { css: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1.5px solid var(--border)" } });
  hdr.appendChild(el("div", { css: { flex: "1" } }, [
    el("div", { css: { fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-display)" }, txt: "🎯 Daily Smart Review" }),
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
  
  // Stat: Cards Due Today
  var dueBox = el("div", { css: { background: dueCards.length > 0 ? "rgba(245,158,11,0.1)" : "rgba(74,222,128,0.1)", border: "1.5px solid " + (dueCards.length > 0 ? "#f59e0b" : "#4ade80"), borderRadius: "16px", padding: "24px", textAlign: "center" } });
  dueBox.appendChild(el("div", { css: { fontSize: "2.5rem", fontWeight: "800", color: dueCards.length > 0 ? "#f59e0b" : "#4ade80", lineHeight: "1" }, txt: String(dueCards.length) }));
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
    allClear.appendChild(el("div", { css: { fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }, txt: "You're all caught up!" }));
    allClear.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", marginBottom: "20px" }, txt: "You have reviewed all your due cards for today. Go start a new quiz to add more cards to your learning phase." }));
    allClear.appendChild(el("button", { cls: "btn btnp", onclick: function() { go("home"); } }, "Explore Subjects"));
    w.appendChild(allClear);
  } else {
    var startBox = el("div", { css: { textAlign: "center", padding: "32px 20px", background: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" } });
    startBox.appendChild(el("div", { css: { fontSize: ".9rem", color: "var(--text)", marginBottom: "20px" }, txt: "You have flashcards waiting for review. The algorithm determines these are the cards you are most likely to forget today." }));
    startBox.appendChild(el("button", { cls: "btn btnp", css: { width: "100%", padding: "14px", fontSize: "1.05rem" }, onclick: function() {
      // Logic to actually launch the due cards goes here!
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