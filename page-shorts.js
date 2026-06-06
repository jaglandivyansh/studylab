// ═══════════════════════════════════════════════════════════════════
// PAGE-SHORTS.JS — Immersive Fullscreen Reels (YouTube Shorts style)
// ═══════════════════════════════════════════════════════════════════

function generateDynamicShorts(sessionLimit) {
  var allQuestions = [];
  var bgGradients = {
    "History": "linear-gradient(160deg, #7c3aed 0%, #4c1d95 100%)",
    "Geography": "linear-gradient(160deg, #059669 0%, #064e3b 100%)",
    "Polity": "linear-gradient(160deg, #ea580c 0%, #9a3412 100%)",
    "Economy": "linear-gradient(160deg, #db2777 0%, #831843 100%)",
    "Science": "linear-gradient(160deg, #0891b2 0%, #164e63 100%)",
    "GK": "linear-gradient(160deg, #d97706 0%, #78350f 100%)",
    "Current Affairs": "linear-gradient(160deg, #2563eb 0%, #1e3a8a 100%)",
    "Previous Year Questions": "linear-gradient(160deg, #4f46e5 0%, #312e81 100%)"
  };

  SUBJ.forEach(function(subj) {
    if(!QD[subj]) return;
    QD[subj].forEach(function(qObj) {
      var rawAns = qObj.correct !== undefined ? qObj.correct :
                   (qObj.a !== undefined ? qObj.a :
                   (qObj.ans !== undefined ? qObj.ans :
                   (qObj.answer !== undefined ? qObj.answer : qObj.c)));
      var optionsArray = null;
      if (Array.isArray(qObj.options)) optionsArray = qObj.options;
      else if (Array.isArray(qObj.opts)) optionsArray = qObj.opts;
      else if (Array.isArray(qObj.choices)) optionsArray = qObj.choices;
      else { for (var key in qObj) { if (Array.isArray(qObj[key]) && qObj[key].length >= 2) { optionsArray = qObj[key]; break; } } }

      var correctText = null;
      if (optionsArray && rawAns !== undefined && rawAns !== null) {
        if (typeof rawAns === 'number' && optionsArray[rawAns] !== undefined) correctText = optionsArray[rawAns];
        else if (typeof rawAns === 'string' && !isNaN(parseInt(rawAns)) && optionsArray[parseInt(rawAns)] !== undefined) correctText = optionsArray[parseInt(rawAns)];
        else if (typeof rawAns === 'string' && /^[A-E]$/i.test(rawAns)) { var cidx = rawAns.toUpperCase().charCodeAt(0)-65; if(optionsArray[cidx]!==undefined) correctText=optionsArray[cidx]; }
      }
      var qText = qObj.q || qObj.question;
      var expText = qObj.explanation || qObj.exp || qObj.desc || "Keep scrolling to master more facts! 🔥";
      if (correctText && qText && String(correctText) !== String(rawAns)) {
        allQuestions.push({ subj: subj, bg: bgGradients[subj] || "linear-gradient(160deg,#4b5563,#1f2937)", q: qText, a: correctText, extra: expText });
      }
    });
  });

  if (!allQuestions.length) {
    allQuestions = [{ subj: "System", bg: "linear-gradient(160deg,#ef4444,#991b1b)", q: "Couldn't read questions format.", a: "Check Database", extra: "Ensure your questions have an array of options and a valid answer index." }];
  }
  return shuf(allQuestions).slice(0, sessionLimit);
}

function pgShorts() {
  var data = generateDynamicShorts(100);

  // ── Styles ────────────────────────────────────────────────────
  var styleId = "shorts-styles";
  var old = document.getElementById(styleId);
  if (old) old.remove();
  var st = document.createElement("style");
  st.id = styleId;
  st.textContent = `
    /* Lock body scroll while shorts open */
    body.shorts-open { overflow: hidden !important; }

    /* Full viewport takeover */
    #shorts-root {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #000;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    /* Each slide = 100dvh (dynamic viewport, accounts for browser chrome) */
    .sr-slide {
      height: 100dvh;
      width: 100%;
      scroll-snap-align: start;
      scroll-snap-stop: always;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    /* Gradient background fills entire slide */
    .sr-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    /* Subtle noise texture overlay for depth */
    .sr-bg::after {
      content: '';
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: 0.35;
      pointer-events: none;
    }

    /* Content layer */
    .sr-content {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 72px 28px 80px;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    /* Subject pill — top */
    .sr-subj {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 99px;
      white-space: nowrap;
    }

    /* Question text */
    .sr-question {
      color: #fff;
      font-family: var(--font-display, sans-serif);
      font-weight: 800;
      line-height: 1.5;
      text-align: center;
      text-shadow: 0 2px 16px rgba(0,0,0,0.3);
      word-break: break-word;
      max-height: 55vh;
      overflow-y: auto;
    }

    /* Tap hint */
    .sr-hint {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.65);
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      animation: sr-bounce 2s ease-in-out infinite;
      white-space: nowrap;
    }
    @keyframes sr-bounce {
      0%,100% { transform: translateX(-50%) translateY(0); }
      50%      { transform: translateX(-50%) translateY(-6px); }
    }

    /* Answer overlay — slides up on tap */
    .sr-answer-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .sr-answer-overlay.visible {
      opacity: 1;
      pointer-events: all;
    }
    .sr-answer-sheet {
      background: rgba(10,12,20,0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px 24px 0 0;
      padding: 28px 28px 40px;
      max-height: 55vh;
      overflow-y: auto;
    }
    .sr-ans-label {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      margin-bottom: 10px;
    }
    .sr-ans-text {
      font-family: var(--font-display, sans-serif);
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      line-height: 1.3;
      word-break: break-word;
    }
    .sr-exp-text {
      font-size: 0.88rem;
      color: rgba(255,255,255,0.65);
      line-height: 1.7;
    }
    .sr-close-ans {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 18px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.7);
      font-size: 0.78rem;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 99px;
      cursor: pointer;
    }

    /* Back button — top left */
    #shorts-back {
      position: fixed;
      top: 14px;
      left: 14px;
      z-index: 100000;
      width: 40px; height: 40px;
      border-radius: 50%;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(0,0,0,0.4);
    }

    /* Counter — top right */
    #shorts-counter {
      position: fixed;
      top: 20px;
      right: 16px;
      z-index: 100000;
      font-size: 0.72rem;
      font-weight: 700;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.05em;
      pointer-events: none;
    }

    /* End slide */
    .sr-end {
      color: #fff;
      text-align: center;
      padding: 40px 28px;
    }
  `;
  document.head.appendChild(st);

  // Lock body scroll
  document.body.classList.add("shorts-open");

  // ── Root container ────────────────────────────────────────────
  var root = el("div", { id: "shorts-root" });

  // ── Fixed back button ─────────────────────────────────────────
  var backBtn = el("div", { id: "shorts-back", txt: "←" });
  backBtn.onclick = function() {
    document.body.classList.remove("shorts-open");
    backBtn.remove();
    counterEl.remove();
    go("home");
  };
  document.body.appendChild(backBtn);

  // ── Fixed counter ─────────────────────────────────────────────
  var counterEl = el("div", { id: "shorts-counter", txt: "1 / " + data.length });
  document.body.appendChild(counterEl);

  // Update counter on scroll
  root.addEventListener("scroll", function() {
    var idx = Math.round(root.scrollTop / window.innerHeight);
    counterEl.textContent = (idx + 1) + " / " + data.length;
  });

  // ── Slides ────────────────────────────────────────────────────
  data.forEach(function(item) {
    var slide = el("div", { cls: "sr-slide" });

    // Background
    var bg = el("div", { cls: "sr-bg", css: { background: item.bg } });
    slide.appendChild(bg);

    // Content (question side)
    var content = el("div", { cls: "sr-content" });

    var subjTag = el("div", { cls: "sr-subj", txt: item.subj });
    content.appendChild(subjTag);

    var qSize = item.q.length > 160 ? "1.1rem" : item.q.length > 80 ? "1.35rem" : "1.6rem";
    var qEl = el("div", { cls: "sr-question", css: { fontSize: qSize }, txt: item.q });
    content.appendChild(qEl);

    var hint = el("div", { cls: "sr-hint" });
    hint.innerHTML = "<span>👆 Tap to reveal</span><span style='font-size:1.1rem'>↑</span>";
    content.appendChild(hint);

    slide.appendChild(content);

    // Answer overlay (bottom sheet style)
    var overlay = el("div", { cls: "sr-answer-overlay" });
    var sheet = el("div", { cls: "sr-answer-sheet" });

    sheet.appendChild(el("div", { cls: "sr-ans-label", txt: "✅ Correct Answer" }));
    var aSize = item.a.length > 80 ? "1.15rem" : "1.5rem";
    sheet.appendChild(el("div", { cls: "sr-ans-text", css: { fontSize: aSize }, txt: item.a }));
    sheet.appendChild(el("div", { cls: "sr-exp-text", txt: item.extra }));

    var closeAns = el("button", { cls: "sr-close-ans", txt: "↩ Hide answer" });
    closeAns.onclick = function(e) {
      e.stopPropagation();
      overlay.classList.remove("visible");
      hint.style.opacity = "1";
    };
    sheet.appendChild(closeAns);
    overlay.appendChild(sheet);
    slide.appendChild(overlay);

    // Tap to show answer
    content.onclick = function() {
      overlay.classList.add("visible");
      hint.style.opacity = "0";
    };

    root.appendChild(slide);
  });

  // ── End slide ─────────────────────────────────────────────────
  var endSlide = el("div", { cls: "sr-slide" });
  var endBg = el("div", { cls: "sr-bg", css: { background: "linear-gradient(160deg,#0f172a,#1e293b)" } });
  endSlide.appendChild(endBg);
  var endContent = el("div", { cls: "sr-end", css: { position:"relative", zIndex:"1", width:"100%" } });
  endContent.appendChild(el("div", { css: { fontSize: "3.5rem", marginBottom: "16px" }, txt: "🎉" }));
  endContent.appendChild(el("div", { css: { fontSize: "1.5rem", fontWeight: "800", marginBottom: "8px" }, txt: "Session Complete!" }));
  endContent.appendChild(el("div", { css: { fontSize: ".9rem", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }, txt: "You reviewed " + data.length + " questions" }));
  var shuffleBtn = el("button", {
    css: { padding: "14px 32px", background: "var(--accent,#3b82f6)", color: "#fff", border: "none", borderRadius: "14px", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }
  }, "Shuffle New Batch 🔄");
  shuffleBtn.onclick = function() {
    document.body.classList.remove("shorts-open");
    backBtn.remove();
    counterEl.remove();
    go("shorts");
  };
  endContent.appendChild(shuffleBtn);
  endSlide.appendChild(endContent);
  root.appendChild(endSlide);

  return root;
}
