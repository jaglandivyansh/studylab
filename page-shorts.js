// ═══════════════════════════════════════════════════════════════════
// PAGE-SHORTS.JS — STUDYLAB SHORTS ULTRA + INTERACTIVE BOOKMARK PAGE
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
    
    this.dom = { wrapper: null, progressBar: null, counter: null, track: null, streakBadge: null, viewBookmarksBtn: null, bookmarkPage: null };
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
        // maintained
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
      .sl-main-center-box {
        display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; padding: 15px; box-sizing: border-box;
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
      
      .sl-toast {
        position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: rgba(0, 0, 0, 0.85); color: #fff; padding: 8px 16px; border-radius: 20px;
        font-size: 0.78rem; font-weight: 600; z-index: 20; opacity: 0; pointer-events: none;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1);
      }
      .sl-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

            /* Premium Bottom Navigation Link for Bookmarks (FULLY VISIBLE) */
      .sl-view-bookmarks-wrapper {
        margin-top: 20px; 
        width: 100%; 
        max-width: 410px; 
        display: flex; 
        justify-content: center;
        position: relative;
        z-index: 999; /* ताकि किसी लेयर के पीछे न छिपे */
      }
      .sl-bookmarks-trigger-btn {
        background: #1e293b; /* सॉलिड प्रीमियम डार्क बैकग्राउंड */
        border: 1px solid rgba(255, 255, 255, 0.2); 
        color: #ffffff !important; /* हमेशा चमकीला वाइट रहेगा */
        padding: 12px 28px; 
        border-radius: 50px; 
        font-size: 0.88rem; 
        font-weight: 700; 
        cursor: pointer;
        transition: all 0.2s ease; 
        display: inline-flex; 
        align-items: center; 
        gap: 8px; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.4); /* बढ़िया विज़िबिलिटी के लिए शैडो */
      }
      .sl-bookmarks-trigger-btn:hover {
        background: #334155; 
        color: #ffffff !important;
        box-shadow: 0 6px 20px rgba(0,0,0,0.6);
      }


      /* Premium Sliding Full-Page View Bookmarks Module */
      .sl-bookmark-page {
        position: absolute; inset: 0; background: #090a0f; z-index: 100; transform: translateY(100%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;
      }
      .sl-bookmark-page.open { transform: translateY(0); }
      
      .sl-bp-header {
        padding: 20px; display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,0.08); background: #0d0e15;
      }
      .sl-bp-title { font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: 0.5px; }
      .sl-bp-close {
        background: rgba(255,255,255,0.08); border: none; color: #fff; font-size: 0.85rem; font-weight: 700;
        padding: 6px 14px; border-radius: 30px; cursor: pointer;
      }
      
      .sl-bp-list { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
      .sl-bp-list::-webkit-scrollbar { width: 4px; }
      .sl-bp-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      
      .sl-bp-item {
        background: #131520; border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; padding: 14px 16px;
        display: flex; justify-content: space-between; align-items: center; gap: 12px; cursor: pointer; transition: transform 0.2s;
      }
      .sl-bp-item:active { transform: scale(0.98); }
      .sl-bp-item-body { flex: 1; display: flex; flex-direction: column; gap: 4px; text-align: left; }
      .sl-bp-item-subj { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; color: #3b82f6; letter-spacing: 0.5px; }
      .sl-bp-item-q { font-size: 0.82rem; font-weight: 600; color: #e5e7eb; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      
      .sl-bp-delete-btn {
        background: transparent; border: none; color: rgba(255,255,255,0.3); font-size: 1rem; cursor: pointer;
        padding: 8px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s;
      }
      .sl-bp-delete-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
      
      .sl-bp-empty {
        margin: auto; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem; font-weight: 500; display: flex; flex-direction: column; gap: 8px;
      }
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

    // Build Premium Full Page Bookmark Sub-View Overlay
    this.dom.bookmarkPage = document.createElement('div');
    this.dom.bookmarkPage.className = 'sl-bookmark-page';
    this.dom.bookmarkPage.innerHTML = `
      <div class="sl-bp-header">
        <div class="sl-bp-title">Saved Bookmarks</div>
        <button class="sl-bp-close">Close</button>
      </div>
      <div class="sl-bp-list"></div>
    `;

    this.dom.wrapper.appendChild(this.dom.progressBar);
    this.dom.wrapper.appendChild(headerControls);
    this.dom.wrapper.appendChild(this.dom.track);
    this.dom.wrapper.appendChild(this.dom.bookmarkPage);
    this.dom.wrapper.appendChild(this.dom.toast);
    
    this.container.appendChild(this.dom.wrapper);

    // Build the External Bottom trigger Button requested by user
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

  updateBookmarkButtonCount() {
    var savedList = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
    this.dom.viewBookmarksBtn.innerHTML = `📚 View Bookmarks (${savedList.length})`;
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

  shareCurrentShort() {
    var item = this.allQuestions[this.currentIndex];
    var shareText = `_________________________________________\n\n` +
                    `STUDYLAB SHORTS : DAILY BRIEF\n` +
                    `_________________________________________\n\n` +
                    `SECTION  |  ${item.subj.toUpperCase()}\n\n` +
                    `QUESTION :\n` +
                    `${item.q}\n\n` +
                    `--- \n` +
                    `Discover the full analysis and more insights on StudyLab.\n` +
                    `ACCESS LINK : https://studylab-inky.vercel.app\n` +
                    `_________________________________________`;

    if (navigator.share) {
      navigator.share({ title: 'StudyLab Daily Brief', text: shareText }).catch(function(err){});
    } else {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = shareText;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.showToast("Link Copied to Clipboard");
    }
  }

  // Generate & render List inside the new Bookmark Page view
  openBookmarkPage() {
    var listContainer = this.dom.bookmarkPage.querySelector('.sl-bp-list');
    listContainer.innerHTML = '';
    
    var savedIds = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
    
    // Map local storage saved string IDs back to complete analytical data objects
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
    // Outer interface interactions
    this.dom.wrapper.addEventListener('click', (e) => {
      var sheet = this.dom.wrapper.querySelector('.sl-bottom-sheet');
      
      if (e.target.closest('.btn-bookmark')) {
        this.toggleBookmark();
        return;
      }

      var isSheetOpen = sheet ? sheet.classList.contains('open') : false;
      if (isSheetOpen && !e.target.closest('.sl-controls')) {
        sheet.classList.remove('remove');
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

    // Handle Open/Close interaction nodes for new Bookmarks page
    this.dom.viewBookmarksBtn.addEventListener('click', () => this.openBookmarkPage());
    
    this.dom.bookmarkPage.addEventListener('click', (e) => {
      if (e.target.classList.contains('sl-bp-close')) {
        this.dom.bookmarkPage.classList.remove('open');
        return;
      }

      // Handle direct item deletion row action
      if (e.target.classList.contains('sl-bp-delete-btn')) {
        e.stopPropagation();
        var idToRemove = e.target.dataset.id;
        var savedList = JSON.parse(localStorage.getItem('sl_bookmarks') || '[]');
        var index = savedList.indexOf(idToRemove);
        if (index !== -1) {
          savedList.splice(index, 1);
          localStorage.setItem('sl_bookmarks', JSON.stringify(savedList));
          this.updateBookmarkButtonCount();
          this.openBookmarkPage(); // Dynamic view re-render
          this.renderSlide(); // sync internal engine card state
        }
        return;
      }

      // Tap on item row -> Navigate to that question in Shorts Player instantly
      var clickedItem = e.target.closest('.sl-bp-item');
      if (clickedItem) {
        var targetId = clickedItem.dataset.id;
        var foundIndex = this.allQuestions.findIndex(q => q.id === targetId);
        if (foundIndex !== -1) {
          this.currentIndex = foundIndex;
          this.renderSlide();
          this.dom.bookmarkPage.classList.remove('open'); // Auto close page view
        }
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
