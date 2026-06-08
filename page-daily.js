// ─── UTILITY: TIMEZONE-SAFE STREAK CALCULATION ──────────────────
function checkStreakStatus() {
  const lastActive = localStorage.getItem("sl_last_active");
  let streak = parseInt(localStorage.getItem("sl_streak") || "0", 10);
  
  if (!lastActive) return { streak: 0, status: "new" };

  // Generate safe midnight boundaries using native Date manipulations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  const yesterday = new Date(todayMs);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayMs = yesterday.getTime();

  const lastActiveDate = new Date(parseInt(lastActive, 10));
  lastActiveDate.setHours(0, 0, 0, 0);
  const lastActiveMs = lastActiveDate.getTime();

  if (lastActiveMs === todayMs) {
    return { streak, status: "completed_today" };
  } else if (lastActiveMs === yesterdayMs) {
    return { streak, status: "eligible" };
  } else {
    // If the last active date is older than yesterday, the streak resets
    localStorage.setItem("sl_streak", "0");
    return { streak: 0, status: "expired" };
  }
}

// ─── MAIN HUB REDESIGN ───────────────────────────────────────────
function pgDaily() {
  const container = el("div", { css: { maxWidth: "650px", margin: "0 auto", padding: "24px 16px", paddingBottom: "40px" } });
  
  // Guard clause to gracefully handle asynchronous load latency
  if (!window.SUBJ || !window.QD) {
    container.appendChild(el("div", { css: { textAlign: "center", padding: "60px 20px", color: "var(--muted)", fontSize: "0.95rem" }, txt: "Assembling your daily data workspace..." }));
    return container;
  }

  const streakInfo = checkStreakStatus();
  const now = Date.now();
  let dueCards = [];
  let totalKnown = 0;

  // The SRS Engine: Gather Due Cards Safely
  window.SUBJ.forEach(function(subj) {
    const sv = Sv.get("fc_" + subj);
    if (!sv || !sv.k) return;

    const knownData = sv.k; 
    const subjQuestions = window.QD[subj] || [];

    Object.keys(knownData).forEach(function(qId) {
      totalKnown++;
      if (knownData[qId] < now) {
        const match = subjQuestions.find(q => q.q && q.q.slice(0, 35) === qId);
        // Shallow copy ({...match}) keeps core database immutable if session tracking alters attributes
        if (match) {
          dueCards.push({ subject: subj, q: { ...match }, id: qId });
        }
      }
    });
  });

  // 1. Header with Gamified Streak Tracker
  const header = el("div", { css: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1.5px solid var(--border)" } });
  header.appendChild(el("div", {}, [
    el("h1", { css: { fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.01em", fontFamily: "var(--font-display)" }, txt: "🎯 Daily Smart Hub" }),
    el("p", { css: { fontSize: ".8rem", color: "var(--muted)", marginTop: "2px" }, txt: "Powered by Spaced Repetition Mechanics" })
  ]));

  const streakBadge = el("div", { css: { 
    display: "flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #ff6b6b, #ff8e53)", 
    padding: "6px 14px", borderRadius: "20px", color: "#fff", fontWeight: "700", fontSize: "0.85rem", boxShadow: "0 4px 12px rgba(255,107,107,0.25)" 
  } }, [
    el("span", { txt: "🔥" }),
    el("span", { txt: `${streakInfo.streak} Days` })
  ]);
  header.appendChild(streakBadge);
  container.appendChild(header);

  // 2. Twin Track Layout Grid
  const grid = el("div", { css: { display: "grid", gridTemplateColumns: "1fr", gap: "16px" } });

  // TRACK A: The Random Blind Challenge Card
  const challengeCompleted = streakInfo.status === "completed_today";
  const challengeCard = el("div", { css: { 
    background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px",
    boxShadow: "var(--shadow-card)", position: "relative"
  } });
  
  challengeCard.appendChild(el("div", { css: { fontSize: "0.7rem", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "6px" }, txt: "⚡ Daily Discovery" }));
  challengeCard.appendChild(el("h3", { css: { fontSize: "1.05rem", fontWeight: "700", marginBottom: "10px" }, txt: "Today's Blind Challenge" }));
  challengeCard.appendChild(el("p", { css: { fontSize: "0.85rem", color: "var(--muted)", marginBottom: "16px", lineHeight: "1.4" }, txt: "Face a single surprise question outside your standard study tracks to stretch your boundaries." }));
  
  if (challengeCompleted) {
    challengeCard.appendChild(el("div", { css: { background: "rgba(74,222,128,0.1)", border: "1px solid #4ade80", borderRadius: "8px", padding: "10px", color: "#4ade80", fontWeight: "600", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" } }, [
      el("span", { txt: "✅" }), el("span", { txt: "You completed today's surprise pool match!" })
    ]));
  } else {
    challengeCard.appendChild(el("button", { 
      cls: "btn btnp", 
      css: { width: "100%", background: "var(--text)", color: "var(--bg)", border: "none", padding: "10px" },
      onclick: () => launchRandomChallenge()
    }, "Reveal Challenge Question"));
  }
  grid.appendChild(challengeCard);

  // TRACK B: The Spaced Repetition (SRS) Card
  const reviewCard = el("div", { css: { 
    background: "var(--card)", border: "1.5px solid " + (dueCards.length > 0 ? "var(--border)" : "#4ade80"), 
    borderRadius: "16px", padding: "20px", boxShadow: "var(--shadow-card)"
  } });

  reviewCard.appendChild(el("div", { css: { fontSize: "0.7rem", fontWeight: "700", color: dueCards.length > 0 ? "#f59e0b" : "#4ade80", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "12px" }, txt: "🧠 Memory Matrix" }));
  
  const metrics = el("div", { css: { display: "flex", gap: "32px", marginBottom: "20px" } });
  metrics.appendChild(el("div", {}, [
    el("div", { css: { fontSize: "2rem", fontWeight: "800", color: dueCards.length > 0 ? "#f59e0b" : "#4ade80", lineHeight: "1" }, txt: String(dueCards.length) }),
    el("div", { css: { fontSize: "0.75rem", color: "var(--muted)", marginTop: "4px" }, txt: "Review Cards Due" })
  ]));
  metrics.appendChild(el("div", {}, [
    el("div", { css: { fontSize: "2rem", fontWeight: "800", color: "var(--text)", lineHeight: "1" }, txt: String(totalKnown) }),
    el("div", { css: { fontSize: "0.75rem", color: "var(--muted)", marginTop: "4px" }, txt: "Active Memory Track" })
  ]));
  reviewCard.appendChild(metrics);

  if (dueCards.length > 0) {
    reviewCard.appendChild(el("button", { 
      cls: "btn btnp", 
      css: { width: "100%", padding: "12px" }, 
      onclick: () => {
        if (typeof launchSRSRun === "function") {
          launchSRSRun(dueCards);
        } else {
          toast("Launching Spaced Repetition sequence...", "#3b82f6");
        }
      } 
    }, `Start Focused Review (${dueCards.length}) 🚀`));
  } else {
    reviewCard.appendChild(el("div", { css: { color: "#4ade80", fontSize: "0.85rem", fontWeight: "600", background: "rgba(74,222,128,0.1)", padding: "12px", borderRadius: "8px", textAlign: "center" }, txt: "🎉 Fantastic clean sheet! Your deck is clear." }));
  }
  
  grid.appendChild(reviewCard);
  container.appendChild(grid);

  return container;
}

// ─── CONTROLLER: DYNAMIC DISCOVERY ENGINE ───────────────────────
function launchRandomChallenge() {
  if (!window.SUBJ || !window.SUBJ.length) return toast("No active domains found!", "#ef4444");
  
  // Pick a truly random subject domain
  const randomSubj = window.SUBJ[Math.floor(Math.random() * window.SUBJ.length)];
  const targetPool = window.QD[randomSubj] || [];
  
  if (!targetPool.length) {
    return toast(`Subject track ${randomSubj} is empty.`, "#ef4444");
  }
  
  // Extract a surprise random question instance
  const randomQuestion = targetPool[Math.floor(Math.random() * targetPool.length)];
  
  toast(`Target locked: Loading unique ${randomSubj} puzzle...`, "var(--accent)");
  
  // Update state flags to anchor streak metrics securely upon passing to your rendering template
  const current = checkStreakStatus();
  localStorage.setItem("sl_streak", String(current.streak + 1));
  localStorage.setItem("sl_last_active", String(Date.now()));
  
  // Structural Routing: Hook your quiz-loader view here passing `randomQuestion`
}

// ─── CORE SHARE ARCHITECTURE ───────────────────────────────────
function shareScore(subj, correct, streak) {
  var text = "📚 StudyLab Daily Challenge\n" + 
             (correct ? "✅ Nailed today's question perfectly!" : "❌ Got caught on a tricky one today") + 
             "\n🔥 Current Streak: " + streak + " days" + 
             "\n🎓 Subject Arena: " + subj + 
             "\n\nTest your limits alongside me here:\n🌐 https://studylab-inky.vercel.app";
             
  if (navigator.share) {
    navigator.share({ title: "StudyLab Daily Challenge", text: text }).catch(err => console.log(err));
  } else {
    navigator.clipboard.writeText(text).then(function() {
      toast("Results compiled to clipboard! Share it 🚀");
    });
  }
}
