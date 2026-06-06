// ═══════════════════════════════════════════════════════════════════
// PAGE-SHORTS.JS — STUDYLAB SHORTS ULTRA (STREAK, BOOKMARK & SHARE)
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
    return [{ id: "fallback-1", subj: "Economy", bg: "linear-gradient(160deg, #db2777, #831843)", q: "Disguised unemployment refers to...", a: "Persons with no job.", extra: "Keep scrolling! 🔥" }];
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
        // Generate a unique ID for bookmark mapping
        var uniqueId = subj + "-" + index;
        allQuestions.push({ id: uniqueId, subj: subj, bg: bgGradients[subj] || "linear-gradient(160deg,#4b5563,#1f2937)", q: qText, a: correctText, extra: expText });
      }
    });
  });

  if (!allQuestions.length) {
    allQuestions = [{ id: "fallback-default", subj: "Economy", bg: "linear-gradient(160deg, #db2777, #831843)", q: "Disguised unemployment refers to...", a: "Persons with no job.", extra: "Keep scrolling to master more facts! 🔥" }];
  }
  return typeof shuf === 'function' ? shuf(allQuestions).slice(0, sessionLimit) : allQuestions.slice(0, sessionLimit);
}

class StudyLabShortsEngine {
  constructor(targetElement, questionsList) {
    this.container = targetElement;
    this.allQuestions = questionsList;
    this.currentIndex = 0;
    
    this.dom = { wrapper: null, progressBar: null, counter: null, track: null, streakBadge: null };
    this.init();
  }

  init() {
    this.updateStreak(); // Process streak logic immediately on load
    this.injectStyles();
    this.buildSkeleton();
    this.renderSlide();
  }

  // FEATURE 1: Smart Client-Side Streak Tracking
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
        // Already active today, streak maintained
      } else if (lastActiveDate === yesterday.toDateString()) {
        currentStreak += 1; // Incremented sequentially
      } else {
        currentStreak = 1; // Streak broken, reset
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
      
      /* Header Badges Grid */
      .sl-header-controls {
        position: absolute; top: 25px; left: 20px; right: 20px; display: flex; justify-content: space-between; align-items: center; z-index: 10; pointer-events: none;
      }
      .sl-badge-left { display: flex; gap: 8px; pointer-events: auto; }
      .sl-streak-badge {
        color: #fff; font-size: 0.72rem; font-weight: 700; background: linear-gradient(45deg, #f97316, #ea580c);
        padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 10px rgba(234,88,12,0.3);
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
        justify-content: center; align-items: center; padding: 40px 24px; box-sizing: border-box; color: #fff; text-align: center;
        user-select: none;
      }
      .sl-subj-tag {
        background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
        padding: 5px 14px; border-radius: 30px; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 20px;
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
      
      .sl-controls { position: absolute; bottom: 25px; display: flex; gap: 8px; z-index: 4; width: calc(100% - 40px); justify-content: center; }
      .sl-btn {
        background: rgba(255,255,255,0.18); border: none; color: #fff; padding: 10px 14px; border-radius: 50px;
        font-weight: 600; font-size: 0.8rem; cursor: pointer; backdrop-filter: blur(10px); transition: background 0.2s;
        display: inline-flex; align-items: center; justify-content: center; gap: 4px;
      }
      .sl-btn.btn-next { background: var(--accent, #3b82f6); flex-grow: 1; max-width: 100px; }
      .sl-btn.btn-prev { background: rgba(255,255,255,0.1); }
      .sl-btn.btn-prev:disabled { opacity: 0.25; cursor: not-allowed; }
      .sl-btn.btn-show-ans { flex-grow: 1; max-width: 130px; }
      .sl-btn.btn-share { background: rgba(255,255,255,0.1); width: 36px; height: 36px; padding: 0; border-radius: 50%; }
      
      /* Native Toast Alert Notification */
      .sl-toast {
        position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: rgba(0, 0, 0, 0.85); color: #fff; padding: 8px 16px; border-radius: 20px;
        font-size: 0.78rem; font-weight: 600; z-index: 20; opacity: 0; pointer-events: none;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1);
      }
      .sl-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    `;
    document.head.appendChild(style);
  }

  buildSkeleton() {
    this.dom.wrapper = document.createElement('div');
    this.dom.wrapper.className = 'sl-shorts-wrapper';

    this.dom.progressBar = document.createElement('div');
    this.dom.progressBar.className = 'sl-progress-container';
    
    // Top Row Controls Skeleton
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
    this.dom.bookmarkBtn.setAttribute('title', 'Bookmark Question');

    badgeLeft.appendChild(this.dom.streakBadge);
    badgeLeft.appendChild(this.dom.bookmarkBtn);

    this.dom.counter = document.createElement('div');
    this.dom.counter.className = 'sl-counter';

    headerControls.appendChild(badgeLeft);
    headerControls.appendChild(this.dom.counter);

    this.dom.track = document.createElement('div');
    this.dom.track.className = 'sl-track';

    // Toast element for instant notifications
    this.dom.toast = document.createElement('div');
    this.dom.toast.className = 'sl-toast';

    this.dom.wrapper.appendChild(this.dom.progressBar);
    this.dom.wrapper.appendChild(headerControls);
    this.dom.wrapper.appendChild(this.dom.track);
    this.dom.wrapper.appendChild(this.dom.toast);
    
    this.container.appendChild(this.dom.wrapper);
    this.attachEvents();
  }

  renderSlide() {
    this.dom.track.innerHTML = '';
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
    
    // FEATURE 2: Checking Bookmark Persistence state via localStorage mapping
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

    var isPrevDisabled = this.currentIndex === 0 ? 'disabled' : '';

    card.innerHTML = `
      <div class="sl-subj-tag">${item.subj}</div>
      <div class="sl-question">${item.q}</div>
      <div class="sl-controls">
        <button class="sl-btn btn-prev" ${isPrevDisabled}>⏮</button>
        <button class="sl-btn btn-show-ans">💡 View Answer</button>
        <button class="sl-btn btn-next">Next ➔</button>
        <button class="sl-btn btn-share" title="Share Fact">🔗</button>
      </div>
      <div class="sl-bottom-sheet">
        <div class="sl-ans-title">✓ Correct Answer</div>
        <div class="sl-ans-text">${item.a}</div>
        <div class="sl-exp-text">${item.extra}</div>
      </div>
    `;
    this.dom.track.appendChild(card);
  }

  showToast(message) {
    this.dom.toast.textContent = message;
    this.dom.toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('show');
    }, 2000);
  }

  // FEATURE 2 Core Code Logic: Toggle Bookmark
  toggleBookmark() {
    var item = this.allQuestions[this.currentIndex];
    var savedList = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
    var index = savedList.indexOf(item.id);

    if (index === -1) {
      savedList.push(item.id);
      this.dom.bookmarkBtn.classList.add('bookmarked');
      this.dom.bookmarkBtn.innerHTML = '⭐';
      this.showToast("📚 Saved to Bookmarks!");
    } else {
      savedList.splice(index, 1);
      this.dom.bookmarkBtn.classList.remove('bookmarked');
      this.dom.bookmarkBtn.innerHTML = '🔖';
      this.showToast("🗑 Removed from Bookmarks");
    }
    localStorage.setItem('sl_bookmarks', JSON.stringify(savedList));
  }

    // FEATURE 3 Core Code Logic: Ultra-Premium Typography Format (No Emojis)
  shareCurrentShort() {
    var item = this.allQuestions[this.currentIndex];
    
    // Clean, corporate and premium structured layout using typography bars
    var shareText = `_________________________________________\n\n` +
                    `STUDYLAB SHORTS : DAILY BRIEF\n` +
                    `_________________________________________\n\n` +
                    `SECTION  |  ${item.subj.toUpperCase()}\n\n` +
                    `QUESTION :\n` +
                    `${item.q}\n\n` +
                    `--- \n` +
                    `Discover the full analysis and more insights on StudyLab.\n` +
                    `ACCESS LINK : https://studylab-inky.vercel.appn` +
                    `_________________________________________`;

    if (navigator.share) {
      navigator.share({
        title: 'StudyLab Daily Brief',
        text: shareText
      }).catch(function(err){ console.log(err); });
    } else {
      // Fallback copy sequence for desktop environments
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = shareText;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.showToast("Link Copied to Clipboard"); // Removed icon here too for total consistency
    }
  }


  attachEvents() {
    this.dom.wrapper.addEventListener('click', (e) => {
      var sheet = this.dom.wrapper.querySelector('.sl-bottom-sheet');
      
      // Handle Top Fixed row bookmarks element explicitly
      if (e.target.closest('.btn-bookmark')) {
        this.toggleBookmark();
        return;
      }

      var isSheetOpen = sheet ? sheet.classList.contains('open') : false;

      if (isSheetOpen && !e.target.closest('.sl-controls')) {
        sheet.classList.remove('open');
        return;
      }

      if (e.target.classList.contains('btn-show-ans')) {
        sheet.classList.add('open');
        if (navigator.vibrate) navigator.vibrate(12);
      } else if (e.target.classList.contains('btn-next')) {
        this.next();
      } else if (e.target.classList.contains('btn-prev')) {
        this.prev();
      } else if (e.target.closest('.btn-share')) {
        this.shareCurrentShort();
      }
    });
  }

  next() {
    if (this.currentIndex < this.allQuestions.length - 1) {
      this.currentIndex++;
      this.renderSlide();
    } else {
      this.currentIndex = 0;
      this.renderSlide();
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
