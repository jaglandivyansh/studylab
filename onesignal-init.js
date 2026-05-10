// ============================================================
//  StudyLab — OneSignal Push Notification System
//  Custom Code Integration (Advanced)
//  Version: 2.0 | Production Ready
// ============================================================

const StudyLabNotifications = (function () {

  // ── CONFIG ──────────────────────────────────────────────
  const APP_ID = "0ea19fa4-b7fd-4f6f-8031-7b536a14b7a0";

  const PROMPT_CONFIG = {
    delaySeconds: 8,        // Wait 8s before showing prompt
    minPageViews: 1,        // Show after 1st page view
    storageKey: "sl_notif_state",
    reminderDays: 3         // Re-prompt after 3 days if dismissed
  };

  const MESSAGES = {
    title: "Stay Ahead in Your Exam Prep!",
    body: "Get daily current affairs, important updates & exam alerts — directly in your browser.",
    allow: "Yes, Notify Me",
    deny: "Maybe Later",
    alreadySubscribed: "You're receiving StudyLab notifications!",
    blocked: "Notifications are blocked. Please enable them in your browser settings.",
    success: "You're now subscribed to StudyLab updates!"
  };

  // ── STATE ───────────────────────────────────────────────
  let state = {
    initialized: false,
    permission: "default",   // default | granted | denied
    subscribed: false,
    promptShown: false,
    promptTimer: null
  };

  // ── UTILS ───────────────────────────────────────────────
  function getStorage(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch (e) { return null; }
  }

  function setStorage(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch (e) {}
  }

  function daysSince(timestamp) {
    if (!timestamp) return Infinity;
    return (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  }

  function incrementPageViews() {
    const data = getStorage(PROMPT_CONFIG.storageKey) || {};
    data.pageViews = (data.pageViews || 0) + 1;
    setStorage(PROMPT_CONFIG.storageKey, data);
    return data.pageViews;
  }

  function shouldShowPrompt() {
    const data = getStorage(PROMPT_CONFIG.storageKey) || {};

    // Never show if already subscribed or permanently denied
    if (data.subscribed) return false;
    if (data.permanentlyDenied) return false;

    // Check if dismissed recently
    if (data.lastDismissed && daysSince(data.lastDismissed) < PROMPT_CONFIG.reminderDays) {
      return false;
    }

    // Check page views threshold
    if ((data.pageViews || 0) < PROMPT_CONFIG.minPageViews) return false;

    return true;
  }

  // ── UI: NOTIFICATION BELL ────────────────────────────────
  function createBellIcon() {
    const btn = document.createElement("div");
    btn.id = "sl-notif-bell";
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-label", "Manage notifications");
    btn.setAttribute("tabindex", "0");
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span id="sl-notif-dot" class="sl-dot hidden"></span>
    `;

    btn.addEventListener("click", handleBellClick);
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") handleBellClick();
    });

    return btn;
  }

  function injectStyles() {
    if (document.getElementById("sl-notif-styles")) return;
    const style = document.createElement("style");
    style.id = "sl-notif-styles";
    style.textContent = `
      /* ── Bell Icon ── */
      #sl-notif-bell {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--muted, #888);
        transition: color 0.2s, background 0.2s;
        flex-shrink: 0;
      }
      #sl-notif-bell:hover {
        color: var(--accent, #6366f1);
        background: rgba(99,102,241,0.08);
      }
      #sl-notif-bell.active {
        color: var(--accent, #6366f1);
      }
      .sl-dot {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ef4444;
        border: 2px solid var(--bg, #fff);
        animation: sl-pulse 2s infinite;
      }
      .sl-dot.hidden { display: none; }

      @keyframes sl-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
      }

      /* ── Custom Prompt Card ── */
      #sl-notif-prompt {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 320px;
        max-width: calc(100vw - 40px);
        background: var(--card, #1a1f2e);
        border: 1px solid var(--border2, rgba(255,255,255,0.1));
        border-radius: 16px;
        padding: 20px;
        z-index: 99990;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        animation: sl-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        font-family: var(--font-body, sans-serif);
      }

      #sl-notif-prompt.hiding {
        animation: sl-slide-down 0.25s ease forwards;
      }

      @keyframes sl-slide-up {
        from { opacity: 0; transform: translateY(20px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes sl-slide-down {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to   { opacity: 0; transform: translateY(20px) scale(0.97); }
      }

      .sl-prompt-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 14px;
      }

      .sl-prompt-icon svg {
        color: white;
      }

      .sl-prompt-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text, #fff);
        margin: 0 0 6px 0;
        line-height: 1.3;
      }

      .sl-prompt-body {
        font-size: 0.82rem;
        color: var(--muted, #aaa);
        margin: 0 0 16px 0;
        line-height: 1.5;
      }

      .sl-prompt-actions {
        display: flex;
        gap: 8px;
      }

      .sl-btn-allow {
        flex: 1;
        padding: 9px 14px;
        border-radius: 10px;
        border: none;
        background: var(--accent, #6366f1);
        color: white;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.15s;
      }
      .sl-btn-allow:hover { opacity: 0.9; transform: translateY(-1px); }
      .sl-btn-allow:active { transform: translateY(0); }

      .sl-btn-deny {
        padding: 9px 14px;
        border-radius: 10px;
        border: 1px solid var(--border2, rgba(255,255,255,0.1));
        background: transparent;
        color: var(--muted, #aaa);
        font-size: 0.82rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
      }
      .sl-btn-deny:hover { background: rgba(255,255,255,0.05); }

      .sl-prompt-close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--muted, #aaa);
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .sl-prompt-close:hover { background: rgba(255,255,255,0.08); }

      /* ── Toast ── */
      .sl-toast {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: var(--card, #1a1f2e);
        border: 1px solid var(--border2, rgba(255,255,255,0.1));
        border-radius: 10px;
        padding: 10px 18px;
        font-size: 0.82rem;
        color: var(--text, #fff);
        z-index: 99991;
        animation: sl-toast-in 0.3s forwards, sl-toast-out 0.3s 3s forwards;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 90vw;
        text-align: center;
      }
      @keyframes sl-toast-in {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      @keyframes sl-toast-out {
        from { opacity: 1; }
        to   { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(message, icon) {
    const t = document.createElement("div");
    t.className = "sl-toast";
    t.innerHTML = `<span>${icon || "🔔"}</span><span>${message}</span>`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // ── PROMPT ───────────────────────────────────────────────
  function createPrompt() {
    dismissPrompt(); // Remove old one if exists

    const prompt = document.createElement("div");
    prompt.id = "sl-notif-prompt";
    prompt.setAttribute("role", "dialog");
    prompt.setAttribute("aria-label", "Notification permission request");
    prompt.innerHTML = `
      <button class="sl-prompt-close" aria-label="Close" id="sl-prompt-close">✕</button>
      <div class="sl-prompt-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <p class="sl-prompt-title">${MESSAGES.title}</p>
      <p class="sl-prompt-body">${MESSAGES.body}</p>
      <div class="sl-prompt-actions">
        <button class="sl-btn-allow" id="sl-allow-btn">${MESSAGES.allow}</button>
        <button class="sl-btn-deny" id="sl-deny-btn">${MESSAGES.deny}</button>
      </div>
    `;

    document.body.appendChild(prompt);
    state.promptShown = true;

    document.getElementById("sl-allow-btn").addEventListener("click", handleAllow);
    document.getElementById("sl-deny-btn").addEventListener("click", handleDeny);
    document.getElementById("sl-prompt-close").addEventListener("click", handleDeny);
  }

  function dismissPrompt(permanently) {
    const existing = document.getElementById("sl-notif-prompt");
    if (existing) {
      existing.classList.add("hiding");
      setTimeout(() => existing.remove(), 280);
    }
    state.promptShown = false;

    const data = getStorage(PROMPT_CONFIG.storageKey) || {};
    data.lastDismissed = Date.now();
    if (permanently) data.permanentlyDenied = true;
    setStorage(PROMPT_CONFIG.storageKey, data);
  }

  // ── HANDLERS ────────────────────────────────────────────
  async function handleAllow() {
    dismissPrompt();
    try {
      const OneSignal = window.OneSignal;
      if (!OneSignal) return;

      await OneSignal.Notifications.requestPermission();

      const permission = OneSignal.Notifications.permission;

      if (permission) {
        state.subscribed = true;
        state.permission = "granted";
        updateBellState();
        showToast(MESSAGES.success, "✅");

        const data = getStorage(PROMPT_CONFIG.storageKey) || {};
        data.subscribed = true;
        setStorage(PROMPT_CONFIG.storageKey, data);
      } else {
        // Browser showed native prompt and user denied
        state.permission = "denied";
        updateBellState();
        showToast(MESSAGES.blocked, "❌");
        dismissPrompt(true);
      }
    } catch (err) {
      console.warn("[StudyLab Notifications] Permission request failed:", err);
    }
  }

  function handleDeny() {
    dismissPrompt();
    // Will re-prompt after PROMPT_CONFIG.reminderDays days
  }

  function handleBellClick() {
    if (state.permission === "denied") {
      showToast(MESSAGES.blocked, "⚙️");
      return;
    }
    if (state.subscribed) {
      showToast(MESSAGES.alreadySubscribed, "✅");
      return;
    }
    // Show prompt on bell click too
    createPrompt();
  }

  // ── BELL STATE ──────────────────────────────────────────
  function updateBellState() {
    const bell = document.getElementById("sl-notif-bell");
    const dot = document.getElementById("sl-notif-dot");
    if (!bell) return;

    if (state.subscribed) {
      bell.classList.add("active");
      bell.setAttribute("title", "Subscribed to notifications");
      if (dot) dot.classList.remove("hidden"); // Green dot when subscribed would be better - keeping same for simplicity
    } else {
      bell.classList.remove("active");
      bell.setAttribute("title", "Enable exam notifications");
    }
  }

  // ── INJECT BELL INTO NAVBAR ──────────────────────────────
  function injectBell() {
    // Try multiple navbar locations for flexibility
    const targets = [
      document.querySelector(".nb-right"),
      document.querySelector("#nb-links"),
      document.querySelector("nav")
    ];

    const target = targets.find(Boolean);
    if (!target) return;

    const bell = createBellIcon();

    // Insert before the theme toggle if exists
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn && target.contains(themeBtn)) {
      target.insertBefore(bell, themeBtn);
    } else {
      target.prepend(bell);
    }
  }

  // ── INIT ONESIGNAL ───────────────────────────────────────
  async function initOneSignal() {
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    return new Promise((resolve) => {
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          await OneSignal.init({
            appId: APP_ID,
            serviceWorkerParam: { scope: "/" },
            serviceWorkerPath: "OneSignalSDKWorker.js",
            notificationClickHandlerMatch: "exact",
            notificationClickHandlerAction: "navigate",
            welcomeNotification: {
              title: "Welcome to StudyLab! 🎯",
              message: "You'll now receive daily exam updates and current affairs alerts.",
              url: "https://studylab-inky.vercel.app/"
            },
            // Do NOT auto-prompt — we handle it ourselves
            autoPrompt: false
          });

          // Read current subscription state
          const permission = OneSignal.Notifications.permission;
          state.permission = permission ? "granted" : "default";
          state.subscribed = permission;
          state.initialized = true;

          // Sync with localStorage
          const data = getStorage(PROMPT_CONFIG.storageKey) || {};
          if (permission) {
            data.subscribed = true;
            setStorage(PROMPT_CONFIG.storageKey, data);
          }

          resolve();
        } catch (err) {
          console.warn("[StudyLab Notifications] OneSignal init failed:", err);
          resolve(); // Don't break the app
        }
      });
    });
  }

  // ── SCHEDULE PROMPT ──────────────────────────────────────
  function schedulePrompt() {
    if (!shouldShowPrompt()) return;
    if (state.subscribed) return;
    if (state.permission === "granted") return;

    state.promptTimer = setTimeout(() => {
      if (!state.promptShown && !state.subscribed) {
        createPrompt();
      }
    }, PROMPT_CONFIG.delaySeconds * 1000);
  }

  // ── PUBLIC INIT ──────────────────────────────────────────
  async function init() {
    injectStyles();

    // Increment page view count
    incrementPageViews();

    // Wait for OneSignal SDK to be ready
    await initOneSignal();

    // Inject bell into navbar
    injectBell();
    updateBellState();

    // Schedule smart prompt
    schedulePrompt();
  }

  // ── PUBLIC API ───────────────────────────────────────────
  return {
    init,
    subscribe: handleAllow,
    showPrompt: createPrompt,
    dismiss: dismissPrompt,
    getState: () => ({ ...state })
  };
})();

// ── AUTO INIT ON DOM READY ───────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", StudyLabNotifications.init);
} else {
  StudyLabNotifications.init();
}

// ── EXPOSE GLOBALLY (optional debugging) ────────────────
window.StudyLabNotifications = StudyLabNotifications;
