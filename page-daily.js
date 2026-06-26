// ─── UTILITY: TIMEZONE-SAFE CALENDAR DAILY SEED ──────────────────
function getDailySeedIndex(poolLength) {
  if (!poolLength) return 0;
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

  // Reset streak if user missed yesterday
  if (lastClearedDate && !hasPlayedToday) {
    var todayMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    var lastActiveParts = lastClearedDate.split("-"); // FIX: was accidentally creating global `lastActiveDate`
    var lastActiveMs = new Date(
      parseInt(lastActiveParts[0], 10),
      parseInt(lastActiveParts[1], 10) - 1,
      parseInt(lastActiveParts[2], 10)
    ).getTime();

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

// ─── UTILITY: TIME UNTIL MIDNIGHT (next question unlock) ─────────
function getCountdownToMidnight() {
  var now = new Date();
  var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  var diff = midnight - now.getTime();
  var h = Math.floor(diff / 3600000);
  var m = Math.floor((diff % 3600000) / 60000);
  return h + "h " + m + "m";
}

// ─── SHARE SCORE: OFF-SCREEN CANVAS CARD GENERATOR ──────────────
function shareScore(subj, correct, streak) {
  var canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 440;
  var ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, 800, 440);

  // Top accent bar
  ctx.fillStyle = correct ? "#10b981" : "#f43f5e";
  ctx.fillRect(0, 0, 800, 5);

  // Streak color
  var streakColor = streak >= 7 ? "#f59e0b" : streak >= 3 ? "#3b82f6" : "#6b7280";

  ctx.textBaseline = "top";

  // Brand label
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "600 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("STUDYLAB · DAILY ARENA", 48, 44);

  // Result headline
  ctx.fillStyle = correct ? "#10b981" : "#f43f5e";
  ctx.font = "bold 42px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(correct ? "Correct!" : "Attempted", 48, 72);

  // Subject tag background (rounded rect via arc)
  var tagLabel = subj.toUpperCase();
  var tagW = ctx.measureText(tagLabel).width + 24;
  ctx.fillStyle = "rgba(59,130,246,0.18)";
  ctx.beginPath();
  ctx.roundRect(48, 148, tagW, 28, 6);
  ctx.fill();
  ctx.fillStyle = "#60a5fa";
  ctx.font = "700 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(tagLabel, 60, 156);

  // Streak label
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "600 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("CURRENT STREAK", 48, 210);

  // Streak number
  ctx.fillStyle = streakColor;
  ctx.font = "bold 64px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(String(streak), 48, 232);

  // "days" label beside number
  var numWidth = ctx.measureText(String(streak)).width;
  ctx.fillStyle = streakColor;
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("days", 48 + numWidth + 10, 268);

  // Divider line
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 340);
  ctx.lineTo(752, 340);
  ctx.stroke();

  // URL
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("studylab-inky.vercel.app", 48, 396);

  var textDescription = "StudyLab Daily Arena | " + subj + " | Streak: " + streak + " days → studylab-inky.vercel.app";

  canvas.toBlob(function(blob) {
    if (!blob) return;
    var file = new File([blob], "studylab-daily.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ title: "StudyLab Daily", text: textDescription, files: [file] }).catch(function() {});
    } else {
      navigator.clipboard.writeText(textDescription).then(function() {
        var link = document.createElement("a");
        link.download = "studylab-daily.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        if (typeof toast === "function") toast("Card saved to your device.", "#10b981");
      });
    }
  }, "image/png");
}

// ─── MAIN DAILY ARENA PAGE ────────────────────────────────────────
function pgDaily() {
  var w = el("div", { css: {
    maxWidth: "580px",
    margin: "0 auto",
    padding: "28px 16px 72px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }});

  // Loading guard
  if (!window.SUBJ || !window.QD || Object.keys(window.QD).length === 0) {
    w.appendChild(el("div", { css: {
      textAlign: "center", padding: "80px 20px",
      color: "var(--muted, #888)", fontSize: "0.9rem"
    }, txt: "Loading..." }));
    return w;
  }

  var appState = getDailyState();

  // Build flat question pool from all subjects
  var allQ = [];
  window.SUBJ.forEach(function(subj) {
    (window.QD[subj] || []).forEach(function(item) {
      allQ.push({ data: item, subjectName: subj });
    });
  });

  if (allQ.length === 0) {
    w.appendChild(el("div", { css: {
      textAlign: "center", padding: "40px", color: "var(--muted, #888)"
    }, txt: "No questions configured yet." }));
    return w;
  }

  var entry = allQ[getDailySeedIndex(allQ.length)];
  var Q     = entry.data;
  var Subj  = entry.subjectName;

  // Formatted date string
  var now    = new Date();
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var WDAYS  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var dateStr = WDAYS[now.getDay()] + ", " + now.getDate() + " " + MONTHS[now.getMonth()];

  // ── HEADER ──────────────────────────────────────────────────────
  var hdr = el("div", { css: {
    display: "flex", alignItems: "flex-start",
    justifyContent: "space-between", marginBottom: "26px"
  }});

  // Left: date + title + subtitle
  var hLeft = el("div", {});
  hLeft.appendChild(el("div", { css: {
    fontSize: "0.72rem", fontWeight: "600", color: "var(--muted, #999)",
    textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "7px"
  }, txt: dateStr }));
  hLeft.appendChild(el("div", { css: {
    fontSize: "1.55rem", fontWeight: "800", letterSpacing: "-0.025em",
    color: "var(--text, #111)", lineHeight: "1.1"
  }, txt: "Daily Arena" }));
  hLeft.appendChild(el("div", { css: {
    fontSize: "0.8rem", color: "var(--muted, #999)", marginTop: "5px"
  }, txt: "One question · every 24 hours" }));
  hdr.appendChild(hLeft);

  // Right: adaptive streak badge
  // Color shifts with milestone: gray < 3 days, blue 3–6, amber 7+
  var sColor  = appState.streak >= 7 ? "#b45309" : appState.streak >= 3 ? "#1d4ed8" : "#6b7280";
  var sBg     = appState.streak >= 7 ? "rgba(251,191,36,0.12)" : appState.streak >= 3 ? "rgba(37,99,235,0.1)" : "rgba(0,0,0,0.05)";
  var sBorder = appState.streak >= 7 ? "rgba(245,158,11,0.3)" : appState.streak >= 3 ? "rgba(37,99,235,0.25)" : "rgba(0,0,0,0.1)";
  var sEmoji  = appState.streak >= 7 ? "🔥" : appState.streak >= 3 ? "⚡" : "📅";

  var sPill = el("div", { css: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 14px", borderRadius: "22px",
    background: sBg, border: "1px solid " + sBorder
  }});
  sPill.appendChild(el("span", { css: { fontSize: "1rem", lineHeight: "1" }, txt: sEmoji }));
  sPill.appendChild(el("span", { css: {
    fontSize: "1rem", fontWeight: "800", color: sColor, lineHeight: "1"
  }, txt: String(appState.streak) }));
  sPill.appendChild(el("span", { css: {
    fontSize: "0.72rem", fontWeight: "600", color: sColor, opacity: "0.75"
  }, txt: appState.streak === 1 ? "day" : "days" }));
  hdr.appendChild(sPill);
  w.appendChild(hdr);

  // ── QUESTION CARD ────────────────────────────────────────────────
  var qCard = el("div", { css: {
    background: "var(--card, #fff)",
    border: "1px solid var(--border, #e5e7eb)",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "14px"
  }});

  // Thin gradient top accent (signals "active challenge")
  qCard.appendChild(el("div", { css: {
    height: "3px",
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)"
  }}));

  var qBody = el("div", { css: { padding: "22px 20px 20px" }});

  // Subject + topic pills
  var pillRow = el("div", { css: {
    display: "flex", alignItems: "center", gap: "8px",
    flexWrap: "wrap", marginBottom: "14px"
  }});
  pillRow.appendChild(el("span", { css: {
    fontSize: "0.65rem", fontWeight: "800", padding: "4px 9px", borderRadius: "6px",
    background: "rgba(59,130,246,0.08)", color: "#2563eb",
    textTransform: "uppercase", letterSpacing: "0.07em"
  }, txt: Subj }));
  if (Q.topic) {
    pillRow.appendChild(el("span", { css: {
      fontSize: "0.75rem", color: "var(--muted, #999)", fontWeight: "500"
    }, txt: Q.topic }));
  }
  qBody.appendChild(pillRow);

  // Question text
  qBody.appendChild(el("p", { css: {
    fontSize: "1.03rem", fontWeight: "600", lineHeight: "1.65",
    color: "var(--text, #111)", margin: "0 0 20px"
  }, txt: Q.q }));

  // ── OPTIONS ──────────────────────────────────────────────────────
  var LABELS = ["A", "B", "C", "D", "E"];
  var optsWrap = el("div", { css: { display: "flex", flexDirection: "column", gap: "8px" }});
  var optionsList = Q.o || [];

  optionsList.forEach(function(optText, idx) {
    if (!optText) return;

    var isSel  = (appState.savedAnswer !== null && parseInt(appState.savedAnswer, 10) === idx);
    var isCorr = (idx === Q.a);
    var locked = appState.hasPlayedToday;

    // Option button style
    var btnCss = {
      width: "100%", display: "flex", alignItems: "flex-start", gap: "11px",
      padding: "12px 15px", borderRadius: "12px",
      border: "1px solid var(--border, #e5e7eb)",
      background: "var(--bg, #f8fafc)",
      textAlign: "left", cursor: locked ? "default" : "pointer",
      fontSize: "0.91rem", fontWeight: "500",
      color: "var(--text, #333)", lineHeight: "1.5",
      transition: "border-color .12s, background .12s"
    };

    // Label badge (A / B / C / D prefix)
    var lblCss = {
      flexShrink: "0", width: "22px", height: "22px", borderRadius: "6px",
      background: "var(--border, #e8eaed)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.68rem", fontWeight: "800",
      color: "var(--muted, #999)", marginTop: "1px"
    };

    // Apply locked-state colors
    if (locked) {
      if (isCorr) {
        btnCss.background  = "rgba(16,185,129,0.07)";
        btnCss.borderColor = "#10b981";
        btnCss.color       = "#065f46";
        lblCss.background  = "#10b981";
        lblCss.color       = "#fff";
      } else if (isSel) {
        btnCss.background  = "rgba(239,68,68,0.07)";
        btnCss.borderColor = "#ef4444";
        btnCss.color       = "#991b1b";
        lblCss.background  = "#ef4444";
        lblCss.color       = "#fff";
      } else {
        btnCss.opacity = "0.38";
      }
    }

    // Label symbol: tick/cross when locked, letter otherwise
    var lblSymbol = locked && isCorr ? "✓"
      : (locked && isSel && !isCorr) ? "✗"
      : (LABELS[idx] || String(idx + 1));

    var btn = el("button", { css: btnCss });
    btn.appendChild(el("span", { css: lblCss, txt: lblSymbol }));
    btn.appendChild(el("span", { txt: optText }));

    // Hover effects (only before answering)
    if (!locked) {
      btn.onmouseover = function() {
        this.style.borderColor = "#3b82f6";
        this.style.background  = "rgba(59,130,246,0.04)";
      };
      btn.onmouseout = function() {
        this.style.borderColor = "var(--border, #e5e7eb)";
        this.style.background  = "var(--bg, #f8fafc)";
      };

      btn.onclick = function() {
        var isCorrect  = (idx === Q.a);
        var newStreak  = isCorrect ? (appState.streak + 1) : 0;

        localStorage.setItem("sl_daily_last_cleared", appState.todayKey);
        localStorage.setItem("sl_daily_user_ans",    String(idx));
        localStorage.setItem("sl_daily_streak",      String(newStreak));

        if (typeof toast === "function") {
          toast(
            isCorrect ? "Correct! Streak: " + newStreak + " day" + (newStreak !== 1 ? "s" : "") + " 🔥"
                      : "Incorrect. Come back tomorrow.",
            isCorrect ? "#10b981" : "#ef4444"
          );
        }

        // FIX: original had pgDaily().innerHTML which returned undefined
        if (typeof go === "function") {
          go("daily");
        } else {
          while (w.firstChild) w.removeChild(w.firstChild);
          w.appendChild(pgDaily());
        }
      };
    }

    optsWrap.appendChild(btn);
  });

  qBody.appendChild(optsWrap);

  // Tap nudge (shown before answering only)
  if (!appState.hasPlayedToday) {
    qBody.appendChild(el("div", { css: {
      marginTop: "16px", textAlign: "center",
      fontSize: "0.74rem", color: "var(--muted, #bbb)"
    }, txt: "Select an option to lock in your answer" }));
  }

  qCard.appendChild(qBody);
  w.appendChild(qCard);

  // ── POST-ANSWER SECTION ──────────────────────────────────────────
  if (appState.hasPlayedToday) {
    var wasCorrect = (parseInt(appState.savedAnswer, 10) === Q.a);

    // Explanation card — renders only if Q.exp field is set in your question data
    if (Q.exp) {
      var expCard = el("div", { css: {
        background: "rgba(59,130,246,0.05)",
        border: "1px solid rgba(59,130,246,0.18)",
        borderRadius: "16px", padding: "18px 20px", marginBottom: "12px"
      }});
      expCard.appendChild(el("div", { css: {
        fontSize: "0.65rem", fontWeight: "800", color: "#2563eb",
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "9px"
      }, txt: "💡 Why this answer?" }));
      expCard.appendChild(el("div", { css: {
        fontSize: "0.88rem", lineHeight: "1.7", color: "var(--text, #333)"
      }, txt: Q.exp }));
      w.appendChild(expCard);
    }

    // Result + share card
    var resCard = el("div", { css: {
      background: "var(--card, #fff)",
      border: "1px solid var(--border, #e5e7eb)",
      borderRadius: "20px", padding: "22px 20px"
    }});

    // Result header row
    var resTop = el("div", { css: {
      display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px"
    }});
    resTop.appendChild(el("span", { css: { fontSize: "2rem", lineHeight: "1" }, txt: wasCorrect ? "🎯" : "📖" }));

    var resTxt = el("div", {});
    resTxt.appendChild(el("div", { css: {
      fontSize: "0.98rem", fontWeight: "700", marginBottom: "3px",
      color: wasCorrect ? "#059669" : "#dc2626"
    }, txt: wasCorrect ? "Streak extended!" : "Better luck tomorrow" }));
    resTxt.appendChild(el("div", { css: {
      fontSize: "0.81rem", color: "var(--muted, #999)", lineHeight: "1.45"
    }, txt: wasCorrect
      ? "You're on a " + appState.streak + "-day streak. Come back tomorrow."
      : "The correct answer is highlighted above. Review and return." }));
    resTop.appendChild(resTxt);
    resCard.appendChild(resTop);

    // Divider
    resCard.appendChild(el("div", { css: {
      height: "1px", background: "var(--border, #e5e7eb)", margin: "0 0 16px"
    }}));

    // Countdown row
    var nextRow = el("div", { css: {
      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"
    }});
    nextRow.appendChild(el("span", { css: { fontSize: "0.8rem", color: "var(--muted, #999)" }, txt: "Next challenge in" }));
    nextRow.appendChild(el("span", { css: {
      fontSize: "0.85rem", fontWeight: "700",
      color: "var(--text, #111)", fontVariantNumeric: "tabular-nums"
    }, txt: getCountdownToMidnight() }));
    resCard.appendChild(nextRow);

    // Share button
    var shareBtn = el("button", {
      cls: "btn btnp",
      css: {
        width: "100%", padding: "13px 0", fontSize: "0.93rem", fontWeight: "700",
        borderRadius: "14px", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
      },
      onclick: function() { shareScore(Subj, wasCorrect, appState.streak); }
    });
    shareBtn.appendChild(el("span", { txt: "Share result" }));
    shareBtn.appendChild(el("svg", { attr: {
      viewBox: "0 0 24 24", width: "15", height: "15",
      fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round"
    }}, [
      el("circle", { attr: { cx: "18", cy: "5",  r: "3" }}),
      el("circle", { attr: { cx: "6",  cy: "12", r: "3" }}),
      el("circle", { attr: { cx: "18", cy: "19", r: "3" }}),
      el("line", { attr: { x1: "8.59",  y1: "13.51", x2: "15.42", y2: "17.49" }}),
      el("line", { attr: { x1: "15.41", y1: "6.51",  x2: "8.59",  y2: "10.49" }})
    ]));
    resCard.appendChild(shareBtn);

    w.appendChild(resCard);
  }

  return w;
}