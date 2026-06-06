/**
 * STUDYLAB SHORTS ENGINE (PRO)
 * Designed for Performance, Ultra-Smooth Transitions, and modularity.
 */

class StudyLabShorts {
  constructor(options = {}) {
    this.container = document.querySelector(options.el || '#shorts-container');
    this.allQuestions = options.questions || [];
    this.currentIndex = 0;
    
    // UI Elements Configuration
    this.domElements = {
      wrapper: null,
      track: null,
      progressBar: null,
      counter: null
    };

    if (this.allQuestions.length > 0) {
      this.init();
    }
  }

  // 1. Initialize the Component
  init() {
    this.setupStyles();
    this.buildLayout();
    this.renderCurrentBatch();
    this.bindEvents();
  }

  // 2. Inject Premium & Optimized CSS
  setupStyles() {
    if (document.getElementById('sl-shorts-pro-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'sl-shorts-pro-styles';
    style.textContent = `
      .sl-shorts-wrapper {
        position: relative;
        width: 100%;
        max-width: 430px;
        height: 75dvh;
        background: #0d0e12;
        border-radius: 30px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      /* Indicator Bar like Instagram Stories */
      .sl-progress-container {
        position: absolute;
        top: 15px;
        left: 20px;
        right: 20px;
        display: flex;
        gap: 4px;
        z-index: 10;
      }
      .sl-progress-bar {
        height: 3px;
        flex: 1;
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
        overflow: hidden;
      }
      .sl-progress-fill {
        height: 100%;
        width: 0%;
        background: #fff;
        transition: width 0.3s ease;
      }
      .sl-progress-fill.active { width: 100%; }

      /* Counter */
      .sl-counter {
        position: absolute;
        top: 25px;
        right: 20px;
        color: rgba(255,255,255,0.6);
        font-size: 0.75rem;
        font-weight: 700;
        z-index: 10;
        background: rgba(0,0,0,0.3);
        padding: 4px 10px;
        border-radius: 20px;
        backdrop-filter: blur(5px);
      }

      /* Sliding Track */
      .sl-track {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
      }

      /* Card Style */
      .sl-card {
        min-height: 100%;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px 30px;
        box-sizing: border-box;
        color: #fff;
        text-align: center;
      }

      .sl-subj-tag {
        background: rgba(255,255,255,0.12);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        padding: 6px 16px;
        border-radius: 30px;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 700;
        margin-bottom: 30px;
      }

      .sl-question {
        font-size: 1.5rem;
        font-weight: 800;
        line-height: 1.4;
        margin-bottom: 40px;
        text-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      /* Clean Answer Bottom Sheet */
      .sl-bottom-sheet {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #161822;
        border-radius: 32px 32px 0 0;
        padding: 30px;
        transform: translateY(105%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 5;
        text-align: left;
        box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
      }
      .sl-bottom-sheet.open {
        transform: translateY(0);
      }

      .sl-ans-title {
        font-size: 0.65rem;
        text-transform: uppercase;
        color: #10b981;
        font-weight: 800;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }
      .sl-ans-text {
        font-size: 1.3rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 12px;
      }
      .sl-exp-text {
        color: #9ca3af;
        font-size: 0.88rem;
        line-height: 1.5;
      }

      /* Control Buttons Below Card */
      .sl-controls {
        position: absolute;
        bottom: 25px;
        display: flex;
        gap: 15px;
        z-index: 4;
      }
      .sl-btn {
        background: rgba(255,255,255,0.15);
        border: none;
        color: #fff;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.2s;
      }
      .sl-btn:hover { background: rgba(255,255,255,0.25); }
    `;
    document.head.appendChild(style);
  }

  // 3. Build Core HTML Skeleton
  buildLayout() {
    this.domElements.wrapper = document.createElement('div');
    this.domElements.wrapper.className = 'sl-shorts-wrapper';

    // Progress Bar Setup
    this.domElements.progressBar = document.createElement('div');
    this.domElements.progressBar.className = 'sl-progress-container';
    
    // Counter Setup
    this.domElements.counter = document.createElement('div');
    this.domElements.counter.className = 'sl-counter';

    // Track Setup
    this.domElements.track = document.createElement('div');
    this.domElements.track.className = 'sl-track';

    this.domElements.wrapper.appendChild(this.domElements.progressBar);
    this.domElements.wrapper.appendChild(this.domElements.counter);
    this.domElements.wrapper.appendChild(this.domElements.track);
    this.container.appendChild(this.domElements.wrapper);
  }

  // 4. Ultra-fast Intelligent Rendering (DOM Recycling)
  renderCurrentBatch() {
    this.domElements.track.innerHTML = '';
    this.domElements.progressBar.innerHTML = '';

    // Create Bars
    this.allQuestions.forEach((_, idx) => {
      const bar = document.createElement('div');
      bar.className = 'sl-progress-bar';
      const fill = document.createElement('div');
      fill.className = `sl-progress-fill ${idx < this.currentIndex ? 'active' : ''}`;
      if(idx === this.currentIndex) fill.style.width = '50%'; // current active partial fill
      bar.appendChild(fill);
      this.domElements.progressBar.appendChild(bar);
    });

    // Update Counter Text
    this.domElements.counter.textContent = `${this.currentIndex + 1} / ${this.allQuestions.length}`;

    // Render current item
    const item = this.allQuestions[this.currentIndex];
    const card = document.createElement('div');
    card.className = 'sl-card';
    card.style.background = item.bg || 'linear-gradient(160deg, #2563eb, #1e3a8a)';

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

    this.domElements.track.appendChild(card);
  }

  // 5. Event Binding & Actions
  bindEvents() {
    this.domElements.wrapper.addEventListener('click', (e) => {
      const sheet = this.domElements.wrapper.querySelector('.sl-bottom-sheet');
      
      if (e.target.classList.contains('btn-show-ans')) {
        sheet.classList.toggle('open');
        // Trigger soft mobile vibration if available
        if (navigator.vibrate) navigator.vibrate(15);
      } 
      
      else if (e.target.classList.contains('btn-next') || e.target.closest('.sl-bottom-sheet.open')) {
        this.nextSlide();
      }
    });

    // Add Key support for desktop testers (Up/Down arrows)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') this.nextSlide();
      if (e.key === 'ArrowUp') this.prevSlide();
    });
  }

  nextSlide() {
    if (this.currentIndex < this.allQuestions.length - 1) {
      this.currentIndex++;
      this.renderCurrentBatch();
    } else {
      alert("🎉 Brilliant! You've finished this batch.");
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentBatch();
    }
  }
}

// ── HOW TO USE ─────────────────────────────────────────────────────
// const shorts = new StudyLabShorts({
//   el: '#your-container-id',
//   questions: [{subj: "Economy", q: "Disguised unemployment refers to...", a: "Persons with no job.", extra: "Keep scrolling! 🔥", bg: "linear-gradient(160deg, #db2777, #831843)"}]
// });
