// ─── UTILITY: TIMEZONE-SAFE STREAK CALCULATION ──────────────────
function checkStreakStatus() {
  var lastActive = localStorage.getItem("sl_last_active");
  var streak = parseInt(localStorage.getItem("sl_streak") || "0", 10);
  
  if (!lastActive) return { streak: 0, status: "new" };

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var todayMs = today.getTime();

  var yesterday = new Date(todayMs);
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayMs = yesterday.getTime();

  var lastActiveDate = new Date(parseInt(lastActive, 10));
  lastActiveDate.setHours(0, 0, 0, 0);
  var lastActiveMs = lastActiveDate.getTime();

  if (lastActiveMs === todayMs) {
    return { streak: streak, status: "completed_today" };
  } else if (lastActiveMs === yesterdayMs) {
    return { streak: streak, status: "eligible" };
  } else {
    localStorage.setItem("sl_streak", "0");
    return { streak: 0, status: "expired" };
  }
}

// ─── SHARE SCORE: PROFESSIONAL CANVAS GRAPHIC GENERATOR ────────
function shareScore(subj, correct, streak) {
  var canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 450;
  var ctx = canvas.getContext("2d");

  // Gradient Background
  var grad = ctx.createLinearGradient(0, 0, 800, 450);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(1, "#1e293b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 450);

  // Structural Accent Border
  ctx.fillStyle = correct ? "#10b981" : "#f43f5e";
  ctx.fillRect(0, 0, 12, 450);

  ctx.textBaseline = "top";
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("STUDYLAB DAILY CHALLENGE RECORD", 50, 45);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  var statusText = correct ? "Challenge Completed" : "Challenge Attempted";
  ctx.fillText(statusText, 50, 75);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "13px sans-serif";
  ctx.fillText("SUBJECT FOCUS", 50, 160);
  
  ctx.fillStyle = "#f8fafc";
  ctx.font = "600 22px sans-serif";
  ctx.fillText(subj, 50, 185);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "13px sans-serif";
  ctx.fillText("CURRENT STREAK TRACK", 50, 250);
  
  ctx.fillStyle = "#3b82f6"; 
  ctx.font = "bold 46px sans-serif";
  ctx.fillText(streak + " Days", 50, 275);

  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = "13px sans-serif";
  ctx.fillText("studylab-inky.vercel.app", 50, 380);

  var textDescription = "StudyLab Daily Challenge Update. Track: " + subj + " | Current Streak: " + streak + " days. Keep training at https://studylab-inky.vercel.app";

  canvas.toBlob(function(blob) {
    if (!blob) return;
    var file = new File([blob], "studylab-challenge.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ title: "StudyLab Daily Challenge", text: textDescription, files: [file] }).catch(function(){});
    } else {
      navigator.clipboard.writeText(textDescription).then(function() {
        var link = document.createElement("a");
        link.download = "studylab-score.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        if (typeof toast === "function") toast("Performance copied & card downloaded.", "#10b981");
      });
    }
  }, "image/png");
}

// ─── DAILY CHALLENGE HUB OVERHAUL ────────────────────────────────
function pgDaily() {
  var w = el("div", { css: { 
    maxWidth: "600px", 
    margin: "0 auto", 
    padding: "32px 16px 60px 16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  } });

  // Safety Fallback if PapaParse sheets haven't finished downloading yet
  if (!window.SUBJ || !window.QD || Object.keys(window.QD).length === 0) {
    w.appendChild(el("div", { css: { textAlign: "center", padding: "40px", color: "var(--muted, #666)" }, txt: "Syncing study modules from cloud matrix..." }));
    return w;
  }

  var streakInfo = checkStreakStatus();

  // 1. Premium Header containing an elegant Target SVG vector
  var hdr = el("div", { css: { 
    display: "flex", 
    alignItems: "center", 
    gap: "14px", 
    marginBottom: "36px", 
    paddingBottom: "20px", 
    borderBottom: "1px solid var(--border, #eaeaea)" 
  } });

  var targetSvg = el("svg", { 
    attr: { viewBox: "0 0 24 24", width: "26", height: "26", fill: "none", stroke: "currentColor", strokeWidth: "2.5" }, 
    css: { color: "var(--accent, #3b82f6)", flexShrink: "0" } 
  }, [
    el("circle", { attr: { cx: "12", cy: "12", r: "10" } }),
    el("circle", { attr: { cx: "12", cy: "12", r: "6" } }),
    el("circle", { attr: { cx: "12", cy: "12", r: "1.5", fill: "currentColor" } })
  ]);
  hdr.appendChild(targetSvg);

  var headerContent = el("div", { css: { flex: "1" } }, [
    el("div", { css: { fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.02em", color: "var(--text, #111)" }, txt: "Daily Challenge Hub" }),
    el("div", { css: { fontSize: ".85rem", color: "var(--muted, #666)", marginTop: "2px" }, txt: "Smart Review & Global Milestones" })
  ]);
  hdr.appendChild(headerContent);

  // Premium Streak Indicator Pill Badge
  var streakBadge = el("div", { css: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    padding: "6px 14px", borderRadius: "20px", color: "#fff", fontWeight: "700", fontSize: "0.8rem",
    boxShadow: "0 4px 12px rgba(59,130,246,0.2)"
  } }, [
    el("span", { txt: "STREAK: " + streakInfo.streak + " DAYS" })
  ]);
  hdr.appendChild(streakBadge);
  w.appendChild(hdr);

  // 2. YOUR ORIGINAL SRS ALGORITHM ENGINE (Completely Untouched)
  var now = Date.now();
  var dueCards = [];
  var totalKnown = 0;

  window.SUBJ.forEach(function(subj) {
    var sv = Sv.get("fc_" + subj);
    if (!sv || !sv.k) return;

    var knownData = sv.k; 
    var subjQuestions = window.QD[subj] || [];

    subjQuestions.forEach(function(q) {
      if (!q || !q.q || typeof q.q !== "string") return; 
      var qId = q.q.slice(0, 35);
      if (knownData[qId]) {
        totalKnown++;
        if (knownData[qId] < now) {
          dueCards.push({ subject: subj, q: q, id: qId });
        }
      }
    });
  });

  // 3. UI Dashboard Layout
  var dash = el("div", { css: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "16px", 
    marginBottom: "32px" 
  } });

  var dynamicBg = dueCards.length > 0 ? "rgba(245,158,11,0.06)" : "rgba(34,197,94,0.06)";
  var dynamicBorder = dueCards.length > 0 ? "1px solid rgba(245,158,11,0.25)" : "1px solid rgba(34,197,94,0.25)";
  var dynamicColor = dueCards.length > 0 ? "#d97706" : "#16a34a";

  var dueBox = el("div", { css: { background: dynamicBg, border: dynamicBorder, borderRadius: "20px", padding: "28px 20px", textAlign: "center" } });
  dueBox.appendChild(el("div", { css: { fontSize: "2.8rem", fontWeight: "800", color: dynamicColor, lineHeight: "1", letterSpacing: "-0.03em" }, txt: String(dueCards.length) }));
  dueBox.appendChild(el("div", { css: { fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text, #111)", fontWeight: "700", marginTop: "12px", opacity: "0.8" }, txt: "Cards Due" }));
  dash.appendChild(dueBox);

  var memBox = el("div", { css: { background: "var(--card, #fff)", border: "1px solid var(--border, #eaeaea)", borderRadius: "20px", padding: "28px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" } });
  memBox.appendChild(el("div", { css: { fontSize: "2.8rem", fontWeight: "800", color: "var(--accent, #3b82f6)", lineHeight: "1", letterSpacing: "-0.03em" }, txt: String(totalKnown) }));
  memBox.appendChild(el("div", { css: { fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted, #666)", fontWeight: "700", marginTop: "12px" }, txt: "In Learning Phase" }));
  dash.appendChild(memBox);
  w.appendChild(dash);

  // 4. SMART CONTEXTUAL ACTION AREA
  var startBox = el("div", { css: { 
    padding: "36px 24px", background: "var(--card, #fff)", borderRadius: "24px", 
    border: "1px solid var(--border, #eaeaea)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", textAlign: "center"
  } });

  if (dueCards.length > 0) {
    // SCENARIO A: User has pending historical cards ready for calculation
    startBox.appendChild(el("div", { css: { fontSize: ".92rem", color: "var(--text, #333)", marginBottom: "24px", lineHeight: "1.6" }, txt: "You have personalized flashcards waiting for review. The algorithm determines these are the points you are most likely to forget today." }));
    
    var runBtn = el("button", { 
      cls: "btn btnp", 
      css: { width: "100%", padding: "16px", fontSize: "1.05rem", fontWeight: "700", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }, 
      onclick: function() {
        if (typeof launchSRSRun === "function") { launchSRSRun(dueCards); } 
        else { toast("Daily Review Engine launching...", "#3b82f6"); }
      } 
    }, [
      el("span", { txt: "Start Personal Review" }),
      el("svg", { attr: { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5" } }, [
        el("line", { attr: { x1: "5", y1: "12", x2: "19", y2: "12" } }),
        el("polyline", { attr: { points: "12 5 19 12 12 19" } })
      ])
    ]);
    startBox.appendChild(runBtn);
    w.appendChild(startBox);

  } else {
    // SCENARIO B: User is fully caught up (Like your screenshot!) -> Auto-Generate a Blind Daily Question from window.QD
    var randomSubject = window.SUBJ[Math.floor(Math.random() * window.SUBJ.length)];
    var subPool = window.QD[randomSubject] || [];
    
    if (subPool.length > 0) {
      var dailyQuestionObj = subPool[Math.floor(Math.random() * subPool.length)];

      startBox.appendChild(el("div", { css: { fontSize: "0.72rem", fontWeight: "800", color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }, txt: "⚡ Daily Blind Pool Challenge" }));
      startBox.appendChild(el("div", { css: { fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }, txt: "You're all caught up for the day!" }));
      startBox.appendChild(el("div", { css: { fontSize: ".88rem", color: "var(--muted, #666)", marginBottom: "24px", lineHeight: "1.5", maxWidth: "440px", margin: "0 auto 24px auto" }, txt: "Your scheduled decks are completely empty. Test your boundaries with a random question drawn from your " + randomSubject + " database sheets instead." }));
      
      var blindBtn = el("button", {
        cls: "btn btnp",
        css: { width: "100%", padding: "16px", fontSize: "1.05rem", fontWeight: "700", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--text, #111)", color: "var(--bg, #fff)" },
        onclick: function() {
          // Process streak progression
          localStorage.setItem("sl_streak", String(streakInfo.streak + 1));
          localStorage.setItem("sl_last_active", String(Date.now()));
          
          // Route question payload securely straight into your main layout renderer
          if (typeof go === "function") {
            go("quiz", { subject: randomSubject, singleQuestion: dailyQuestionObj });
          } else {
            toast("Launching " + randomSubject + " Blind Challenge...", "var(--accent)");
          }
        }
      }, [
        el("span", { txt: "Launch Today's Question" }),
        el("svg", { attr: { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5" } }, [
          el("path", { attr: { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" } }),
          el("polyline", { attr: { points: "15 3 21 3 21 9" } }),
          el("line", { attr: { x1: "10", y1: "14", x2: "21", y2: "3" } })
        ])
      ]);
      startBox.appendChild(blindBtn);
    } else {
      // Catch-all safety if the databases are initialized but empty
      startBox.appendChild(el("div", { css: { fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }, txt: "You're all caught up!" }));
      startBox.appendChild(el("button", { cls: "btn btnp", onclick: function() { go("home"); } }, "Explore Subjects"));
    }
    w.appendChild(startBox);
  }

  return w;
}
