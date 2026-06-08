// ═══════════════════════════════════════════════════════════════════
// PAGE-SHORTS.JS — STUDYLAB SHORTS PRO ULTRA V3 (NO REPEAT + FIXED BOX)
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

  if (typeof SUBJ === 'undefined' || typeof QD === 'undefined') {
    return [{ id: "fallback-1", subj: "Economy", bg: "linear-gradient(160deg, #db2777, #831843)", q: "Disguised unemployment refers to...", a: "Persons with no job.", extra: "Keep scrolling to master more facts! 🔥" }];
  }

  SUBJ.forEach(function(subj) {
    if(!QD[subj]) return;
    QD[subj].forEach(function(qObj, index) {
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
        var uniqueId = subj + "-" + index;
        allQuestions.push({ id: uniqueId, subj: subj, bg: bgGradients[subj] || "linear-gradient(160deg,#4b5563,#1f2937)", q: qText, a: correctText, extra: expText });
      }
    });
  });

  if (!allQuestions.length) {
    allQuestions = [{ id: "fallback-default", subj: "Economy", bg: "linear-gradient(160deg, #db2777, #831843)", q: "Disguised unemployment refers to...", a: "Persons with no job.", extra: "Keep scrolling to master more facts! 🔥" }];
  }
  
  // Custom absolute modern shuffler logic
  if (typeof shuf === 'function') {
    return shuf(allQuestions);
  } else {
    return allQuestions.sort(function() { return 0.5 - Math.random(); });
  }
}

class StudyLabShortsEngine {
  constructor(targetElement, questionsList) {
    this.container = targetElement;
    this.allQuestions = questionsList; // Pool of non-repeating sequence chain
    this.currentIndex = 0;
    
    this.dom = { wrapper: null, progressBar: null, counter: null, track: null, streakBadge: null, viewBookmarksBtn: null, bookmarkPage: null, controls: null };
    this.init();
  }

  init() {
    this.updateStreak();
    this.injectStyles();
    this.buildSkeleton();
    this.renderSlide();
    this.updateBookmarkButtonCount();
  }

  updateStreak() {
    var today = new Date().toDateString();
    var lastActiveDate = localStorage.getItem('sl_last_active');
    var currentStreak = parseInt(localStorage.getItem('sl_streak_count') || '0');

    if (!lastActiveDate) {
      currentStreak = 1;
    } else {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActiveDate === today) {
        // maintained today
      } else if (lastActiveDate === yesterday.toDateString()) {
        currentStreak += 1;
      } else {
        currentStreak = 1; 
      }
    }
    localStorage.setItem('sl_last_active', today);
    localStorage.setItem('sl_streak_count', currentStreak);
    this.streakCount = currentStreak;
  }

  injectStyles() {
    if (document.getElementById('sl-pro-ultra-styles')) return;
    var style = document.createElement('style');
    style.id = 'sl-pro-ultra-styles';
    style.textContent = `
      /* [FIXED] Hardware Acceleration Layer prevents viewport jumps entirely */
      .sl-main-center-box {
        display: flex; flex-direction: column; justify-content: center; align-items: center; 
        width: 100%; padding: 15px; box-sizing: border-box;
        overscroll-behavior: none !important;
        -webkit-overflow-scrolling: auto !important;
      }
      .sl-shorts-wrapper {
        position: relative; width: 100%; max-width: 410px; height: 68dvh; min-height: 500px;
        background: #0d0e12; border-radius: 26px; box-shadow: 0 20px 45px rgba(0,0,0,0.5); overflow: hidden;
        font-family: system-ui, -apple-system, sans-serif;
        overscroll-behavior: contain !important;
        transform: translate3d(0, 0, 0); /* Locks box coordinates in system memory */
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      .sl-progress-container {
        position: absolute; top: 15px; left: 20px; right: 20px; display: flex; gap: 4px; z-index: 10;
      }
      .sl-progress-bar { height: 3px; flex: 1; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden; }
      .sl-progress-fill { height: 100%; width: 0%; background: #fff; transition: width 0.3s ease; }
      .sl-progress-fill.active { width: 100%; }
      
      .sl-header-controls {
        position: absolute; top: 25px; left: 20px; right: 20px; display: flex; justify-content: space-between; align-items: center; z-index: 10; pointer-events: none;
      }
      .sl-badge-left { display: flex; gap: 8px; pointer-events: auto; }
      
      /* Active Burning Glow Streak Custom Component Animation */
      .sl-streak-badge {
        color: #fff; font-size: 0.72rem; font-weight: 700; 
        background: linear-gradient(45deg, #ff4500, #ff8c00);
        padding: 4px 12px; border-radius: 20px; display: flex; align-items: center; gap: 4px;
        box-shadow: 0 0 12px rgba(255,69,0,0.6);
        animation: slStreakPop 1.2s infinite alternate ease-in-out;
      }
      @keyframes slStreakPop {
        0% { transform: scale(1); box-shadow: 0 0 8px rgba(255,69,0,0.5); }
        100% { transform: scale(1.06); box-shadow: 0 0 16px rgba(255,140,0,0.8), 0 0 22px rgba(255,69,0,0.4); }
      }

      .sl-top-btn {
        background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); color: #fff; width: 28px; height: 28px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(5px); pointer-events: auto; font-size: 0.85rem; transition: all 0.2s;
      }
      .sl-top-btn.bookmarked { background: #eab308; border-color: #eab308; color: #000; }
      
      .sl-counter {
        color: rgba(255,255,255,0.7); font-size: 0.72rem; font-weight: 700;
        background: rgba(0,0,0,0.4); padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.05);
      }
      
      .sl-track { width: 100%; height: 100%; display: flex; flex-direction: column; }
      .sl-card {
        min-height: 100%; width: 100%; position: relative; display: flex; flex-direction: column;
        justify-content: center; align-items: center; padding: 40px 24px 110px; box-sizing: border-box; color: #fff; text-align: center;
        user-select: none; cursor: pointer;
      }
      .sl-subj-tag {
        background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
        padding: 5px 14px; border-radius: 30px; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 20px;
      }
      .sl-question { font-size: 1.35rem; font-weight: 800; line-height: 1.45; margin-bottom: 20px; text-shadow: 0 4px 12px rgba(0,0,0,0.3); word-break: break-word; }
      
      .sl-tap-hint {
        font-size: 0.78rem; color: rgba(255,255,255,0.4); margin-bottom: 20px; font-weight: 500;
        animation: slFadeInOut 2s infinite ease-in-out;
      }
      @keyframes slFadeInOut { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }

      .sl-bottom-sheet {
        position: absolute; bottom: 0; left: 0; right: 0; background: #111219; border-radius: 28px 28px 0 0;
        padding: 24px 24px 105px; transform: translateY(102%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); 
        z-index: 5; text-align: left; box-shadow: 0 -10px 40px rgba(0,0,0,0.6); box-sizing: border-box;
        max-height: 52%; overflow-y: auto; pointer-events: auto;
      }
      .sl-bottom-sheet.open { transform: translateY(0); }
      .sl-ans-title { font-size: 0.65rem; text-transform: uppercase; color: #10b981; font-weight: 800; margin-bottom: 6px; letter-spacing: 0.5px; }
      .sl-ans-text { font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 8px; word-break: break-word; }
      .sl-exp-text { color: #9ca3af; font-size: 0.85rem; line-height: 1.5; }
      
      /* [UPDATED] Clean Horizontal Unified Controls Grid */
      .sl-controls { 
        position: absolute; bottom: 22px; left: 24px; right: 24px;
        display: flex; gap: 12px; z-index: 99; justify-content: center; align-items: center;
        pointer-events: auto;
      }
      .sl-btn {
        background: #1e293b; border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 12px 18px; border-radius: 50px;
        font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
        display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        -webkit-tap-highlight-color: transparent;
      }
      /* Balanced Width Alignment Specifications */
      .sl-btn.btn-prev { width: 105px; }
      .sl-btn.btn-next { background: var(--accent, #3b82f6); border-color: transparent; width: 115px; }
      .sl-btn.btn-prev:disabled { opacity: 0.25; cursor: not-allowed; background: #0f172a; }
      
      /* [UPDATED] Centered Premium Rounded Share Control Node between actions */
      .sl-btn.btn-share { background: #334155; width: 44px; height: 44px; padding: 0; border-radius: 50%; font-size: 0.95rem; }
      
      .sl-toast {
        position: absolute; bottom: 95px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: rgba(0, 0, 0, 0.85); color: #fff; padding: 8px 16px; border-radius: 20px;
        font-size: 0.78rem; font-weight: 600; z-index: 150; opacity: 0; pointer-events: none;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1);
      }
      .sl-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

      /* Highly Visible View Bookmarks Yellow-Gold Button */
      .sl-view-bookmarks-wrapper {
        margin-top: 20px; width: 100%; max-width: 410px; display: flex; justify-content: center; position: relative; z-index: 999;
      }
      .sl-bookmarks-trigger-btn {
        background: #eab308 !important; 
        border: 2px solid rgba(255, 255, 255, 0.2) !important; 
        color: #000000 !important;
        padding: 12px 28px; border-radius: 50px; font-size: 0.88rem; font-weight: 800; cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: inline-flex; align-items: center; gap: 8px; 
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
      }
      .sl-bookmarks-trigger-btn:hover {
        background: #ca8a04 !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.8);
        transform: translateY(-1px);
      }
      .sl-bookmarks-trigger-btn.active-view {
        background: #ef4444 !important; 
        color: #ffffff !important;
        border-color: #ef4444 !important;
      }

      .sl-bookmark-page {
        position: absolute; inset: 0; background: #0c0d14; z-index: 120; transform: translateY(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;
        border-radius: 26px; 
      }
      .sl-bookmark-page.open { transform: translateY(0); }
      
      .sl-bp-header {
        padding: 20px; display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,0.08); background: #12131c; padding-top: 35px;
      }
      .sl-bp-title { font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: 0.5px; }
      .sl-bp-close { display: none; }
      
      .sl-bp-list { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; padding-bottom: 40px; }
      .sl-bp-item {
        background: #181a26; border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; padding: 14px 16px;
        display: flex; justify-content: space-between; align-items: center; gap: 12px; cursor: pointer; transition: transform 0.2s;
      }
      .sl-bp-item-body { flex: 1; display: flex; flex-direction: column; gap: 4px; text-align: left; }
      .sl-bp-item-subj { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; color: #3b82f6; letter-spacing: 0.5px; }
      .sl-bp-item-q { font-size: 0.82rem; font-weight: 600; color: #e5e7eb; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .sl-bp-delete-btn {
        background: transparent; border: none; color: rgba(255,255,255,0.3); font-size: 1rem; cursor: pointer;
        padding: 8px; display: flex; align-items: center; justify-content: center; border-radius: 50%;
      }
      .sl-bp-delete-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
      .sl-bp-empty { margin: auto; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px; }
    `;
    document.head.appendChild(style);
  }

  buildSkeleton() {
    this.dom.wrapper = document.createElement('div');
    this.dom.wrapper.className = 'sl-shorts-wrapper';

    this.dom.progressBar = document.createElement('div');
    this.dom.progressBar.className = 'sl-progress-container';
    
    var headerControls = document.createElement('div');
    headerControls.className = 'sl-header-controls';
    
    var badgeLeft = document.createElement('div');
    badgeLeft.className = 'sl-badge-left';
    
    this.dom.streakBadge = document.createElement('div');
    this.dom.streakBadge.className = 'sl-streak-badge';
    this.dom.streakBadge.innerHTML = `⚡ ${this.streakCount} Days`;
    
    this.dom.bookmarkBtn = document.createElement('button');
    this.dom.bookmarkBtn.className = 'sl-top-btn btn-bookmark';
    this.dom.bookmarkBtn.innerHTML = '🔖';

    badgeLeft.appendChild(this.dom.streakBadge);
    badgeLeft.appendChild(this.dom.bookmarkBtn);

    this.dom.counter = document.createElement('div');
    this.dom.counter.className = 'sl-counter';

    headerControls.appendChild(badgeLeft);
    headerControls.appendChild(this.dom.counter);

    this.dom.track = document.createElement('div');
    this.dom.track.className = 'sl-track';

    this.dom.toast = document.createElement('div');
    this.dom.toast.className = 'sl-toast';

    this.dom.bookmarkPage = document.createElement('div');
    this.dom.bookmarkPage.className = 'sl-bookmark-page';
    this.dom.bookmarkPage.innerHTML = `
      <div class="sl-bp-header">
        <div class="sl-bp-title">Saved Bookmarks</div>
        <button class="sl-bp-close">Close</button>
      </div>
      <div class="sl-bp-list"></div>
    `;

    this.dom.controls = document.createElement('div');
    this.dom.controls.className = 'sl-controls';

    this.dom.wrapper.appendChild(this.dom.progressBar);
    this.dom.wrapper.appendChild(headerControls);
    this.dom.wrapper.appendChild(this.dom.track);
    this.dom.wrapper.appendChild(this.dom.controls);
    this.dom.wrapper.appendChild(this.dom.bookmarkPage); 
    this.dom.wrapper.appendChild(this.dom.toast);
    
    this.container.appendChild(this.dom.wrapper);

    var footerContainer = document.createElement('div');
    footerContainer.className = 'sl-view-bookmarks-wrapper';
    this.dom.viewBookmarksBtn = document.createElement('button');
    this.dom.viewBookmarksBtn.className = 'sl-bookmarks-trigger-btn';
    footerContainer.appendChild(this.dom.viewBookmarksBtn);
    this.container.appendChild(footerContainer);

    this.attachEvents();
  }

  renderSlide() {
    this.dom.track.innerHTML = '';
    this.dom.controls.innerHTML = '';
    this.dom.progressBar.innerHTML = '';

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
    var savedList = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
    if (savedList.indexOf(item.id) !== -1) {
      this.dom.bookmarkBtn.classList.add('bookmarked');
      this.dom.bookmarkBtn.innerHTML = '⭐';
    } else {
      this.dom.bookmarkBtn.classList.remove('bookmarked');
      this.dom.bookmarkBtn.innerHTML = '🔖';
    }

    var card = document.createElement('div');
    card.className = 'sl-card';
    card.style.background = item.bg;

    card.innerHTML = `
      <div class="sl-subj-tag">${item.subj}</div>
      <div class="sl-question">${item.q}</div>
      <div class="sl-tap-hint">Tap screen to reveal answer</div>
      <div class="sl-bottom-sheet">
        <div class="sl-ans-title">✓ Correct Answer</div>
        <div class="sl-ans-text">${item.a}</div>
        <div class="sl-exp-text">${item.extra}</div>
      </div>
    `;
    this.dom.track.appendChild(card);

    // [UPDATED] Render unified clean sequence tracking buttons row
    var isPrevDisabled = this.currentIndex === 0 ? 'disabled' : '';
    this.dom.controls.innerHTML = `
      <button class="sl-btn btn-prev" ${isPrevDisabled}>⏮ Back</button>
      <button class="sl-btn btn-share" title="Share Fact">🔗</button>
      <button class="sl-btn btn-next">Next ➔</button>
    `;
  }

  showToast(message) {
    this.dom.toast.textContent = message;
    this.dom.toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('show');
    }, 2000);
  }

  updateBookmarkButtonCount() {
    var savedList = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
    var isOpen = this.dom.bookmarkPage.classList.contains('open');
    if (isOpen) {
      this.dom.viewBookmarksBtn.innerHTML = `✕ Close Bookmarks`;
    } else {
      this.dom.viewBookmarksBtn.innerHTML = `📚 View Bookmarks (${savedList.length})`;
    }
  }

  toggleBookmark() {
    var item = this.allQuestions[this.currentIndex];
    var savedList = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
    var index = savedList.indexOf(item.id);

    if (index === -1) {
      savedList.push(item.id);
      this.dom.bookmarkBtn.classList.add('bookmarked');
      this.dom.bookmarkBtn.innerHTML = '⭐';
      this.showToast("Saved to Bookmarks!");
    } else {
      savedList.splice(index, 1);
      this.dom.bookmarkBtn.classList.remove('bookmarked');
      this.dom.bookmarkBtn.innerHTML = '🔖';
      this.showToast("Removed from Bookmarks");
    }
    localStorage.setItem('sl_bookmarks', JSON.stringify(savedList));
    this.updateBookmarkButtonCount();
  }

  ShareCurrentShort() {
  var item = this.allQuestions[this.currentIndex];
  var self = this; // Maintain scoping context for toast calls inside callbacks

  // 1. Initialize a crisp, high-resolution canvas layout
  var canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 500; // Expanded slightly to provide optimal padding for long questions
  var ctx = canvas.getContext("2d");

  // Background: Studio-grade deep dark space gradient
  var grad = ctx.createLinearGradient(0, 0, 800, 500);
  grad.addColorStop(0, "#090d16");
  grad.addColorStop(1, "#111827");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 500);

  // Left Brand Accent Border (Premium Tech Blue)
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(0, 0, 14, 500);

  ctx.textBaseline = "top";
  
  // Over-title Header Branding
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("STUDYLAB SHORTS : DAILY BRIEF", 50, 45);

  // Metadata Track: Subject Area Section
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SECTION", 50, 95);
  
  ctx.fillStyle = "#f1f5f9";
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(item.subj.toUpperCase(), 50, 118);

  // Metadata Track: Question Header
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("QUESTION FOCUS", 50, 180);

  // 2. Intelligent Multi-line Text Wrapping Engine for the Question Body
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
  
  var textX = 50;
  var textY = 205;
  var maxLineWidth = 700;
  var lineHeight = 34;
  
  var words = item.q.split(" ");
  var currentLine = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = currentLine + words[n] + " ";
    var metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxLineWidth && n > 0) {
      ctx.fillText(currentLine, textX, textY);
      currentLine = words[n] + " ";
      textY += lineHeight;
    } else {
      currentLine = testLine;
    }
  }
  ctx.fillText(currentLine, textX, textY); // Paint remaining trailing words

  // Subtle App Domain Branding Footer
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("studylab-inky.vercel.app", 50, 440);

  // 3. Fallback text description payload
  var textDescription = "StudyLab Shorts Brief. Section: " + item.subj.toUpperCase() + " | Review full analysis and micro-learning metrics at: https://studylab-inky.vercel.app";

  // 4. Native Share Execution with Blob Stream Conversion
  canvas.toBlob(function(blob) {
    if (!blob) return;
    var file = new File([blob], "studylab-short.png", { type: "image/png" });

    // Use native device system share manager sheet if supported (iOS / Android / Safari)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        title: 'StudyLab Daily Brief',
        text: textDescription,
        files: [file]
      }).catch(function(err){});
    } else {
      // Hard Fallback Engine for PC/Mac Desktop Browsers: Copy link + Auto Download PNG Card
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = textDescription;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);

      var link = document.createElement("a");
      link.download = "studylab-short-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      if (typeof self.showToast === "function") {
        self.showToast("Analysis copied & card image downloaded.");
      }
    }
  }, "image/png");
}


  toggleBookmarkPage() {
    var isOpen = this.dom.bookmarkPage.classList.contains('open');
    if (isOpen) {
      this.dom.bookmarkPage.classList.remove('open');
      this.dom.viewBookmarksBtn.classList.remove('active-view');
    } else {
      this.openBookmarkPage();
      this.dom.viewBookmarksBtn.classList.add('active-view');
    }
    this.updateBookmarkButtonCount();
  }

  openBookmarkPage() {
    var listContainer = this.dom.bookmarkPage.querySelector('.sl-bp-list');
    listContainer.innerHTML = '';
    var savedIds = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
    var bookmarkedQuestions = this.allQuestions.filter(q => savedIds.indexOf(q.id) !== -1);

    if (bookmarkedQuestions.length === 0) {
      listContainer.innerHTML = `
        <div class="sl-bp-empty">
          <span style="font-size:2rem;">📁</span>
          <span>No saved bookmarks found yet.</span>
        </div>`;
    } else {
      bookmarkedQuestions.forEach((item) => {
        var row = document.createElement('div');
        row.className = 'sl-bp-item';
        row.dataset.id = item.id;
        row.innerHTML = `
          <div class="sl-bp-item-body">
            <div class="sl-bp-item-subj">${item.subj}</div>
            <div class="sl-bp-item-q">${item.q}</div>
          </div>
          <button class="sl-bp-delete-btn" data-id="${item.id}">✕</button>
        `;
        listContainer.appendChild(row);
      });
    }
    this.dom.bookmarkPage.classList.add('open');
  }

  attachEvents() {
    this.dom.wrapper.addEventListener('click', (e) => {
      if (this.dom.bookmarkPage.classList.contains('open')) {
        return; 
      }

      if (e.target.closest('.btn-bookmark')) {
        this.toggleBookmark();
        return;
      }

      if (e.target.closest('.sl-controls')) {
        if (e.target.classList.contains('btn-next')) {
          this.next();
        } else if (e.target.classList.contains('btn-prev')) {
          this.prev();
        } else if (e.target.closest('.btn-share')) {
          this.shareCurrentShort();
        }
        return;
      }

      var sheet = this.dom.wrapper.querySelector('.sl-bottom-sheet');
      if (sheet) {
        var isSheetOpen = sheet.classList.contains('open');
        if (isSheetOpen) {
          sheet.classList.remove('open');
        } else {
          sheet.classList.add('open');
          if (navigator.vibrate) navigator.vibrate(12);
        }
      }
    });

    this.dom.viewBookmarksBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      this.toggleBookmarkPage();
    });
    
    this.dom.bookmarkPage.addEventListener('click', (e) => {
      if (e.target.classList.contains('sl-bp-delete-btn')) {
        e.stopPropagation();
        var idToRemove = e.target.dataset.id;
        var savedList = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
        var index = savedList.indexOf(idToRemove);
        if (index !== -1) {
          savedList.splice(index, 1);
          localStorage.setItem('sl_bookmarks', JSON.stringify(savedList));
          this.openBookmarkPage();
          this.renderSlide();
          this.updateBookmarkButtonCount();
        }
        return;
      }

      var clickedItem = e.target.closest('.sl-bp-item');
      if (clickedItem) {
        var targetId = clickedItem.dataset.id;
        var foundIndex = this.allQuestions.findIndex(q => q.id === targetId);
        if (foundIndex !== -1) {
          this.currentIndex = foundIndex;
          this.renderSlide();
          this.dom.bookmarkPage.classList.remove('open');
          this.dom.viewBookmarksBtn.classList.remove('active-view');
          this.updateBookmarkButtonCount();
        }
      }
    });
  }

  // [UPDATED FEATURE]: True sequence progressive logic chain (Guarantees zero replication overhead)
  next() {
    if (this.currentIndex < this.allQuestions.length - 1) {
      this.currentIndex++;
      this.renderSlide();
    } else {
      // Loop resets cleanly back to starting sequence point only when array fully depletes
      this.currentIndex = 0;
      this.renderSlide();
      this.showToast("🔄 Starting fresh review batch!");
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderSlide();
    }
  }
}

function pgShorts() {
  var dataset = generateDynamicShorts(100);
  var centerLayoutBox = document.createElement("div");
  centerLayoutBox.className = "sl-main-center-box";

  new StudyLabShortsEngine(centerLayoutBox, dataset);
  return centerLayoutBox;
}

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
