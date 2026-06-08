// ─── SHARE SCORE: PROFESSIONAL GRAPHIC GENERATOR ────────────────
function shareScore(subj, correct, streak) {
  // 1. Create a high-resolution canvas for a clean, premium visual share card
  var canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 450;
  var ctx = canvas.getContext("2d");

  // Background: Studio-grade dark slate gradient
  var grad = ctx.createLinearGradient(0, 0, 800, 450);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(1, "#1e293b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 450);

  // Structural Accent Border (Teal for success, Coral for missed)
  ctx.fillStyle = correct ? "#10b981" : "#f43f5e";
  ctx.fillRect(0, 0, 12, 450);

  // 2. Render Elegant Typography (No Text Emojis)
  ctx.textBaseline = "top";
  
  // Minimalist Over-title
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("STUDYLAB DAILY CHALLENGE RECORD", 50, 45);

  // Core Heading Status
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  var statusText = correct ? "Challenge Completed" : "Challenge Attempted";
  ctx.fillText(statusText, 50, 75);

  // Metadata Track: Subject Area
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SUBJECT ARENA", 50, 160);
  
  ctx.fillStyle = "#f8fafc";
  ctx.font = "600 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(subj, 50, 185);

  // Metadata Track: Streaks
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("CURRENT STREAK TRACK", 50, 250);
  
  ctx.fillStyle = "#3b82f6"; 
  ctx.font = "bold 46px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(streak + " Days", 50, 275);

  // Subtle App Domain Branding Footer
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("studylab-inky.vercel.app", 50, 380);

  // 3. Native Share/Download Engine
  var textDescription = "StudyLab Daily Challenge Update. Track: " + subj + " | Current Streak: " + streak + " days. Keep training at https://studylab-inky.vercel.app";

  canvas.toBlob(function(blob) {
    if (!blob) {
      if (typeof toast === "function") toast("Image compilation failed.", "#ef4444");
      return;
    }

    var file = new File([blob], "studylab-challenge.png", { type: "image/png" });

    // Use native device mobile sharing sheet if supported (iOS / Android / Safari)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        title: "StudyLab Daily Challenge",
        text: textDescription,
        files: [file]
      }).catch(function(err) {
        console.log("Sharing cancelled", err);
      });
    } else {
      // Fallback Engine for PC/Mac Browsers: Clipboard Copy + Automatic Graphic File Download
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

// ─── DAILY CHALLENGE UI WORKSPACE ───────────────────────────────
function pgDaily() {
  // Main layout wrapper
  var w = el("div", { css: { 
    maxWidth: "600px", 
    margin: "0 auto", 
    padding: "32px 16px 60px 16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  } });

  // 1. Premium Header containing an elegant Target SVG vector
  var hdr = el("div", { css: { 
    display: "flex", 
    alignItems: "center", 
    gap: "14px", 
    marginBottom: "36px", 
    paddingBottom: "20px", 
    borderBottom: "1px solid var(--border, #eaeaea)" 
  } });

  // Native Vector Target Graphic instead of standard emojis
  var targetSvg = el("svg", { 
    attr: { viewBox: "0 0 24 24", width: "26", height: "26", fill: "none", stroke: "currentColor", strokeWidth: "2.5" }, 
    css: { color: "var(--accent, #3b82f6)", flexShrink: "0" } 
  }, [
    el("circle", { attr: { cx: "12", cy: "12", r: "10" } }),
    el("circle", { attr: { cx: "12", cy: "12", r: "6" } }),
    el("circle", { attr: { cx: "12", cy: "12", r: "1.5", fill: "currentColor" } })
  ]);
  hdr.appendChild(targetSvg);

  hdr.appendChild(el("div", { css: { flex: "1" } }, [
    el("div", { css: { fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.02em", color: "var(--text, #111)" }, txt: "Daily Smart Review" }),
    el("div", { css: { fontSize: ".85rem", color: "var(--muted, #666)", marginTop: "2px", fontWeight: "400" }, txt: "Powered by Spaced Repetition" })
  ]));
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
      if (!q || !q.q || typeof q.q !== "string") return; // Defensive syntax safeguard
      var qId = q.q.slice(0, 35);
      if (knownData[qId]) {
        totalKnown++;
        if (knownData[qId] < now) {
          dueCards.push({ subject: subj, q: q, id: qId });
        }
      }
    });
  });

  // 3. UI Dashboard: Asymmetric Premium Cards Grid
  var dash = el("div", { css: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "16px", 
    marginBottom: "32px" 
  } });

  // Box A Layout: Cards Due Counter (Contextual Background State Shifts)
  var dynamicBg = dueCards.length > 0 ? "rgba(245,158,11,0.06)" : "rgba(34,197,94,0.06)";
  var dynamicBorder = dueCards.length > 0 ? "1px solid rgba(245,158,11,0.25)" : "1px solid rgba(34,197,94,0.25)";
  var dynamicColor = dueCards.length > 0 ? "#d97706" : "#16a34a";

  var dueBox = el("div", { css: { 
    background: dynamicBg, 
    border: dynamicBorder, 
    borderRadius: "20px", 
    padding: "28px 20px", 
    textAlign: "center"
  } });
  dueBox.appendChild(el("div", { css: { fontSize: "2.8rem", fontWeight: "800", color: dynamicColor, lineHeight: "1", letterSpacing: "-0.03em" }, txt: String(dueCards.length) }));
  dueBox.appendChild(el("div", { css: { fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text, #111)", fontWeight: "700", marginTop: "12px", opacity: "0.8" }, txt: "Cards Due" }));
  dash.appendChild(dueBox);

  // Box B Layout: In Learning Phase Metric Card
  var memBox = el("div", { css: { 
    background: "var(--card, #fff)", 
    border: "1px solid var(--border, #eaeaea)", 
    borderRadius: "20px", 
    padding: "28px 20px", 
    textAlign: "center", 
    boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
  } });
  memBox.appendChild(el("div", { css: { fontSize: "2.8rem", fontWeight: "800", color: "var(--accent, #3b82f6)", lineHeight: "1", letterSpacing: "-0.03em" }, txt: String(totalKnown) }));
  memBox.appendChild(el("div", { css: { fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted, #666)", fontWeight: "700", marginTop: "12px" }, txt: "In Learning Phase" }));
  dash.appendChild(memBox);
  w.appendChild(dash);

  // 4. Action Area View Handlers
  if (dueCards.length === 0) {
    // All Clear Panel
    var allClear = el("div", { css: { 
      textAlign: "center", 
      padding: "48px 24px", 
      background: "var(--card, #fff)", 
      borderRadius: "24px", 
      border: "1px solid var(--border, #eaeaea)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
    } });

    // Clean inline SVG Sparkle/Star instead of celebratory text emojis
    var clearSvg = el("svg", { 
      attr: { viewBox: "0 0 24 24", width: "36", height: "36", fill: "none", stroke: "currentColor", strokeWidth: "2" }, 
      css: { color: "#16a34a", marginBottom: "16px", display: "inline-block" } 
    }, [
      el("path", { attr: { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" } })
    ]);
    allClear.appendChild(clearSvg);

    allClear.appendChild(el("div", { css: { fontSize: "1.25rem", fontWeight: "700", color: "var(--text, #111)", marginBottom: "8px", letterSpacing: "-0.01em" }, txt: "You're all caught up!" }));
    allClear.appendChild(el("div", { css: { fontSize: ".9rem", color: "var(--muted, #666)", marginBottom: "28px", lineHeight: "1.5", maxWidth: "400px", margin: "0 auto 28px auto" }, txt: "You have reviewed all your due cards for today. Go start a new quiz to add more cards to your learning phase." }));
    
    var homeBtn = el("button", { 
      cls: "btn btnp", 
      css: { padding: "12px 28px", fontSize: "0.95rem", fontWeight: "600", borderRadius: "12px", display: "inline-flex", alignItems: "center" },
      onclick: function() { go("home"); } 
    }, "Explore Subjects");
    allClear.appendChild(homeBtn);
    w.appendChild(allClear);
  } else {
    // Session Active Control Panel
    var startBox = el("div", { css: { 
      textAlign: "center", 
      padding: "36px 24px", 
      background: "var(--card, #fff)", 
      borderRadius: "24px", 
      border: "1px solid var(--border, #eaeaea)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
    } });
    startBox.appendChild(el("div", { css: { fontSize: ".92rem", color: "var(--text, #333)", marginBottom: "24px", lineHeight: "1.6", maxWidth: "460px", margin: "0 auto 24px auto" }, txt: "You have flashcards waiting for review. The algorithm determines these are the cards you are most likely to forget today." }));
    
    // Primary Action Button with a stylized modern inline Chevron SVG
    var runBtn = el("button", { 
      cls: "btn btnp", 
      css: { 
        width: "100%", 
        padding: "16px", 
        fontSize: "1.05rem", 
        fontWeight: "700",
        borderRadius: "14px",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxShadow: "0 4px 14px rgba(59,130,246,0.15)"
      }, 
      onclick: function() {
        toast("Daily Review Engine launching soon!", "#3b82f6");
      } 
    }, [
      el("span", { txt: "Start Daily Review" }),
      el("svg", { 
        attr: { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5" }
      }, [
        el("line", { attr: { x1: "5", y1: "12", x2: "19", y2: "12" } }),
        el("polyline", { attr: { points: "12 5 19 12 12 19" } })
      ])
    ]);
    
    startBox.appendChild(runBtn);
    w.appendChild(startBox);
  }

  return w;
}
