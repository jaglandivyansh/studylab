// ═══════════════════════════════════════════════════════════════════
// PAGE-SHORTS.JS — Vertical "Reels" style flashcards (DYNAMIC)
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

  // Loop through all subjects in your app
  SUBJ.forEach(function(subj) {
    if(QD[subj]) {
      QD[subj].forEach(function(qObj) {
        
        // 1. Find the raw answer value (usually a number like 0, 1, 2)
        var rawAns = qObj.correct !== undefined ? qObj.correct : 
                     (qObj.a !== undefined ? qObj.a : 
                     (qObj.ans !== undefined ? qObj.ans : 
                     (qObj.answer !== undefined ? qObj.answer : qObj.c)));

        // 2. BRUTE FORCE ARRAY FINDER
        var optionsArray = null;
        if (Array.isArray(qObj.options)) optionsArray = qObj.options;
        else if (Array.isArray(qObj.opts)) optionsArray = qObj.opts;
        else if (Array.isArray(qObj.choices)) optionsArray = qObj.choices;
        else {
          // If the standard names fail, scan the object for ANY array with 2 or more items
          for (var key in qObj) {
            if (Array.isArray(qObj[key]) && qObj[key].length >= 2) {
              optionsArray = qObj[key];
              break;
            }
          }
        }

        // 3. Match the raw number to the exact text in the array
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

        // 4. Safely add to our shorts list ONLY if it found the real text
        var qText = qObj.q || qObj.question;
        var expText = qObj.explanation || qObj.exp || qObj.desc || "Keep scrolling to master more facts! 🔥";

        // If correctText is valid (not null, not "0"), we push it!
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

  // Fallback just in case your database is completely empty
  if (allQuestions.length === 0) {
    allQuestions = [
      { subj: "System", bg: "linear-gradient(135deg, #ef4444, #991b1b)", q: "Oops! We couldn't read your questions.js format.", a: "Check Database", extra: "Ensure your questions have an array of options and a valid answer index." }
    ];
  }

  var shuffled = shuf(allQuestions);
  return shuffled.slice(0, sessionLimit);
}

function pgShorts() {
  // Grab 100 random, fresh questions every time this page opens
  var currentShortsData = generateDynamicShorts(100);

  var w = el("div", { 
    id: "shorts-container",
    css: { 
      height: "calc(100vh - 65px)",
      width: "100%", 
      overflowY: "scroll", 
      scrollSnapType: "y mandatory",
      background: "#000", 
      position: "absolute",
      top: "0", left: "0", zIndex: "10"
    } 
  });

  // Top header overlay
  var header = el("div", {
    css: {
      position: "fixed", top: "15px", left: "20px", right: "20px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      zIndex: "20", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)"
    }
  });
  header.appendChild(el("div", {css: {fontSize: "1.2rem", fontWeight: "800", fontFamily: "var(--font-display)"}}, "Study Shorts ⚡"));
  header.appendChild(el("button", {
    css: { background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "20px", backdropFilter: "blur(4px)", fontSize: ".8rem", cursor: "pointer" },
    onclick: function(){ go("home"); }
  }, "✕ Close"));
  w.appendChild(header);

  currentShortsData.forEach(function(item, idx) {
    var slide = el("div", {
      css: {
        height: "100%", width: "100%",
        scrollSnapAlign: "start",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "20px", position: "relative"
      }
    });

    var cardWrap = el("div", {
      css: {
        width: "100%", maxWidth: "400px", height: "65%",
        perspective: "1000px", cursor: "pointer"
      }
    });

    var cardInner = el("div", {
      css: {
        width: "100%", height: "100%", position: "relative",
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        transformStyle: "preserve-3d"
      }
    });

    var isFlipped = false;
    cardWrap.onclick = function() {
      isFlipped = !isFlipped;
      cardInner.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
    };

    var faceCss = {
      position: "absolute", width: "100%", height: "100%",
      backfaceVisibility: "hidden", borderRadius: "24px",
      padding: "32px", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      color: "#fff"
    };

    // Front of card
    var front = el("div", { css: Object.assign({}, faceCss, { background: item.bg }) });
    front.appendChild(el("div", {css: {background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", marginBottom: "auto"}}, item.subj));
    var qFontSize = item.q.length > 100 ? "1.1rem" : "1.4rem";
    front.appendChild(el("div", {css: {fontSize: qFontSize, fontWeight: "700", lineHeight: "1.5", marginTop: "auto", marginBottom: "auto", fontFamily: "var(--font-display)"}}, item.q));
    front.appendChild(el("div", {css: {fontSize: ".8rem", opacity: "0.8", marginTop: "auto"}}, "👆 Tap to reveal"));

    // Back of card
    var back = el("div", { css: Object.assign({}, faceCss, { background: "var(--card)", border: "2px solid var(--border)", color: "var(--text)", transform: "rotateY(180deg)", padding: "24px" }) });
    back.appendChild(el("div", {css: {fontSize: "1.6rem", fontWeight: "800", color: "var(--accent)", marginBottom: "16px", fontFamily: "var(--font-display)", lineHeight: "1.3"}}, item.a));
    var extraWrap = el("div", {css: {maxHeight: "50%", overflowY: "auto", paddingRight: "4px"}});
    extraWrap.appendChild(el("div", {css: {fontSize: ".9rem", color: "var(--muted)", lineHeight: "1.6"}}, item.extra));
    back.appendChild(extraWrap);

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    cardWrap.appendChild(cardInner);
    slide.appendChild(cardWrap);

    // Swipe up indicator
    if (idx === 0) {
      slide.appendChild(el("div", {
        css: {
          position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)",
          color: "#fff", fontSize: ".8rem", display: "flex", flexDirection: "column", alignItems: "center",
          opacity: "0.7", animation: "bounce-up 2s infinite"
        },
        htm: "<span>Swipe up for next</span><span style='font-size:1.5rem'>⌃</span>"
      }));
    }

    w.appendChild(slide);
  });

  // End slide
  var endSlide = el("div", {
    css: {
      height: "100%", width: "100%", scrollSnapAlign: "start", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", color: "#fff"
    }
  });
  endSlide.appendChild(el("div", {css: {fontSize: "3rem", marginBottom: "10px"}}, "🎉"));
  endSlide.appendChild(el("div", {css: {fontSize: "1.4rem", fontWeight: "800", marginBottom: "10px"}}, "Session Complete!"));
  endSlide.appendChild(el("div", {css: {fontSize: ".9rem", opacity: "0.7", marginBottom: "20px"}}, "You just reviewed 100 questions."));
  endSlide.appendChild(el("button", {
    css: { padding: "12px 24px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" },
    onclick: function(){ go("shorts"); } 
  }, "Shuffle New Batch 🔄"));
  w.appendChild(endSlide);

  if (!document.getElementById("shorts-styles")) {
    var style = document.createElement("style");
    style.id = "shorts-styles";
    style.innerHTML = "@keyframes bounce-up { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -10px); } }";
    document.head.appendChild(style);
  }

  return w;
}