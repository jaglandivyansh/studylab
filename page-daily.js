// ─── UTILITY: TIMEZONE-SAFE CALENDAR DAILY SEED ──────────────────
function getDailySeedIndex(poolLength) {
  if (!poolLength) return 0;
  // Generates a stable number based on Year, Month, and Day (e.g., 20260608)
  var d = new Date();
  var dateCode = (d.getFullYear() * 10000) + ((d.getMonth() + 1) * 100) + d.getDate();
  return dateCode % poolLength;
}

// ─── UTILITY: STREAK AND LOCK-STATE ENGINE ──────────────────────
function getDailyState() {
  var d = new Date();
  var todayKey = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  
  var lastClearedDate = localStorage.getItem("sl_daily_last_cleared");
  var streak = parseInt(localStorage.getItem("sl_daily_streak") || "0", 10);
  var hasPlayedToday = (lastClearedDate === todayKey);

  // Check if streak expired (user missed yesterday)
  if (lastClearedDate && !hasPlayedToday) {
    var todayMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    var lastActiveParts = lastActiveDate = lastClearedDate.split("-");
    var lastActiveMs = new Date(parseInt(lastActiveParts[0], 10), parseInt(lastActiveParts[1], 10) - 1, parseInt(lastActiveParts[2], 10)).getTime();
    
    // If gap is greater than 24 hours (86400000 ms), reset streak
    if (todayMs - lastActiveMs > 86400000) {
      streak = 0;
      localStorage.setItem("sl_daily_streak", "0");
    }
  }

  return {
    todayKey: todayKey,
    streak: streak,
    hasPlayedToday: hasPlayedToday,
    savedAnswer: localStorage.getItem("sl_daily_user_ans")
  };
}

// ─── SHARE SCORE: PREMIUM OFF-SCREEN CANVAS GENERATOR ──────────
function shareScore(subj, correct, streak) {
  var canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 450;
  var ctx = canvas.getContext("2d");

  // Editorial Background Gradient
  var grad = ctx.createLinearGradient(0, 0, 800, 450);
  grad.addColorStop(0, "#090d16");
  grad.addColorStop(1, "#111827");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 450);

  // Brand Accent Side Pillar
  ctx.fillStyle = correct ? "#10b981" : "#f43f5e";
  ctx.fillRect(0, 0, 14, 450);

  ctx.textBaseline = "top";
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("STUDYLAB INTELLECT MATRIX PRO", 50, 45);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(correct ? "Daily Arena Cleared" : "Daily Arena Attempted", 50, 75);

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SECTOR TOPIC", 50, 170);
  
  ctx.fillStyle = "#f1f5f9";
  ctx.font = "600 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(subj, 50, 195);

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("ACTIVE SUCCESS STREAK", 50, 265);
  
  ctx.fillStyle = "#3b82f6"; 
  ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(streak + " Days", 50, 290);

  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("studylab-inky.vercel.app", 50, 385);

  var textDescription = "StudyLab Daily Challenge Arena compiled. Topic: " + subj + " | Active Streak: " + streak + " days. Challenge yourself at https://studylab-inky.vercel.app";

  canvas.toBlob(function(blob) {
    if (!blob) return;
    var file = new File([blob], "studylab-daily.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ title: "StudyLab Daily", text: textDescription, files: [file] }).catch(function(){});
    } else {
      navigator.clipboard.writeText(textDescription).then(function() {
        var link = document.createElement("a");
        link.download = "studylab-performance.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        if (typeof toast === "function") toast("Performance record finalized & graphic saved.", "#10b981");
      });
    }
  }, "image/png");
}

// ─── MAIN PREMIUM DAILY HUB PAGE ──────────────────────────────────
function pgDaily() {
  var w = el("div", { css: { 
    maxWidth: "600px", 
    margin: "0 auto", 
    padding: "32px 16px 60px 16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  } });

  // 1. Loading Safe Fallback (Checks your sheet database window.QD setup)
  if (!window.SUBJ || !window.QD || Object.keys(window.QD).length === 0) {
    w.appendChild(el("div", { css: { textAlign: "center", padding: "60px 20px", color: "var(--muted, #666)", fontSize: "0.95rem" }, txt: "Syncing global daily challenge core..." }));
    return w;
  }

  var appState = getDailyState();

  // 2. Select Question Dynamically (Consistent for all users on this calendar date)
  var allGlobalQuestions = [];
  window.SUBJ.forEach(function(subj) {
    var list = window.QD[subj] || [];
    list.forEach(function(item) {
      allGlobalQuestions.push({ data: item, subjectName: subj });
    });
  });

  if (allGlobalQuestions.length === 0) {
    w.appendChild(el("div", { css: { textAlign: "center", padding: "40px", color: "var(--muted)" }, txt: "No questions currently configured." }));
    return w;
  }

  var targetedIndex = getDailySeedIndex(allGlobalQuestions.length);
  var dailyChallenge = allGlobalQuestions[targetedIndex].data;
  var dailySubject = allGlobalQuestions[targetedIndex].subjectName;

  // 3. Editorial Premium Header View
  var hdr = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid var(--border, #eaeaea)" } });
  
  var leftHeader = el("div", {}, [
    el("div", { css: { fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.02em", color: "var(--text, #111)" }, txt: "Daily Arena" }),
    el("div", { css: { fontSize: ".85rem", color: "var(--muted, #666)", marginTop: "2px" }, txt: "One focus question. Every 24 hours." })
  ]);
  hdr.appendChild(leftHeader);

  // High-end Streak Counter Badge Vector Integration
  var streakBadge = el("div", { css: { 
    display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    padding: "8px 16px", borderRadius: "24px", color: "#fff", fontWeight: "700", fontSize: "0.85rem", boxShadow: "0 4px 14px rgba(37,99,235,0.2)"
  } });
  
  var flameSvg = el("svg", { attr: { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor" } }, [
    el("path", { attr: { d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" } }),
    el("path", { attr: { d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" } })
  ]);
  streakBadge.appendChild(flameSvg);
  streakBadge.appendChild(el("span", { txt: String(appState.streak) + " DAYS" }));
  hdr.appendChild(streakBadge);
  w.appendChild(hdr);

  // 4. Interactive Main Focus Question Space
  var arenaCard = el("div", { css: {
    background: "var(--card, #fff)", border: "1px solid var(--border, #eaeaea)", borderRadius: "24px",
    padding: "28px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", marginBottom: "24px"
  } });

  // Category Tag Meta
  arenaCard.appendChild(el("div", { css: { fontSize: "0.72rem", fontWeight: "800", color: "var(--accent, #3b82f6)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }, txt: dailySubject + " • " + (dailyChallenge.topic || "General") }));
  
  // Clean Question Body text layout
  arenaCard.appendChild(el("div", { css: { fontSize: "1.15rem", fontWeight: "700", lineHeight: "1.5", color: "var(--text, #111)", marginBottom: "24px" }, txt: dailyChallenge.q }));

  // Options Container Render
  var optionsWrapper = el("div", { css: { display: "flex", flexDirection: "column", gap: "10px" } });
  
  var optionsList = dailyChallenge.o || [];
  optionsList.forEach(function(optionText, optionIdx) {
    if (!optionText) return;

    var isSelected = (appState.savedAnswer !== null && parseInt(appState.savedAnswer, 10) === optionIdx);
    var isCorrectOption = (optionIdx === dailyChallenge.a);

    // Baseline element styling rules
    var optStyle = {
      width: "100%", padding: "14px 18px", borderRadius: "14px", border: "1px solid var(--border, #eaeaea)",
      background: "var(--bg, #f9fafb)", textAlign: "left", fontSize: "0.95rem", fontWeight: "500",
      cursor: appState.hasPlayedToday ? "default" : "pointer", transition: "all 0.15s ease", color: "var(--text, #333)"
    };

    // If already locked in for the day, style correct/incorrect states instantly
    if (appState.hasPlayedToday) {
      if (isCorrectOption) {
        optStyle.background = "rgba(16, 185, 129, 0.08)";
        optStyle.borderColor = "#10b981";
        optStyle.color = "#047857";
        optStyle.fontWeight = "700";
      } else if (isSelected && !isCorrectOption) {
        optStyle.background = "rgba(244, 63, 94, 0.08)";
        optStyle.borderColor = "#f43f5e";
        optStyle.color = "#be123c";
      } else {
        optStyle.opacity = "0.5";
      }
    }

    var optBtn = el("button", { css: optStyle, txt: optionText });

    // Click handler configuration
    if (!appState.hasPlayedToday) {
      optBtn.onclick = function() {
        var isCorrect = (optionIdx === dailyChallenge.a);
        var calculatedStreak = isCorrect ? (appState.streak + 1) : 0;

        // Commit immutable parameters securely to Local Storage
        localStorage.setItem("sl_daily_last_cleared", appState.todayKey);
        localStorage.setItem("sl_daily_user_ans", String(optionIdx));
        localStorage.setItem("sl_daily_streak", String(calculatedStreak));

        if (typeof toast === "function") {
          if (isCorrect) toast("Target verified. Streak continuous.", "#10b981");
          else toast("Answer incorrect. Streak broken.", "#f43f5e");
        }

        // Trigger safe UI re-evaluation loop
        if (typeof go === "function") { go("daily"); } 
        else {
          // If native framework router does not exist, swap out to refresh changes
          w.innerHTML = "";
          w.appendChild(pgDaily().innerHTML);
        }
      };
    }

    optionsWrapper.appendChild(optBtn);
  });

  arenaCard.appendChild(optionsWrapper);
  w.appendChild(arenaCard);

  // 5. Post-Action Sharing Workspace Dashboard UI
  if (appState.hasPlayedToday) {
    var wasCorrect = (parseInt(appState.savedAnswer, 10) === dailyChallenge.a);

    var actionCard = el("div", { css: { 
      textAlign: "center", padding: "28px 24px", background: "var(--card, #fff)", borderRadius: "24px",
      border: "1px solid var(--border, #eaeaea)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
    } });

    actionCard.appendChild(el("div", { 
      css: { fontSize: "1.1rem", fontWeight: "700", marginBottom: "6px", color: wasCorrect ? "#10b981" : "#f43f5e" }, 
      txt: wasCorrect ? "Spectacular work!" : "Locked till tomorrow"
    }));
    
    actionCard.appendChild(el("div", { 
      css: { fontSize: "0.88rem", color: "var(--muted, #666)", marginBottom: "20px" }, 
      txt: wasCorrect ? "You solved today's puzzle. Broadcast your streak record to your colleagues." : "The tracking system is locked. Come back tomorrow for the next challenge matrix." 
    }));

    var shareBtn = el("button", {
      cls: "btn btnp",
      css: { 
        width: "100%", padding: "14px", fontSize: "1rem", fontWeight: "700", borderRadius: "14px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "none"
      },
      onclick: function() {
        shareScore(dailySubject, wasCorrect, appState.streak);
      }
    }, [
      el("span", { txt: "Share Challenge Card" }),
      el("svg", { attr: { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2.5" } }, [
        el("circle", { attr: { cx: "18", cy: "5", r: "3" } }),
        el("circle", { attr: { cx: "6", cy: "12", r: "3" } }),
        el("circle", { attr: { cx: "18", cy: "19", r: "3" } }),
        el("line", { attr: { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" } }),
        el("line", { attr: { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" } })
      ])
    ]);

    actionCard.appendChild(shareBtn);
    w.appendChild(actionCard);
  }

  return w;
}
