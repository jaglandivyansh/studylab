// ═══════════════════════════════════════════════════════════════════
// PAGE-SHORTS.JS — STUDYLAB SHORTS PRO ENGINE (FIXED & PLUGGED)
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

  // Safe checks for global StudyLab arrays
  if (typeof SUBJ === 'undefined' || typeof QD === 'undefined') {
    return [{ subj: "Economy", bg: "linear-gradient(160deg, #db2777, #831843)", q: "Disguised unemployment refers to...", a: "Persons with no job.", extra: "Keep scrolling! 🔥" }];
  }

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
    allQuestions = [{ subj: "Economy", bg: "linear-gradient(160deg, #db2777, #831843)", q: "Disguised unemployment refers to...", a: "Persons with no job.", extra: "Keep scrolling to master more facts! 🔥" }];
  }
  return typeof shuf === 'function' ? shuf(allQuestions).slice(0, sessionLimit) : allQuestions.slice(0, sessionLimit);
}

// ── STUDYLAB SHORTS ENGINE ENGINE ─────────────────────────────────
class StudyLabShortsEngine {
  constructor(targetElement, questionsList) {
    this.container = targetElement;
    this.allQuestions = questionsList;
    this.currentIndex = 0;
    
    this.dom = { wrapper: null, progressBar: null, counter: null, track: null };
    this.init();
  }

  init() {
    this.injectStyles();
    this.buildSkeleton();
    this.renderSlide();
  }

  injectStyles() {
    if (document.getElementById('sl-pro-styles')) return;
    var style = document.createElement('style');
    style.id = 'sl-pro-styles';
    style.textContent = `
      .sl-main-center-box {
        display: flex; justify-content: center; align-items: center; width: 100%; padding: 15px; box-sizing: border-box;
      }
      .sl-shorts-wrapper {
        position: relative; width: 100%; max-width: 410px; height: 68dvh; min-height: 500px;
        background: #0d0e12; border-radius: 26px; box-shadow: 0 20px 45px rgba(0,0,0,0.4); overflow: hidden;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .sl-progress-container {
        position: absolute; top: 15px; left: 20px; right: 20px; display: flex; gap: 4px; z-index: 10;
      }
      .sl-progress-bar { height: 3px; flex: 1; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden; }
      .sl-progress-fill { height: 100%; width: 0%; background: #fff; transition: width 0.3s ease; }
      .sl-progress-fill.active { width: 100%; }
      
      .sl-counter {
        position: absolute; top: 25px; right: 20px; color: rgba(255,255,255,0.6); font-size: 0.72rem; font-weight: 700; z-index: 10;
        background: rgba(0,0,0,0.3); padding: 3px 9px; border-radius: 20px; backdrop-filter: blur(5px);
      }
      .sl-track { width: 100%; height: 100%; display: flex; flex-direction: column; }
      .sl-card {
        min-height: 100%; width: 100%; position: relative; display: flex; flex-direction: column;
        justify-content: center; align-items: center; padding: 40px 24px; box-sizing: border-box; color: #fff; text-align: center;
      }
      .sl-subj-tag {
        background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
        padding: 5px 14px; border-radius: 30px; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 25px;
      }
      .sl-question { font-size: 1.4rem; font-weight: 800; line-height: 1.45; margin-bottom: 35px; text-shadow: 0 4px 12px rgba(0,0,0,0.3); word-break: break-word; }
      
      .sl-bottom-sheet {
        position: absolute; bottom: 0; left: 0; right: 0; background: #141622; border-radius: 28px 28px 0 0;
        padding: 25px; transform: translateY(105%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); z-index: 5; text-align: left;
        box-shadow: 0 -10px 40px rgba(0,0,0,0.5); box-sizing: border-box;
      }
      .sl-bottom-sheet.open { transform: translateY(0); }
      .sl-ans-title { font-size: 0.65rem; text-transform: uppercase; color: #10b981; font-weight: 800; margin-bottom: 6px; }
      .sl-ans-text { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 10px; word-break: break-word; }
      .sl-exp-text { color: #9ca3af; font-size: 0.85rem; line-height: 1.5; }
      
      .sl-controls { position: absolute; bottom: 25px; display: flex; gap: 12px; z-index: 4; }
      .sl-btn {
        background: rgba(255,255,255,0.18); border: none; color: #fff; padding: 10px 20px; border-radius: 50px;
        font-weight: 600; font-size: 0.82rem; cursor: pointer; backdrop-filter: blur(10px); transition: background 0.2s;
      }
      .sl-btn.btn-next { background: var(--accent, #3b82f6); }
    `;
    document.head.appendChild(style);
  }

  buildSkeleton() {
    this.dom.wrapper = document.createElement('div');
    this.dom.wrapper.className = 'sl-shorts-wrapper';

    this.dom.progressBar = document.createElement('div');
    this.dom.progressBar.className = 'sl-progress-container';
    
    this.dom.counter = document.createElement('div');
    this.dom.counter.className = 'sl-counter';

    this.dom.track = document.createElement('div');
    this.dom.track.className = 'sl-track';

    this.dom.wrapper.appendChild(this.dom.progressBar);
    this.dom.wrapper.appendChild(this.dom.counter);
    this.dom.wrapper.appendChild(this.dom.track);
    
    this.container.appendChild(this.dom.wrapper);
    this.attachEvents();
  }

  renderSlide() {
    this.dom.track.innerHTML = '';
    this.dom.progressBar.innerHTML = '';

    // Generate progress dots/bars
    this.allQuestions.forEach((_, idx) => {
      var bar = document.createElement('div');
      bar.className = 'sl-progress-bar';
      var fill = document.createElement('div');
      fill.className = `sl-progress-fill ${idx <= this.currentIndex ? 'active' : ''}`;
      bar.appendChild(fill);
      this.dom.progressBar.appendChild(bar);
    });

    this.dom.counter.textContent = `${this.currentIndex + 1} / ${this.allQuestions.length}`;

    var item = this.allQuestions[this.currentIndex];
    var card = document.createElement('div');
    card.className = 'sl-card';
    card.style.background = item.bg;

    card.innerHTML = `
      <div class="sl-subj-tag">${item.subj}</div>
      <div class="sl-question">${item.q}</div>
      <div class="sl-controls">
        <button class="sl-btn btn-show-ans">💡 View Answer</button>
        <button class="sl-btn btn-next">Next ➔</button>
      </div>
      <div class="sl-bottom-sheet">
        <div class="sl-ans-title">✓ Correct Answer</div>
        <div class="sl-ans-text">${item.a}</div>
        <div class="sl-exp-text">${item.extra}</div>
      </div>
    `;
    this.dom.track.appendChild(card);
  }

  attachEvents() {
    this.dom.wrapper.addEventListener('click', (e) => {
      var sheet = this.dom.wrapper.querySelector('.sl-bottom-sheet');
      if (e.target.classList.contains('btn-show-ans')) {
        sheet.classList.toggle('open');
      } else if (e.target.classList.contains('btn-next') || e.target.closest('.sl-bottom-sheet.open')) {
        this.next();
      }
    });
  }

  next() {
    if (this.currentIndex < this.allQuestions.length - 1) {
      this.currentIndex++;
      this.renderSlide();
    } else {
      this.currentIndex = 0; // Loop back to start
      this.renderSlide();
    }
  }
}

// ── 6. OLD SYSTEM COUPLING (MAIN INTERFACE FUNCTION) ────────────────
function pgShorts() {
  // 1. Fetch filtered quiz data
  var dataset = generateDynamicShorts(100);

  // 2. Create the outer layout alignment box requested by user
  var centerLayoutBox = document.createElement("div");
  centerLayoutBox.className = "sl-main-center-box";

  // 3. Mount the modern modular Engine on this layout box
  new StudyLabShortsEngine(centerLayoutBox, dataset);

  // 4. Return layout to your router (go("shorts") will append this returned element)
  return centerLayoutBox;
}

// Helper short-hand element creator function if missing in app core
if (typeof el !== 'function') {
  window.el = function(type, attrs, txt) {
    var e = document.createElement(type);
    if (attrs) {
      if (attrs.id) e.id = attrs.id;
      if (attrs.cls) e.className = attrs.cls;
      if (attrs.css) Object.assign(e.style, attrs.css);
      if (attrs.txt) e.textContent = attrs.txt;
    }
    if (txt) e.textContent = txt;
    return e;
  };
}
