// ============================================================
//  StudyLab — OneSignal Push Notification System
//  No Bell | Custom Popup | Auto Prompt
//  Version: 4.0 | Production Ready
// ============================================================

window.OneSignalDeferred = window.OneSignalDeferred || [];

// ── UTILS ────────────────────────────────────────────────────
function slGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
}
function slSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}
function daysSince(ts) {
  if (!ts) return Infinity;
  return (Date.now() - ts) / (1000 * 60 * 60 * 24);
}
function shouldPrompt() {
  const d = slGet("sl_notif") || {};
  if (d.subscribed) return false;
  if (d.permanentlyDenied) return false;
  if (d.lastDismissed && daysSince(d.lastDismissed) < 3) return false;
  return true;
}

// ── STYLES ───────────────────────────────────────────────────
function injectStyles() {
  if (document.getElementById("sl-notif-css")) return;
  const s = document.createElement("style");
  s.id = "sl-notif-css";
  s.textContent = `
    #sl-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 999990;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: sl-fade-in 0.25s ease forwards;
      padding: 20px;
    }
    @keyframes sl-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #sl-popup-card {
      background: var(--card, #141820);
      border: 1px solid var(--border2, rgba(255,255,255,0.1));
      border-radius: 20px;
      padding: 32px 28px 28px;
      max-width: 360px;
      width: 100%;
      text-align: center;
      animation: sl-pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
      position: relative;
    }
    @keyframes sl-pop-in {
      from { opacity: 0; transform: scale(0.92) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    #sl-popup-card .sl-icon-wrap {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: var(--accent-soft, rgba(99,102,241,0.15));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    #sl-popup-card .sl-icon-wrap svg {
      color: var(--accent, #6366f1);
    }
    #sl-popup-card h2 {
      font-family: var(--font-display, sans-serif);
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text, #fff);
      margin: 0 0 10px;
      line-height: 1.3;
    }
    #sl-popup-card p {
      font-size: 0.84rem;
      color: var(--muted, #aaa);
      line-height: 1.6;
      margin: 0 0 24px;
    }
    #sl-popup-card .sl-tags {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    #sl-popup-card .sl-tag {
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 20px;
      background: var(--accent-soft, rgba(99,102,241,0.12));
      color: var(--accent, #6366f1);
      font-weight: 500;
    }
    #sl-popup-card .sl-btn-allow {
      width: 100%;
      padding: 13px;
      border-radius: 12px;
      border: none;
      background: var(--accent, #6366f1);
      color: #fff;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 10px;
      transition: opacity 0.2s, transform 0.15s;
      font-family: var(--font-body, sans-serif);
    }
    #sl-popup-card .sl-btn-allow:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    #sl-popup-card .sl-btn-deny {
      width: 100%;
      padding: 10px;
      border-radius: 12px;
      border: none;
      background: transparent;
      color: var(--muted, #888);
      font-size: 0.82rem;
      cursor: pointer;
      transition: color 0.2s;
      font-family: var(--font-body, sans-serif);
    }
    #sl-popup-card .sl-btn-deny:hover {
      color: var(--text, #fff);
    }
  `;
  document.head.appendChild(s);
}

// ── POPUP ────────────────────────────────────────────────────
function showPopup(onAllow, onDeny) {
  injectStyles();

  const overlay = document.createElement("div");
  overlay.id = "sl-popup-overlay";
  overlay.innerHTML = `
    <div id="sl-popup-card" role="dialog" aria-modal="true" aria-label="Enable notifications">
      <div class="sl-icon-wrap">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <h2>Never Miss an Exam Update!</h2>
      <p>Get instant alerts for daily current affairs, important notifications and exam updates — completely free.</p>
      <div class="sl-tags">
        <span class="sl-tag">📰 Current Affairs</span>
        <span class="sl-tag">🎯 Exam Alerts</span>
        <span class="sl-tag">🏛️ Govt Updates</span>
      </div>
      <button class="sl-btn-allow" id="sl-allow">🔔 Enable Notifications</button>
      <button class="sl-btn-deny" id="sl-deny">No thanks, I'll miss out</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("sl-allow").addEventListener("click", function () {
    removePopup();
    onAllow();
  });
  document.getElementById("sl-deny").addEventListener("click", function () {
    removePopup();
    onDeny();
  });
}

function removePopup() {
  const overlay = document.getElementById("sl-popup-overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.2s";
    setTimeout(() => overlay.remove(), 220);
  }
}

// ── MAIN ─────────────────────────────────────────────────────
OneSignalDeferred.push(async function (OneSignal) {
  try {
    await OneSignal.init({
      appId: "0ea19fa4-b7fd-4f6f-8031-7b536a14b7a0",
      serviceWorkerParam: { scope: "/" },
      serviceWorkerPath: "OneSignalSDKWorker.js",
      notificationClickHandlerMatch: "exact",
      notificationClickHandlerAction: "navigate",
      welcomeNotification: {
        title: "You're all set! 🎯",
        message: "StudyLab will now send you daily exam updates and current affairs.",
        url: "https://studylab-inky.vercel.app/"
      },
      autoPrompt: false
    });

    // Already subscribed — skip everything
    if (OneSignal.Notifications.permission) return;

    // Already hard blocked by browser — skip
    if (Notification.permission === "denied") return;

    // Should we show prompt?
    if (!shouldPrompt()) return;

    // Show our custom popup after 5 seconds
    setTimeout(function () {
      showPopup(
        // Allow clicked
        async function () {
          try {
            await OneSignal.Notifications.requestPermission();
            const granted = OneSignal.Notifications.permission;
            const d = slGet("sl_notif") || {};
            if (granted) {
              d.subscribed = true;
            } else {
              // Browser denied after our popup — mark permanent
              d.permanentlyDenied = true;
            }
            slSet("sl_notif", d);
          } catch(e) {}
        },
        // Deny clicked
        function () {
          const d = slGet("sl_notif") || {};
          d.lastDismissed = Date.now();
          slSet("sl_notif", d);
        }
      );
    }, 5000);

  } catch (err) {
    // Silently fail — never break the app
  }
});