// ============================================================
//  StudyLab — PWA Install Handler
//  Smart install prompt for Android, Desktop & iOS
//  Version: 1.0 | Production Ready
// ============================================================

(function () {

  var deferredPrompt = null;
  var STORAGE_KEY = "sl_pwa_install";

  function getState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch(e) { return {}; }
  }
  function setState(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
    catch(e) {}
  }
  function daysSince(ts) {
    if (!ts) return Infinity;
    return (Date.now() - ts) / (1000 * 60 * 60 * 24);
  }

  // Detect iOS
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  // Detect if already running as installed PWA
  function isInstalled() {
    return window.matchMedia("(display-mode: standalone)").matches ||
           window.navigator.standalone === true;
  }

  // ── STYLES ────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById("sl-pwa-css")) return;
    var s = document.createElement("style");
    s.id = "sl-pwa-css";
    s.textContent = `
      #sl-pwa-banner {
        position: fixed;
        bottom: 70px;
        left: 12px;
        right: 12px;
        max-width: 480px;
        margin: 0 auto;
        background: var(--card, #1a1f2e);
        border: 1px solid var(--border2, rgba(255,255,255,0.12));
        border-radius: 18px;
        padding: 16px 18px;
        z-index: 99980;
        display: flex;
        align-items: center;
        gap: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        animation: sl-pwa-slide 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }
      @media (min-width: 600px) {
        #sl-pwa-banner {
          bottom: 24px;
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          width: 460px;
        }
      }
      @keyframes sl-pwa-slide {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      #sl-pwa-banner.hiding {
        animation: sl-pwa-hide 0.25s ease forwards;
      }
      @keyframes sl-pwa-hide {
        from { opacity: 1; transform: translateY(0); }
        to   { opacity: 0; transform: translateY(20px); }
      }
      .sl-pwa-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: var(--accent-soft, rgba(99,102,241,0.15));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 1.6rem;
      }
      .sl-pwa-text {
        flex: 1;
        min-width: 0;
      }
      .sl-pwa-title {
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--text, #fff);
        margin: 0 0 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sl-pwa-sub {
        font-size: 0.75rem;
        color: var(--muted, #aaa);
        margin: 0;
      }
      .sl-pwa-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
      .sl-pwa-btn-install {
        padding: 8px 16px;
        border-radius: 10px;
        border: none;
        background: var(--accent, #6366f1);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity 0.2s, transform 0.15s;
        font-family: var(--font-body, sans-serif);
      }
      .sl-pwa-btn-install:hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }
      .sl-pwa-btn-close {
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--border2, rgba(255,255,255,0.1));
        background: transparent;
        color: var(--muted, #aaa);
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.2s;
        font-family: var(--font-body, sans-serif);
      }
      .sl-pwa-btn-close:hover {
        background: rgba(255,255,255,0.06);
      }

      /* iOS instructions popup */
      #sl-pwa-ios-popup {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 99985;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 16px;
        animation: sl-fade-in 0.2s ease forwards;
      }
      @keyframes sl-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .sl-ios-card {
        background: var(--card, #1a1f2e);
        border: 1px solid var(--border2, rgba(255,255,255,0.12));
        border-radius: 20px;
        padding: 24px 22px 28px;
        width: 100%;
        max-width: 400px;
        text-align: center;
        animation: sl-pop-up 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }
      @keyframes sl-pop-up {
        from { transform: translateY(40px); opacity: 0; }
        to   { transform: translateY(0); opacity: 1; }
      }
      .sl-ios-card h3 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text, #fff);
        margin: 0 0 8px;
      }
      .sl-ios-card p {
        font-size: 0.82rem;
        color: var(--muted, #aaa);
        margin: 0 0 20px;
        line-height: 1.6;
      }
      .sl-ios-steps {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
        text-align: left;
      }
      .sl-ios-step {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--bg, rgba(255,255,255,0.04));
        border-radius: 12px;
        padding: 10px 14px;
      }
      .sl-ios-step-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--accent, #6366f1);
        color: #fff;
        font-size: 0.75rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .sl-ios-step-text {
        font-size: 0.82rem;
        color: var(--text, #fff);
        line-height: 1.4;
      }
      .sl-ios-step-text span {
        color: var(--accent, #6366f1);
        font-weight: 700;
      }
      .sl-ios-close {
        width: 100%;
        padding: 11px;
        border-radius: 12px;
        border: 1px solid var(--border2, rgba(255,255,255,0.1));
        background: transparent;
        color: var(--muted, #aaa);
        font-size: 0.85rem;
        cursor: pointer;
        font-family: var(--font-body, sans-serif);
        transition: background 0.2s;
      }
      .sl-ios-close:hover {
        background: rgba(255,255,255,0.05);
      }
    `;
    document.head.appendChild(s);
  }

  // ── DISMISS BANNER ────────────────────────────────────────
  function dismissBanner(permanently) {
    var banner = document.getElementById("sl-pwa-banner");
    if (banner) {
      banner.classList.add("hiding");
      setTimeout(function() { banner.remove(); }, 260);
    }
    var s = getState();
    s.lastDismissed = Date.now();
    if (permanently) s.neverShow = true;
    setState(s);
  }

  // ── ANDROID / DESKTOP BANNER ──────────────────────────────
  function showInstallBanner() {
    if (document.getElementById("sl-pwa-banner")) return;
    injectStyles();

    var banner = document.createElement("div");
    banner.id = "sl-pwa-banner";
    banner.innerHTML = `
      <div class="sl-pwa-icon">📚</div>
      <div class="sl-pwa-text">
        <p class="sl-pwa-title">Install StudyLab App</p>
        <p class="sl-pwa-sub">Free • Works offline • No Play Store needed</p>
      </div>
      <div class="sl-pwa-actions">
        <button class="sl-pwa-btn-install" id="sl-pwa-install-btn">Install</button>
        <button class="sl-pwa-btn-close" id="sl-pwa-close-btn">✕</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById("sl-pwa-install-btn").addEventListener("click", function () {
      dismissBanner(false);
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (result) {
          if (result.outcome === "accepted") {
            var s = getState();
            s.installed = true;
            s.neverShow = true;
            setState(s);
          }
          deferredPrompt = null;
        });
      }
    });

    document.getElementById("sl-pwa-close-btn").addEventListener("click", function () {
      // Dismiss for 7 days
      dismissBanner(false);
      var s = getState();
      s.lastDismissed = Date.now();
      s.dismissCount = (s.dismissCount || 0) + 1;
      // After 2 dismissals, never show again
      if (s.dismissCount >= 2) s.neverShow = true;
      setState(s);
    });
  }

  // ── iOS POPUP ─────────────────────────────────────────────
  function showIOSPopup() {
    if (document.getElementById("sl-pwa-ios-popup")) return;
    injectStyles();

    var popup = document.createElement("div");
    popup.id = "sl-pwa-ios-popup";
    popup.innerHTML = `
      <div class="sl-ios-card">
        <h3>📲 Install StudyLab on iPhone</h3>
        <p>Add to your home screen for the full app experience — no App Store needed!</p>
        <div class="sl-ios-steps">
          <div class="sl-ios-step">
            <div class="sl-ios-step-num">1</div>
            <div class="sl-ios-step-text">Tap the <span>Share</span> button at the bottom of Safari (the box with arrow ↑)</div>
          </div>
          <div class="sl-ios-step">
            <div class="sl-ios-step-num">2</div>
            <div class="sl-ios-step-text">Scroll down and tap <span>"Add to Home Screen"</span></div>
          </div>
          <div class="sl-ios-step">
            <div class="sl-ios-step-num">3</div>
            <div class="sl-ios-step-text">Tap <span>"Add"</span> — StudyLab will appear on your home screen!</div>
          </div>
        </div>
        <button class="sl-ios-close" id="sl-ios-close-btn">Got it, thanks!</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("sl-ios-close-btn").addEventListener("click", function () {
      popup.style.opacity = "0";
      popup.style.transition = "opacity 0.2s";
      setTimeout(function() { popup.remove(); }, 220);
      var s = getState();
      s.lastDismissed = Date.now();
      s.dismissCount = (s.dismissCount || 0) + 1;
      if (s.dismissCount >= 2) s.neverShow = true;
      setState(s);
    });

    // Close on backdrop tap
    popup.addEventListener("click", function(e) {
      if (e.target === popup) {
        document.getElementById("sl-ios-close-btn").click();
      }
    });
  }

  // ── MAIN LOGIC ────────────────────────────────────────────
  function init() {
    // Already installed as PWA — do nothing
    if (isInstalled()) return;

    var s = getState();

    // User said never show again
    if (s.neverShow) return;

    // Dismissed recently (within 7 days)
    if (s.lastDismissed && daysSince(s.lastDismissed) < 7) return;

    if (isIOS()) {
      // iOS — show manual instructions after 6 seconds
      setTimeout(showIOSPopup, 6000);
      return;
    }

    // Android / Desktop — listen for browser install event
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      // Show our banner after 6 seconds
      setTimeout(showInstallBanner, 6000);
    });

    // If already installable (prompt fired before our listener sometimes)
    // backup: show after 8 seconds if prompt is captured
    setTimeout(function() {
      if (deferredPrompt && !document.getElementById("sl-pwa-banner")) {
        showInstallBanner();
      }
    }, 8000);
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
