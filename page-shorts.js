// ═══════════════════════════════════════════════════════════════════
// PAGE-SHORTS.JS — Vertical "Reels" style flashcards (FIXED)
// ═══════════════════════════════════════════════════════════════════

function generateDynamicShorts(sessionLimit) {
  var allQuestions = [];

  var bgGradients = {
    "History": "linear-gradient(135deg, #7c3aed, #4c1d95)",
    "Geography": "linear-gradient(135deg, #059669, #064e3b)",
    "Polity": "linear-gradient(135deg, #ea580c, #9a3412)",
    "Economy": "linear-gradient(135deg, #db2777, #831843)",
    "Science": "linear-gradient(135deg, #0891b2, #164e63)",
    "GK": "linear-gradient(135deg, #d97706, #78350f)",
    "Current Affairs": "linear-gradient(135deg, #2563eb, #1e3a8a)",
    "Previous Year Questions": "linear-gradient(135deg, #4f46e5, #312e81)"
  };

  SUBJ.forEach(function(subj) {
    if(QD[subj]) {
      QD[subj].forEach(function(qObj) {
        var rawAns = qObj.correct !== undefined ? qObj.correct : 
                     (qObj.a !== undefined ? qObj.a : 
                     (qObj.ans !== undefined ? qObj.ans : 
                     (qObj.answer !== undefined ? qObj.answer : qObj.c)));

        var optionsArray = null;
        if (Array.isArray(qObj.options)) optionsArray = qObj.options;
        else if (Array.isArray(qObj.opts)) optionsArray = qObj.opts;
        else if (Array.isArray(qObj.choices)) optionsArray = qObj.choices;
        else {
          for (var key in qObj) {
            if (Array.isArray(qObj[key]) && qObj[key].length >= 2) {
              optionsArray = qObj[key];
              break;
            }
          }
        }

        var correctText = null;
        if (optionsArray && rawAns !== undefined && rawAns !== null) {
          if (typeof rawAns === 'number' && optionsArray[rawAns] !== undefined) {
            correctText = optionsArray[rawAns];
          } else if (typeof rawAns === 'string' && !isNaN(parseInt(rawAns)) && optionsArray[parseInt(rawAns)] !== undefined) {
            correctText = optionsArray[parseInt(rawAns)];
          } else if (typeof rawAns === 'string' && /^[A-E]$/i.test(rawAns)) {
            var idx = rawAns.toUpperCase().charCodeAt(0) - 65;
            if (optionsArray[idx] !== undefined) correctText = optionsArray[idx];
          }
        }

        var qText = qObj.q || qObj.question;
        var expText = qObj.explanation || qObj.exp || qObj.desc || "Keep scrolling to master more facts! 🔥";

        if (correctText && qText && String(correctText) !== String(rawAns)) {
          allQuestions.push({
            subj: subj,
            bg: bgGradients[subj] || "linear-gradient(135deg, #4b5563, #1f2937)",
            q: qText,
            a: correctText,
            extra: expText
          });
        }
      });
    }
  });

  if (allQuestions.length === 0) {
    allQuestions = [
      { subj: "System", bg: "linear-gradient(135deg, #ef4444, #991b1b)", q: "Oops! We couldn't read your questions.js format.", a: "Check Database", extra: "Ensure your questions have an array of options and a valid answer index." }
    ];
  }

  return shuf(allQuestions).slice(0, sessionLimit);
}

function pgShorts() {
  var currentShortsData = generateDynamicShorts(100);

  // ── Inject styles ──────────────────────────────────────────────
  if (!document.getElementById("shorts-styles")) {
    var style = document.createElement("style");
    style.id = "shorts-styles";
    style.innerHTML = `
      @keyframes bounce-up {
        0%, 100% { transform: translate(-50%, 0); }
        50%       { transform: translate(-50%, -10px); }
      }

      /* ── Full-screen overlay that sits ABOVE both navbars ── */
      #shorts-container {
        position: fixed !important;
        inset: 0 !important;           /* top:0 left:0 right:0 bottom:0 */
        z-index: 99999 !important;     /* Above top-navbar (9999) and bottom-navbar (1000) */
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        background: #000;
        -webkit-overflow-scrolling: touch;
      }

      /* Each slide = full viewport */
      .shorts-slide {
        height: 100vh;
        width: 100%;
        scroll-snap-align: start;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        position: relative;
        box-sizing: border-box;
      }

      /* ── Close button — always top-right, above everything ── */
      #shorts-close-btn {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 100001;              /* Above shorts container */
        background: rgba(20,20,20,0.85);
        border: 1px solid rgba(255,255,255,0.15);
        color: #fff;
        padding: 8px 16px;
        border-radius: 20px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        font-size: .82rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      }
      #shorts-close-btn:active {
        transform: scale(0.96);
      }

      /* ── Session title — top-left ── */
      #shorts-title {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 100001;
        font-size: 1.1rem;
        font-weight: 800;
        font-family: var(--font-display);
        color: #fff;
        text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        pointer-events: none;
      }

      /* ── Card wrap ── */
      .shorts-card-wrap {
        width: 100%;
        max-width: 420px;
        height: clamp(340px, 70vh, 540px);
        perspective: 1000px;
        cursor: pointer;
      }

      /* ── Flip inner ── */
      .shorts-card-inner {
        width: 100%; height: 100%;
        position: relative;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
      }

      /* ── Card face shared ── */
      .shorts-face {
        position: absolute;
        width: 100%; height: 100%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        border-radius: 24px;
        padding: 28px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        color: #fff;
        overflow: hidden;
        box-sizing: border-box;
      }

      .shorts-face-back {
        transform: rotateY(180deg);
        background: var(--card, #111827) !important;
        border: 2px solid var(--border, rgba(255,255,255,0.08));
        color: var(--text, #f1f5f9) !important;
      }

      .shorts-subj-tag {
        background: rgba(255,255,255,0.18);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: .7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 700;
        margin-bottom: auto;
        color: #fff;
        flex-shrink: 0;
      }

      .shorts-q-text {
        font-weight: 700;
        line-height: 1.6;
        margin-top: auto;
        margin-bottom: auto;
        font-family: var(--font-display);
        overflow-y: auto;
        max-height: 65%;
        word-break: break-word;
        padding: 4px 2px;
      }

      .shorts-tap-hint {
        font-size: .8rem;
        opacity: 0.8;
        margin-top: auto;
        flex-shrink: 0;
      }

      .shorts-ans-text {
        font-weight: 800;
        color: var(--accent, #3b82f6);
        margin-bottom: 12px;
        font-family: var(--font-display);
        line-height: 1.4;
        word-break: break-word;
        overflow-y: auto;
        max-height: 40%;
      }

      .shorts-exp-wrap {
        max-height: 45%;
        overflow-y: auto;
        padding-right: 4px;
      }

      .shorts-exp-text {
        font-size: .9rem;
        color: var(--muted, #8b9cb8);
        line-height: 1.6;
      }

      /* ── Swipe hint ── */
      .shorts-swipe-hint {
        position: absolute;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255,255,255,0.5);
        font-size: .78rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: bounce-up 2s infinite;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  // ── Main container (fixed fullscreen) ─────────────────────────
  var w = el("div", { id: "shorts-container" });

  // ── Fixed UI elements (outside scroll) ────────────────────────
  var titleEl = el("div", { id: "shorts-title" }, "Study Shorts ⚡");
  document.body.appendChild(titleEl);

  var closeBtn = el("button", { id: "shorts-close-btn" }, ["✕ Close"]);
  closeBtn.onclick = function() {
    // Clean up fixed elements
    var t = document.getElementById("shorts-title");
    var c = document.getElementById("shorts-close-btn");
    if(t) t.remove();
    if(c) c.remove();
    go("home");
  };
  document.body.appendChild(closeBtn);

  // ── Slides ────────────────────────────────────────────────────
  currentShortsData.forEach(function(item, idx) {
    var slide = el("div", { cls: "shorts-slide" });

    var cardWrap = el("div", { cls: "shorts-card-wrap" });
    var cardInner = el("div", { cls: "shorts-card-inner" });

    var isFlipped = false;
    cardWrap.onclick = function() {
      isFlipped = !isFlipped;
      cardInner.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
    };

    // Front
    var front = el("div", { cls: "shorts-face", css: { background: item.bg } });
    front.appendChild(el("div", { cls: "shorts-subj-tag" }, item.subj));
    var qSize = item.q.length > 180 ? "0.85rem" : item.q.length > 100 ? "1rem" : "1.25rem";
    front.appendChild(el("div", { cls: "shorts-q-text", css: { fontSize: qSize } }, item.q));
    front.appendChild(el("div", { cls: "shorts-tap-hint" }, "👆 Tap to reveal"));

    // Back
    var back = el("div", { cls: "shorts-face shorts-face-back" });
    var aSize = item.a.length > 80 ? "1.1rem" : "1.5rem";
    back.appendChild(el("div", { cls: "shorts-ans-text", css: { fontSize: aSize } }, item.a));
    var expWrap = el("div", { cls: "shorts-exp-wrap" });
    expWrap.appendChild(el("div", { cls: "shorts-exp-text" }, item.extra));
    back.appendChild(expWrap);

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    cardWrap.appendChild(cardInner);
    slide.appendChild(cardWrap);

    // Swipe hint on first slide
    if (idx === 0) {
      slide.appendChild(el("div", {
        cls: "shorts-swipe-hint",
        htm: "<span>Swipe up for next</span><span style='font-size:1.4rem;margin-top:2px'>⌃</span>"
      }));
    }

    w.appendChild(slide);
  });

  // ── End slide ─────────────────────────────────────────────────
  var endSlide = el("div", {
    cls: "shorts-slide",
    css: { textAlign: "center", color: "var(--text, #f1f5f9)" }
  });
  endSlide.appendChild(el("div", { css: { fontSize: "3rem", marginBottom: "12px" } }, "🎉"));
  endSlide.appendChild(el("div", { css: { fontSize: "1.4rem", fontWeight: "800", marginBottom: "8px" } }, "Session Complete!"));
  endSlide.appendChild(el("div", { css: { fontSize: ".9rem", opacity: "0.7", marginBottom: "24px" } }, "You just reviewed 100 questions."));
  endSlide.appendChild(el("button", {
    css: {
      padding: "12px 28px", background: "var(--accent, #3b82f6)",
      color: "#fff", border: "none", borderRadius: "12px",
      fontWeight: "700", fontSize: "1rem", cursor: "pointer"
    },
    onclick: function() {
      var t = document.getElementById("shorts-title");
      var c = document.getElementById("shorts-close-btn");
      if(t) t.remove();
      if(c) c.remove();
      go("shorts");
    }
  }, "Shuffle New Batch 🔄"));
  w.appendChild(endSlide);

  return w;
}
