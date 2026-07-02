// ── UTILITY: TRIGGER REVEAL ANIMATION ──
function triggerReveal(container) {
  if (!container) return;
  var items = container.querySelectorAll(".news-card, .ca-card, .reveal-item");
  items.forEach(function(item, i) {
    item.style.opacity = "0";
    item.style.transform = "translateY(16px)";
    item.style.transition = "opacity 0.35s ease " + (i * 0.07) + "s, transform 0.35s ease " + (i * 0.07) + "s";
    setTimeout(function() {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, 20);
  });
}

// ── SARVAM AI TUTOR MODAL ──

function openSarvamAIModal(questionText, optionsArr, correctIndex, subject) {
  var overlay = el("div", {
    css: {
      position: "fixed", inset: "0", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10000"
    }
  });

  var card = el("div", {
    cls: "glass-modal", 
    css: {
      border: "1px solid var(--border2)", 
      borderRadius: "18px",
      padding: "26px", 
      maxWidth: "500px", 
      width: "90%", 
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)"
    }
  });

  var header = el("div", {css:{display:"flex", justifyContent:"space-between", marginBottom:"16px"}});
  header.appendChild(el("h3", {css:{margin:0, color:"var(--text)", fontFamily:"var(--font-display)"}, txt: "💡 AI Tutor Analysis"}));
  var closeBtn = el("button", {css:{background:"none", border:"none", color:"var(--subtle)", cursor:"pointer", fontSize:"1.2rem"}, txt:"✕", onclick: () => document.body.removeChild(overlay)});
  header.appendChild(closeBtn);
  card.appendChild(header);

  var contentArea = el("div", {css:{fontSize:"0.95rem", color:"var(--text)", lineHeight:"1.6", maxHeight:"60vh", overflowY:"auto"}});
  contentArea.innerHTML = "<div style='text-align:center; padding: 20px; color: var(--muted);'>Analyzing problem...</div>";
  card.appendChild(contentArea);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  var correctAns = optionsArr ? optionsArr[correctIndex] : "Not provided";
  
  // Ekdum seedha instruction
  var prompt = `Give a direct 1-2 sentence explanation of why "${correctAns}" is the correct answer for this ${subject} question: "${questionText}". Do not include any brainstorming steps. Start directly with the explanation.`;

  fetch("api/tutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sarvam-30b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0, 
      max_tokens: 300 
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.choices && data.choices[0] && data.choices[0].message) {
      let mainContent = data.choices[0].message.content || data.choices[0].message.reasoning_content || "";

      if (mainContent.includes("1. ") || mainContent.includes("Analyze")) {
        var parts = mainContent.split(/\n\n/);
        mainContent = parts[parts.length - 1];
      }

      contentArea.style.color = "var(--text)"; // Text color ensure karne ke liye
      contentArea.innerText = mainContent.trim() || "No clear answer returned.";
    } 
    else if (data.answer) {
      contentArea.style.color = "var(--text)";
      contentArea.innerText = data.answer;
    }
    else if (data.error) {
      contentArea.innerText = "Error: " + data.error;
    } 
    else {
      contentArea.innerText = "The AI is thinking... please try again in a second.";
    }
  })
  .catch(err => {
    contentArea.innerText = "Connection lost. Please check your internet.";
  });
}



// ========================================
// LIVE DAILY CURRENT AFFAIRS — RSS SYSTEM
// ========================================

const CA_TABS = [
  { id: 'national',  label: '🇮🇳 National',  color: '#4F8EF7' },
  { id: 'world',     label: '🌐 World',       color: '#f87171' },
  { id: 'govt',      label: '🏛 Govt / PIB',  color: '#8b5cf6' },
  { id: 'economy',   label: '📈 Economy',     color: '#f59e0b' },
  { id: 'science',   label: '🔬 Science',     color: '#4ade80' },
  { id: 'sports',    label: '🏆 Sports',      color: '#ec4899' },
  { id: 'awards',    label: '🎖️ Awards',      color: '#14b8a6' }
];

// ── GLOBAL ERROR HANDLER ──
window.addEventListener('error', function(e) {
  console.error('StudyLab Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise:', e.reason);
  e.preventDefault();
});

// rss2json base — free, no key, works directly from browser sandbox
const R2J = 'https://api.rss2json.com/v1/api.json?rss_url=';

// High-Volume Balanced Matrix: 10 Core National and Global Outlets Distributed Across Categories
const CA_FEEDS = {
  national: [
    { url: R2J + encodeURIComponent('https://feeds.feedburner.com/ndtvnews-india-news'),          name: 'NDTV India' },
    { url: R2J + encodeURIComponent('https://timesofindia.indiatimes.com/rssfeeds/2083611.cms'),  name: 'Times of India' },
    { url: R2J + encodeURIComponent('https://www.thehindu.com/news/national/feeder/default.rss'), name: 'The Hindu' },
    { url: R2J + encodeURIComponent('https://indianexpress.com/section/india/feed/'),             name: 'Indian Express' }
  ],
  world: [
    { url: R2J + encodeURIComponent('https://feeds.bbci.co.uk/news/world/rss.xml'),               name: 'BBC World News' },
    { url: R2J + encodeURIComponent('https://www.reutersagency.com/feed/?best-types=top-news'),   name: 'Reuters Global' },
    { url: R2J + encodeURIComponent('https://www.theguardian.com/world/rss'),                     name: 'The Guardian' }
  ],
  govt: [
    { url: R2J + encodeURIComponent('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3'),   name: 'PIB India' },
    { url: R2J + encodeURIComponent('https://www.thehindu.com/news/national/feeder/default.rss'), name: 'The Hindu Govt' },
    { url: R2J + encodeURIComponent('https://feeds.feedburner.com/ndtvnews-india-news'),          name: 'NDTV National' }
  ],
  economy: [
    { url: R2J + encodeURIComponent('https://economictimes.indiatimes.com/rssfeedsdefault.cms'),  name: 'Economic Times' },
    { url: R2J + encodeURIComponent('https://www.livemint.com/rss/economy'),                      name: 'Mint Economy' },
    { url: R2J + encodeURIComponent('https://www.business-standard.com/rss/economy-policy-102.rss'), name: 'Business Standard' }
  ],
  science: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/sci-tech/feeder/default.rss'),      name: 'The Hindu Sci-Tech' },
    { url: R2J + encodeURIComponent('https://feeds.feedburner.com/ndtvnews-science'),             name: 'NDTV Science' },
    { url: R2J + encodeURIComponent('https://timesofindia.indiatimes.com/rssfeeds/2886704.cms'),  name: 'TOI Science' }
  ],
  sports: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/sport/feeder/default.rss'),         name: 'The Hindu Sports' },
    { url: R2J + encodeURIComponent('https://indianexpress.com/section/sports/feed/'),            name: 'Indian Express Sports' }
  ],
  awards: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/entertainment/art/feeder/default.rss'), name: 'The Hindu Culture' },
    { url: R2J + encodeURIComponent('https://indianexpress.com/section/lifestyle/art-and-culture/feed/'), name: 'IE Art & Culture' }
  ]
};

const CA_FALLBACK = {
  national: [
    { title: "India's GDP growth forecast revised upward by IMF for FY2025", source: "Economic Times", url: "https://economictimes.indiatimes.com", pubDate: "" },
    { title: "Union Cabinet approves major infrastructure projects under PM Gati Shakti", source: "PIB India", url: "https://pib.gov.in", pubDate: "" },
    { title: "Supreme Court delivers landmark verdict on electoral bonds scheme", source: "The Hindu", url: "https://www.thehindu.com", pubDate: "" }
  ],
  world: [
    { title: "Global strategic partnership strengthened at international summit assembly", source: "Reuters", url: "https://reuters.com", pubDate: "" },
    { title: "UN General Assembly adopts multilateral connectivity cooperation resolution", source: "BBC World", url: "https://bbc.com", pubDate: "" }
  ],
  govt: [
    { title: "Cabinet approves PM Vishwakarma scheme for traditional artisans", source: "PIB India", url: "https://pib.gov.in", pubDate: "" },
    { title: "Government launches Digital India initiative phase-3 updates", source: "PIB India", url: "https://pib.gov.in", pubDate: "" }
  ],
  economy: [
    { title: "RBI holds repo rate steady; focuses on inflation management metrics", source: "Mint", url: "https://www.livemint.com", pubDate: "" },
    { title: "India ranks among top positions in Global Innovation Index reporting", source: "Business Standard", url: "https://www.business-standard.com", pubDate: "" }
  ],
  science: [
    { title: "Space agency successfully tests next-generation satellite launcher rocket", source: "The Hindu", url: "https://www.thehindu.com", pubDate: "" },
    { title: "National quantum computing mission infrastructure updates released", source: "NDTV Science", url: "https://www.ndtv.com", pubDate: "" }
  ],
  sports: [
    { title: "National athletics team completes historic gold medal competitive run", source: "The Hindu Sports", url: "https://www.thehindu.com", pubDate: "" },
    { title: "Cricket control board announces updated operational schedules", source: "Indian Express", url: "https://indianexpress.com", pubDate: "" }
  ],
  awards: [
    { title: "Sahitya Akademi Awards announced across multiple regional languages", source: "The Hindu Culture", url: "https://www.thehindu.com", pubDate: "" },
    { title: "National heritage protection metrics upgraded by cultural committee", source: "Ministry of Culture", url: "https://pib.gov.in", pubDate: "" }
  ]
};

var caActiveTab = 'national';
var caCache = {}; 

// ─── STABLE INDIVIDUAL FEED CONVERTER (Soft-Fails Gracefully) ───
async function fetchRSSFeed(feedObj) {
  try {
    const res = await Promise.race([
      fetch(feedObj.url),
      // Prevent browser hangs by dropping requests that take more than 5 seconds
      new Promise(function(_, rej) { setTimeout(function() { rej(new Error('Timeout')); }, 5000); })
    ]);
    if (!res.ok) return [];
    
    const data = await res.json();
    if (data.status !== 'ok' || !data.items || !data.items.length) return [];
    
    return data.items.map(function(item) {
      return {
        title: (item.title || '').split(' - ')[0].split(' | ')[0].trim(),
        source: feedObj.name,
        url: item.link || item.url || '#',
        pubDate: item.pubDate ? new Date(item.pubDate).getTime() : 0
      };
    }).filter(function(a) { return a.title.length > 10; });
  } catch (e) {
    console.warn("Feed stream bypassed: " + feedObj.name);
    return []; // Return empty array on failure so Promise.all Settled doesn't stall
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    var diff = Math.floor((now.getTime() - d.getTime()) / 60000); 
    if (diff < 60) return (diff < 1 ? 'Just now' : diff + 'm ago');
    if (diff < 1440) return Math.floor(diff / 60) + 'h ago';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch(e) { return ''; }
}

function renderCurrentAffairs(articles, isLive, tabId) {
  const container = document.getElementById('current-affairs-container');
  if (!container) return;
  const tab = CA_TABS.find(function(t) { return t.id === tabId; }) || CA_TABS[0];

  var tabsHTML = CA_TABS.map(function(t) {
    return `<button class="ca-tab${t.id === tabId ? ' ca-tab-active' : ''}"
      style="${t.id === tabId ? '--ca-color:' + t.color : ''}"
      onclick="switchCATab('${t.id}')">
      ${t.label}
    </button>`;
  }).join('');

  var cardsHTML = articles.slice(0, 15).map(function(a, i) {
    return `<div class="news-card ca-card" style="animation-delay:${i * 40}ms">
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div class="news-source" style="color:${tab.color}">${a.source}</div>
          ${a.pubDate ? `<div style="font-size:.65rem;color:var(--subtle)">${formatDate(a.pubDate)}</div>` : ''}
        </div>
        <div class="news-title">${a.title}</div>
      </div>
      <a href="${a.url}" target="_blank" rel="noopener" class="news-btn" style="color:${tab.color}">Read Full Story ↗</a>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="news-header" style="margin-bottom:14px">
      <h2>Daily <span>Current Affairs</span></h2>
      <div class="news-live-badge">${isLive ? '<span class="ca-live-dot"></span>AGGREGATED LIVE' : '📰 OFFLINE BACKUP'}</div>
    </div>
    <div class="ca-tabs-wrap">${tabsHTML}</div>
    <div class="news-scroller ca-scroller">${cardsHTML || '<div class="ca-empty">No articles found. Try another tab.</div>'}</div>
  `;

  if (typeof triggerReveal === "function") {
    setTimeout(function(){ triggerReveal(container); }, 10);
  }
}

async function switchCATab(tabId) {
  caActiveTab = tabId;
  
  document.querySelectorAll('.ca-tab').forEach(function(b) {
    const isActive = b.getAttribute('onclick').includes("'" + tabId + "'");
    b.classList.toggle('ca-tab-active', isActive);
    const tab = CA_TABS.find(function(t) { return t.id === tabId; });
    if (isActive && tab) b.style.setProperty('--ca-color', tab.color);
    else b.style.removeProperty('--ca-color');
  });

  if (caCache[tabId]) {
    renderCurrentAffairs(caCache[tabId].articles, caCache[tabId].isLive, tabId);
    return;
  }

  const scroller = document.querySelector('.ca-scroller');
  if (scroller) scroller.innerHTML = '<div class="ca-loading"><div class="ca-spinner"></div>Consolidating ' + tabId + ' networks...</div>';
  await loadCATab(tabId);
}

// ─── CONCURRENT AGGREGATION ENGINE (Fixes single-feed limitations) ───
async function loadCATab(tabId) {
  const feeds = CA_FEEDS[tabId] || [];
  
  // 1. Fetch all mapped media channels simultaneously in parallel streams
  const fetchPromises = feeds.map(function(feed) { return fetchRSSFeed(feed); });
  const results = await Promise.allSettled(fetchPromises);
  
  let aggregatedArticles = [];
  let isLive = false;

  // 2. Safely stitch together active outputs
  results.forEach(function(result) {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      aggregatedArticles = aggregatedArticles.concat(result.value);
      isLive = true; 
    }
  });

  // 3. Smart De-duplication: Drops overlap if different channels post identical text strings
  const seenTitles = new Set();
  let uniqueArticles = aggregatedArticles.filter(function(article) {
    var cleanTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenTitles.has(cleanTitle)) return false;
    seenTitles.add(cleanTitle);
    return true;
  });

  // 4. Fallback Hybrid Integration: If streaming links fall short, overlay historical objects smoothly
  if (uniqueArticles.length < 5) {
    const fallbacks = CA_FALLBACK[tabId] || [];
    fallbacks.forEach(function(f) {
      var cleanFBTitle = f.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenTitles.has(cleanFBTitle)) {
        uniqueArticles.push({
          title: f.title,
          source: f.source + " Archive",
          url: f.url,
          pubDate: f.pubDate ? new Date(f.pubDate).getTime() : Date.now() - 86400000 // Stamp as yesterday by default
        });
        seenTitles.add(cleanFBTitle);
      }
    });
  }

  // 5. Absolute Chronological Ordering (Pushes fresh breaking news up, maps yesterday below it)
  uniqueArticles.sort(function(a, b) { return b.pubDate - a.pubDate; });

  caCache[tabId] = { articles: uniqueArticles, isLive: isLive };
  
  if (caActiveTab === tabId) {
    renderCurrentAffairs(uniqueArticles, isLive, tabId);
  }
}

async function loadCurrentAffairs() {
  const container = document.getElementById('current-affairs-container');
  if (!container) return;
  container.innerHTML = `
    <div class="news-header">
      <h2>Daily <span>Current Affairs</span></h2>
      <div class="news-live-badge"><span class="ca-live-dot"></span>Synchronizing...</div>
    </div>
    <div style="padding:40px;text-align:center;color:var(--muted);font-size:.85rem">
      <div class="ca-spinner" style="margin:0 auto 12px"></div>Polling multi-media channels...
    </div>`;
  
  caCache = {};
  await loadCATab(caActiveTab);
  
  // Pre-fetch remaining sections sequentially in the background (Non-blocking)
  CA_TABS.filter(function(t) { return t.id !== caActiveTab; }).forEach(function(t) {
    loadCATab(t.id);
  });
}

// ═══════════════════════════════════════════
//   GOVT UPDATES PAGE — RSS SYSTEM (v2 — redesigned)
// ═══════════════════════════════════════════

var GU_TYPES = {
  vacancy:   { label:"New Vacancy",   icon:"📋", color:"#4F8EF7" },
  admitcard: { label:"Admit Card",    icon:"🪪", color:"#8b5cf6" },
  examdate:  { label:"Exam Schedule", icon:"📅", color:"#f59e0b" },
  result:    { label:"Result",        icon:"🏆", color:"#4ade80" }
};

// ── RSS feeds via multiple proxy services (tries each until one works)
var GU_RAW_FEEDS = [
  { raw: 'https://www.freejobalert.com/feed/',                          name:'FreeJobAlert' },
  { raw: 'https://www.indgovtjobs.in/feeds/posts/default?alt=rss',      name:'IndGovtJobs' }, // Highly reliable, no Cloudflare
  { raw: 'https://quicksarkari.com/feed/',                              name:'Sarkari Naukri' },
  { raw: 'https://www.rojgarresult.com/feed/',                          name:'Rojgar Result' },
  { raw: 'https://www.freshersworld.com/feeds/jobsalert.xml',           name:'FreshersWorld' },
  { raw: 'https://employmentnews.gov.in/NewMain/EmploymentNewsRss.aspx', name:'Employment News' },
  { raw: 'https://haryanajobs.in/feed/',                                name:'Haryana Jobs' }
];
var GU_OFFICIAL_LINKS = {
  // ── CENTRAL & NATIONAL BOARDS ──
  'UPSC': 'https://upsc.gov.in',
  'SSC': 'https://ssc.gov.in', // SSC migrated to ssc.gov.in
  'RRB': 'https://indianrailways.gov.in',
  'IBPS': 'https://ibps.in',
  'NTA': 'https://nta.ac.in',
  'DRDO': 'https://drdo.gov.in',
  'ISRO': 'https://www.isro.gov.in/Careers.html',
  'AIIMS': 'https://www.aiims.edu',
  
  // ── BANKING & FINANCE ──
  'SBI': 'https://sbi.co.in/web/careers',
  'RBI': 'https://opportunities.rbi.org.in',
  'NABARD': 'https://nabard.org',
  'LIC': 'https://licindia.in/Bottom-Links/careers',
  'EPFO': 'https://www.epfindia.gov.in',
  'ESIC': 'https://www.esic.gov.in/recruitments',
  
  // ── DEFENCE & FORCES ──
  'ARMY': 'https://joinindianarmy.nic.in',
  'NAVY': 'https://www.joinindiannavy.gov.in',
  'AIR FORCE': 'https://afcat.cdac.in',
  'COAST GUARD': 'https://joinindiancoastguard.cdac.in',
  'BSF': 'https://rectt.bsf.gov.in',
  'CRPF': 'https://rect.crpf.gov.in',
  'CISF': 'https://cisfrectt.cisf.gov.in',
  'ITBP': 'https://recruitment.itbpolice.nic.in',

  // ── PSUs (Public Sector Undertakings) ──
  'ONGC': 'https://ongcindia.com',
  'NTPC': 'https://careers.ntpc.co.in',
  'BHEL': 'https://careers.bhel.in',
  'HAL': 'https://hal-india.co.in/Career',
  'SAIL': 'https://sailcareers.com',
  'FCI': 'https://fci.gov.in/personnel.php',
  'AAI': 'https://www.aai.aero/en/careers/recruitment',

  // ── STATE PUBLIC SERVICE COMMISSIONS (PSCs) ──
  'APPSC': 'https://psc.ap.gov.in',            // Andhra Pradesh
  'APSC': 'https://apsc.nic.in',               // Assam
  'BPSC': 'https://bpsc.bih.nic.in',           // Bihar
  'CGPSC': 'https://psc.cg.gov.in',            // Chhattisgarh
  'GPSC': 'https://gpsc.gujarat.gov.in',       // Gujarat
  'HPSC': 'https://hpsc.gov.in',               // Haryana
  'HPPSC': 'https://hppsc.hp.gov.in',          // Himachal Pradesh
  'JKPSC': 'https://jkpsc.nic.in',             // Jammu & Kashmir
  'JPSC': 'https://jpsc.gov.in',               // Jharkhand
  'KPSC': 'https://kpsc.kar.nic.in',           // Karnataka
  'KERALA PSC': 'https://www.keralapsc.gov.in',// Kerala
  'MPPSC': 'https://mppsc.mp.gov.in',          // Madhya Pradesh
  'MPSC': 'https://mpsc.gov.in',               // Maharashtra
  'MPSC MANIPUR': 'https://mpscmanipur.gov.in',// Manipur
  'MPSC MEGHALAYA': 'https://mpsc.nic.in',     // Meghalaya
  'OPSC': 'https://opsc.gov.in',               // Odisha
  'PPSC': 'https://ppsc.gov.in',               // Punjab
  'RPSC': 'https://rpsc.rajasthan.gov.in',     // Rajasthan
  'SPSC': 'https://spsc.sikkim.gov.in',        // Sikkim
  'TNPSC': 'https://tnpsc.gov.in',             // Tamil Nadu
  'TGPSC': 'https://tgpsc.gov.in',             // Telangana (Recently renamed from TSPSC)
  'TSPSC': 'https://tgpsc.gov.in',             // Fallback for older Telangana notices
  'TPSC': 'https://tpsc.tripura.gov.in',       // Tripura
  'UPPSC': 'https://uppsc.up.nic.in',          // Uttar Pradesh
  'UKPSC': 'https://psc.uk.gov.in',            // Uttarakhand
  'WBPSC': 'https://psc.wb.gov.in'             // West Bengal
};

// Build feed URLs with multiple proxy strategies
function guBuildFeedUrls(raw, name) {
  var enc = encodeURIComponent(raw);
  return [
    { url: 'https://api.rss2json.com/v1/api.json?rss_url=' + enc + '&count=120', type: 'r2j', name: name },
    { url: 'https://api.codetabs.com/v1/proxy?quest=' + enc, type: 'xml', name: name },
    { url: 'https://api.allorigins.win/get?url=' + enc, type: 'allorigins', name: name },
    { url: 'https://corsproxy.io/?' + enc, type: 'xml', name: name },
    { url: 'https://thingproxy.freeboard.io/fetch/' + raw, type: 'xml', name: name }
  ];
}

var GU_RSS_FEEDS = GU_RAW_FEEDS.map(function(f){ return guBuildFeedUrls(f.raw, f.name)[0]; });

// Keyword-based auto type classifier
function guClassify(title) {
  var t = (title||'').toLowerCase();
  if (/admit card|hall ticket|call letter/.test(t))              return 'admitcard';
  if (/result|merit list|final list|selected|cut.?off/.test(t))  return 'result';
  if (/exam date|schedule|timetable|postponed|date sheet/.test(t)) return 'examdate';
  return 'vacancy';
}

function guExtractOrg(title) {
  var orgs = ['UPSC','SSC','RRB','IBPS','NTA','DRDO','SBI','RBI','NABARD','TNPSC',
    'UPPSC','MPSC','BPSC','RPSC','HPSC','UKPSC','JPSC','OPSC','KPSC','GPSC',
    'Army','Navy','Air Force','Police','Railway','High Court','Supreme Court',
    'ISRO','HAL','BHEL','ONGC','NTPC','NHM','AIIMS','ESIC','LIC','GIC'];
  for (var i=0; i<orgs.length; i++) {
    if ((title||'').toUpperCase().indexOf(orgs[i]) !== -1) return orgs[i];
  }
  return '';
}

function guExtractLastDate(text) {
  var match = (text||'').match(/(?:last date|apply till|deadline|closing date)[\s\:-]*(\d{1,2}[\/\-\s](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[a-z]+)[\/\-\s]?\d{2,4}|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i);
  if(match && match[1]) return match[1].trim();
  return null;
}

// Fallback data shown when all RSS feeds fail
var GU_FALLBACK = [
  { id:'f1', type:'vacancy',   title:'UPSC Civil Services 2025 – Notification Released (1078 Posts)', org:'UPSC', date:'2025-02-15', lastDate:'2025-03-10', link:'https://upsc.gov.in', tags:['UPSC','IAS'] },
  { id:'f2', type:'examdate',  title:'SSC CGL Tier-I 2025 Exam Dates Announced (Apr 14–27)', org:'SSC', date:'2025-02-20', examDate:'Apr 14–27, 2025', link:'https://ssc.nic.in', tags:['SSC','CGL'] },
  { id:'f3', type:'admitcard', title:'Railway RRB NTPC Admit Card 2025 Released', org:'RRB', date:'2025-02-22', link:'https://indianrailways.gov.in', tags:['RRB','NTPC'] },
  { id:'f4', type:'result',    title:'IBPS PO Mains 2024 Result Declared', org:'IBPS', date:'2025-02-18', link:'https://ibps.in', tags:['IBPS','PO'] },
  { id:'f5', type:'vacancy',   title:'DRDO Scientist B Recruitment 2025 (635 Posts)', org:'DRDO', date:'2025-02-10', lastDate:'2025-03-25', link:'https://drdo.gov.in', tags:['DRDO','Scientist'] },
  { id:'f6', type:'examdate',  title:'NEET UG 2025 Exam Date – May 4', org:'NTA', date:'2025-02-25', examDate:'May 4, 2025', link:'https://nta.ac.in', tags:['NTA','NEET'] },
  { id:'f7', type:'admitcard', title:'UPPSC PCS Prelims 2025 Admit Card Available', org:'UPPSC', date:'2025-02-28', link:'https://uppsc.up.nic.in', tags:['UPPSC','PCS'] },
  { id:'f8', type:'result',    title:'SBI PO Mains 2024-25 Final Result Out', org:'SBI', date:'2025-03-01', link:'https://sbi.co.in', tags:['SBI','PO'] },
  { id:'f9', type:'vacancy',   title:'NABARD Grade A & B Recruitment 2025 (102 Posts)', org:'NABARD', date:'2025-03-02', lastDate:'2025-04-01', link:'https://nabard.org', tags:['NABARD'] },
  { id:'f10',type:'vacancy',   title:'High Court Allahabad – Law Clerk (150 Posts)', org:'High Court', date:'2025-02-26', lastDate:'2025-03-28', link:'https://allahabadhighcourt.in', tags:['Judiciary'] }
];

// Parse raw XML string into GU entries
function guParseXml(xmlStr, feedName) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(xmlStr, 'text/xml');
  var items = Array.from(doc.querySelectorAll('item'));
  if (!items.length) throw new Error('No items in XML');
  return items.slice(0, 120).map(function(item, idx) { // Raised limit to 120
    var title = (item.querySelector('title')||{}).textContent || '';
    title = title.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
    var link  = (item.querySelector('link')||{}).textContent || (item.querySelector('guid')||{}).textContent || '#';
    var pub   = (item.querySelector('pubDate')||{}).textContent || '';
    var dateStr = pub ? new Date(pub).toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
    if (isNaN(new Date(dateStr))) dateStr = new Date().toISOString().slice(0,10);
    return {
      id: guStableId(title, feedName),
      type: guClassify(title),
      title: title,
      org: guExtractOrg(title) || feedName,
      date: dateStr,
      lastDate: guExtractLastDate(title), examDate: null,
      link: link.trim() || '#',
      tags: [guExtractOrg(title)].filter(Boolean),
      _rss: true
    };
  }).filter(function(e){ return e.title && e.title.length > 8; });
}

// Fetch one feed with all proxy strategies tried in order
async function guFetchFeed(primaryFeed) {
  var raw = GU_RAW_FEEDS.find(function(f){ return f.name === primaryFeed.name; });
  if (!raw) raw = { raw: '', name: primaryFeed.name };
  var strategies = guBuildFeedUrls(raw.raw, raw.name);

  for (var s = 0; s < strategies.length; s++) {
    var strategy = strategies[s];
    try {
      var res = await Promise.race([
        fetch(strategy.url, { cache: 'no-store' }),
        new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('Timeout')); }, 20000); })
      ]);
      if (!res.ok) continue;

      if (strategy.type === 'r2j') {
        var data = await res.json();
        if (data.status === 'ok' && data.items && data.items.length) {
          return data.items.slice(0, 120).map(function(item, idx) { // Raised limit to 120
            var title = (item.title||'').replace(/<[^>]+>/g,'').trim();
            return {
              id: guStableId(title, strategy.name),
              type: guClassify(title),
              title: title,
              org: guExtractOrg(title) || strategy.name,
              date: item.pubDate ? item.pubDate.slice(0,10) : new Date().toISOString().slice(0,10),
              lastDate: guExtractLastDate(title), examDate: null,
              link: item.link || item.url || '#',
              tags: [guExtractOrg(title)].filter(Boolean),
              _rss: true
            };
          }).filter(function(e){ return e.title.length > 8; });
        }
      } else if (strategy.type === 'allorigins') {
        var json = await res.json();
        if (json && json.contents) {
          return guParseXml(json.contents, strategy.name);
        }
      } else {
        var xmlText = await res.text();
        return guParseXml(xmlText, strategy.name);
      }
    } catch(e) { continue; }
  }
  throw new Error('All strategies failed for ' + primaryFeed.name);
}

// AI-powered data generation when all RSS fails
async function guFetchAI() {
  try {
    var today = new Date().toISOString().slice(0,10);
    var res = await Promise.race([
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: 'Generate 40 realistic Indian government job notifications for today (' + today + '). Return ONLY a JSON array, no markdown, no extra text. Each object must have exactly these fields: id (string), type (one of: vacancy/admitcard/examdate/result), title (string), org (string like UPSC/SSC/RRB/IBPS/NTA/DRDO/SBI/RBI/AIIMS/ISRO), date (YYYY-MM-DD near today), lastDate (YYYY-MM-DD or null), examDate (string or null), link (official URL), tags (array of strings). Mix all 4 types. Make titles realistic and specific with post counts.'
          }]
        })
      }),
      new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('AI Timeout')); }, 15000); })
    ]);
    if (!res.ok) throw new Error('AI API error');
    var aiData = await res.json();
    var text = (aiData.content||[]).map(function(c){ return c.text||''; }).join('');
    text = text.replace(/```json|```/g,'').trim();
    var entries = JSON.parse(text);
    if (!Array.isArray(entries) || !entries.length) throw new Error('Bad AI response');
    return entries.map(function(e, i){
      return {
        id: 'ai_'+i+'_'+Date.now(),
        type: ['vacancy','admitcard','examdate','result'].includes(e.type) ? e.type : 'vacancy',
        title: e.title || 'Government Notification',
        org: e.org || 'GOI',
        date: e.date || today,
        lastDate: e.lastDate || null,
        examDate: e.examDate || null,
        link: e.link || '#',
        tags: Array.isArray(e.tags) ? e.tags : [],
        _ai: true
      };
    });
  } catch(e) {
    return null;
  }
}

// ── Stable ID so "new" detection works across refreshes (title+source based, not time-based)
function guStableId(title, source) {
  var s = (title||'') + '|' + (source||'');
  var h = 0;
  for (var i=0; i<s.length; i++) { h = ((h<<5)-h) + s.charCodeAt(i); h |= 0; }
  return 'gu_' + Math.abs(h);
}

// ── Seen-entries tracking (for "NEW" badge)
function guGetSeenIds() { return Sv.get("gu_seen_ids") || []; }
function guMarkAllSeen(entries) {
  var ids = entries.map(function(e){ return e.id; });
  Sv.set("gu_seen_ids", ids.slice(0, 500)); // cap growth
  Sv.set("gu_last_visit", Date.now());
}
function guIsNew(entry, seenIds) {
  return seenIds.length > 0 && seenIds.indexOf(entry.id) === -1;
}

// ── Bookmarks for govt updates (separate namespace so it doesn't clash with quiz bookmarks)
function guGetBookmarks() { return Sv.get("gu_bookmarks") || []; }
function guIsBookmarked(entryId) { return guGetBookmarks().some(function(b){ return b.id === entryId; }); }
function guToggleBookmark(entry) {
  var bms = guGetBookmarks();
  var idx = bms.findIndex(function(b){ return b.id === entry.id; });
  if (idx >= 0) { bms.splice(idx,1); Sv.set("gu_bookmarks", bms); toast("Bookmark removed"); return false; }
  bms.push(entry); Sv.set("gu_bookmarks", bms); toast("Saved! ⭐"); return true;
}

// ── Days-left helper (also used for sort priority)
function guDaysLeft(lastDateStr) {
  if (!lastDateStr) return null;
  var cleanDateStr = lastDateStr.replace(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/, '$3-$2-$1');
  var parsedDate = new Date(cleanDateStr);
  if (isNaN(parsedDate)) return null;
  var diffMs = parsedDate - new Date();
  return Math.ceil(diffMs / (1000*60*60*24));
}

// ── Sort: closing-soon-and-still-open first, then new items, then by date desc
function guSortEntries(entries, seenIds) {
  return entries.slice().sort(function(a,b){
    var da = guDaysLeft(a.lastDate), db = guDaysLeft(b.lastDate);
    var aUrgent = da !== null && da >= 0 && da <= 5;
    var bUrgent = db !== null && db >= 0 && db <= 5;
    if (aUrgent && !bUrgent) return -1;
    if (bUrgent && !aUrgent) return 1;
    if (aUrgent && bUrgent) return da - db;

    var aNew = guIsNew(a, seenIds), bNew = guIsNew(b, seenIds);
    if (aNew && !bNew) return -1;
    if (bNew && !aNew) return 1;

    return (b.date||'') > (a.date||'') ? 1 : -1;
  });
}

// Cache for RSS results (persisted across sessions too)
var guRssCache = null;
var guLastFetch = 0;

function pgGovtUpdates(){
  var w = el("div",{cls:"fd"});
  w.appendChild(makeNav("govtupdates"));
  var wrap = el("div",{css:{maxWidth:"780px",margin:"0 auto"}});

  // Header
  var hd = el("div",{css:{textAlign:"center",marginBottom:"24px"}});
  hd.appendChild(el("div",{css:{fontSize:"2rem",marginBottom:"6px"},txt:"🔔"}));
  hd.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",letterSpacing:"-.02em",marginBottom:"4px"},txt:"Government Job Updates"}));
  hd.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:"Vacancies · Admit Cards · Exam Dates · Results — live from RSS"}));
  wrap.appendChild(hd);

  // Status bar (live indicator + compact toggle + refresh button)
  var statusBar = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"11px 18px",marginBottom:"18px",flexWrap:"wrap"}});
  var statusLeft = el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  var liveDot = el("div",{cls:"gu-live-dot"});
  var statusTxt = el("div",{css:{fontSize:".78rem",color:"var(--muted)"},txt:"Loading live updates..."});
  statusLeft.appendChild(liveDot);
  statusLeft.appendChild(statusTxt);
  statusBar.appendChild(statusLeft);

  var statusRight = el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  var compactMode = {v: Sv.get("gu_compact") || false};
  var compactBtn = el("button",{cls:"gu-fetch-btn",onclick:function(){
    compactMode.v = !compactMode.v;
    Sv.set("gu_compact", compactMode.v);
    compactBtn.textContent = compactMode.v ? "▤ Compact" : "▥ Cards";
    renderList();
  }},compactMode.v ? "▤ Compact" : "▥ Cards");
  var refreshBtn = el("button",{cls:"gu-fetch-btn",onclick:function(){
    guRssCache = null; guLastFetch = 0;
    Sv.set("gu_cache", null);
    go("govtupdates");
    toast("🔄 Refreshing...");
  }},"🔄 Refresh");
  statusRight.appendChild(compactBtn);
  statusRight.appendChild(refreshBtn);
  statusBar.appendChild(statusRight);
  wrap.appendChild(statusBar);

  // Search
  var searchBox = el("input",{cls:"gu-search",placeholder:"🔍  Search vacancies, exams, boards..."});

  // Tabs + list container
  var activeTab = {v:"all"};
  var showBookmarksOnly = {v:false};
  var listWrap = el("div",{});
  var allEntries = [];
  var seenIds = guGetSeenIds();

  // Stats bar (tap a stat to filter that category)
  var statsBar = el("div",{cls:"gu-stats-bar",css:{marginBottom:"18px",cursor:"pointer"}});
  wrap.appendChild(statsBar);

  function updateStats() {
    var counts = {vacancy:0,admitcard:0,examdate:0,result:0};
    var newCounts = {vacancy:0,admitcard:0,examdate:0,result:0};
    allEntries.forEach(function(e){
      if(counts[e.type]!==undefined) counts[e.type]++;
      if(newCounts[e.type]!==undefined && guIsNew(e, seenIds)) newCounts[e.type]++;
    });
    statsBar.innerHTML = '';
    [["vacancy","📋"],["admitcard","🪪"],["examdate","📅"],["result","🏆"]].forEach(function(r){
      var t = GU_TYPES[r[0]];
      var sc = el("div",{cls:"gu-stat",onclick:function(){
        activeTab.v = r[0];
        tabs.querySelectorAll(".gu-tab").forEach(function(b){ b.classList.remove("gu-active"); });
        var match = Array.from(tabs.querySelectorAll(".gu-tab")).find(function(b){ return b.dataset.type===r[0]; });
        if(match) match.classList.add("gu-active");
        renderList();
      }});
      sc.appendChild(el("div",{css:{fontSize:"1.1rem"}},r[1]));
      var numWrap = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}});
      numWrap.appendChild(el("div",{cls:"gu-stat-num",css:{color:t.color}},String(counts[r[0]])));
      if(newCounts[r[0]] > 0){
        numWrap.appendChild(el("span",{css:{fontSize:".62rem",fontWeight:"800",color:"#fff",background:"#ef4444",borderRadius:"99px",padding:"1px 6px"}},"+"+newCounts[r[0]]));
      }
      sc.appendChild(numWrap);
      sc.appendChild(el("div",{cls:"gu-stat-lbl"},t.label));
      statsBar.appendChild(sc);
    });
  }

  function renderList(){
    var q = searchBox.value.toLowerCase().trim();
    var filtered = allEntries.filter(function(e){
      var typeMatch = activeTab.v === "all" || e.type === activeTab.v;
      var bmMatch = !showBookmarksOnly.v || guIsBookmarked(e.id);
      var textMatch = !q ||
        (e.title||'').toLowerCase().indexOf(q) !== -1 ||
        (e.org||'').toLowerCase().indexOf(q) !== -1 ||
        (e.tags||[]).join(' ').toLowerCase().indexOf(q) !== -1;
      return typeMatch && textMatch && bmMatch;
    });
    filtered = guSortEntries(filtered, seenIds);

    listWrap.innerHTML = '';
    listWrap.className = compactMode.v ? 'gu-list-compact' : '';

    if(!filtered.length){
      var emp = el("div",{cls:"gu-empty"});
      emp.appendChild(el("div",{css:{fontSize:"2.5rem",marginBottom:"10px"}},showBookmarksOnly.v?'⭐':(activeTab.v!=='all'?(GU_TYPES[activeTab.v]||{icon:'📭'}).icon:'📭')));
      emp.appendChild(el("div",{css:{fontWeight:"600",marginBottom:"6px"}},showBookmarksOnly.v?'No saved updates yet':(q?'No results for "'+q+'"':'Nothing here yet')));
      emp.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)"}},showBookmarksOnly.v?'Tap ⭐ on any update to save it here':'Try another tab or refresh'));
      listWrap.appendChild(emp);
      return;
    }

    filtered.forEach(function(entry, idx){
      var t = GU_TYPES[entry.type] || GU_TYPES.vacancy;
      var isNewEntry = guIsNew(entry, seenIds);
      var daysLeft = guDaysLeft(entry.lastDate);
      var closingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 5;

      if (compactMode.v) {
        var row = el("div",{cls:"gu-row"});
        row.style.setProperty("--gu-color", t.color);
        var rowLeft = el("div",{css:{display:"flex",alignItems:"center",gap:"8px",flex:"1",minWidth:"0"}});
        rowLeft.appendChild(el("span",{},t.icon));
        if(isNewEntry) rowLeft.appendChild(el("span",{css:{fontSize:".6rem",fontWeight:"800",color:"#fff",background:"#ef4444",borderRadius:"4px",padding:"1px 5px"}},"NEW"));
        var targetLink = (entry.org && GU_OFFICIAL_LINKS[entry.org]) ? GU_OFFICIAL_LINKS[entry.org] : entry.link;
var rowTitle = el("a",{href:targetLink,target:"_blank",rel:"noopener",css:{color:"var(--fg)",textDecoration:"none",fontSize:".85rem",fontWeight:"600",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},entry.title);
        rowLeft.appendChild(rowTitle);
        row.appendChild(rowLeft);
        var rowRight = el("div",{css:{display:"flex",alignItems:"center",gap:"8px",fontSize:".72rem",color:"var(--muted)",flexShrink:"0"}});
        if(closingSoon) rowRight.appendChild(el("span",{css:{color:"#ef4444",fontWeight:"700"}},daysLeft===0?"Today!":daysLeft+"d left"));
        rowRight.appendChild(el("span",{},entry.org||''));
        (function(en){
          rowRight.appendChild(el("button",{cls:"gu-star-btn",onclick:function(ev){
            ev.preventDefault();
            var bm = guToggleBookmark(en);
            ev.currentTarget.textContent = bm ? "★" : "☆";
          }}, guIsBookmarked(en.id) ? "★" : "☆"));
        })(entry);
        row.appendChild(rowRight);
        listWrap.appendChild(row);
        return;
      }

      var card = el("div",{cls:"gu-card"});
      card.style.setProperty("--gu-color", t.color);
      card.style.animationDelay = (idx*30)+"ms";

      var topRow = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}});
      var badgeWrap = el("div",{css:{display:"flex",alignItems:"center",gap:"6px"}});
      var badge = el("span",{cls:"gu-badge"},t.icon+" "+t.label);
      badge.style.background = t.color+"20";
      badge.style.color = t.color;
      badgeWrap.appendChild(badge);
      if(isNewEntry) badgeWrap.appendChild(el("span",{css:{fontSize:".65rem",fontWeight:"800",color:"#fff",background:"#ef4444",borderRadius:"6px",padding:"2px 7px"}},"● NEW"));
      topRow.appendChild(badgeWrap);
      (function(en){
        topRow.appendChild(el("button",{cls:"gu-star-btn",css:{fontSize:"1.1rem"},onclick:function(){
          var bm = guToggleBookmark(en);
          starBtn.textContent = bm ? "★" : "☆";
        }},guIsBookmarked(en.id) ? "★" : "☆"));
      })(entry);
      var starBtn = topRow.lastChild;
      card.appendChild(topRow);

      card.appendChild(el("div",{cls:"gu-title",css:{marginTop:"8px"}},entry.title));

      var meta = el("div",{cls:"gu-meta"});
      if(entry.org)      meta.appendChild(el("span",{},"🏛 "+entry.org));
      if(entry.date)     meta.appendChild(el("span",{},"📅 "+entry.date));
      if(entry.lastDate) {
        if(closingSoon) {
          meta.appendChild(el("span",{css:{color:"#ef4444", fontWeight:"700", background:"rgba(239,68,68,0.15)", padding:"2px 8px", borderRadius:"6px"}},"🚨 Closing Soon: " + entry.lastDate + (daysLeft === 0 ? " (Today!)" : " (" + daysLeft + " days left)")));
        } else {
          meta.appendChild(el("span",{css:{color:"#f87171"}},"⏰ Last Date: "+entry.lastDate));
        }
      }
      if(entry.examDate) meta.appendChild(el("span",{css:{color:"#f59e0b"}},"📝 Exam: "+entry.examDate));
      card.appendChild(meta);

      if(entry.tags && entry.tags.length){
        var tagWrap = el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}});
        entry.tags.filter(Boolean).forEach(function(tag){
          tagWrap.appendChild(el("span",{css:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"99px",padding:"2px 9px",fontSize:".68rem",color:"var(--muted)",fontWeight:"600"}},tag));
        });
        card.appendChild(tagWrap);
      }

      var foot = el("div", {css: {display: "flex", alignItems: "center", justifyContent: "space-between"}});
var linksWrap = el("div", {css: {display: "flex", gap: "12px", alignItems: "center"}});

// 1. Always provide the third-party "Details" link (from the RSS feed)
if (entry.link) {
  linksWrap.appendChild(el("a", {
    cls: "gu-link", 
    href: entry.link, 
    target: "_blank", 
    rel: "noopener", 
    css: {color: t.color}
  }, "📝 Details ↗"));
}

// 2. Add the Official Site link right next to it (if we have it)
if (entry.org && GU_OFFICIAL_LINKS[entry.org]) {
  linksWrap.appendChild(el("a", {
    cls: "gu-link", 
    href: GU_OFFICIAL_LINKS[entry.org], 
    target: "_blank", 
    rel: "noopener", 
    css: {color: "var(--fg)", opacity: "0.8"} // Slightly different color so they stand apart
  }, "🏛 Official Site ↗"));
}

foot.appendChild(linksWrap);

// Keep your existing AI/User tags logic here
if (entry._ai) {
  foot.appendChild(el("span", {css: {fontSize: ".65rem", color: "#8b5cf6", fontWeight: "600", background: "rgba(139,92,246,0.12)", padding: "2px 8px", borderRadius: "6px"}}, "🤖 AI"));
}
if (entry._user) {
  (function(eid) {
    foot.appendChild(el("button", {cls: "btng", css: {fontSize: ".72rem", padding: "4px 10px"}, onclick: function() {
      var s = Sv.get("gu_entries") || [];
      Sv.set("gu_entries", s.filter(function(x) { return x.id !== eid; }));
      go("govtupdates");
      toast("Entry removed");
    }}, "✕ Remove"));
  })(entry.id);
}

card.appendChild(foot);
      if(entry._ai){
        foot.appendChild(el("span",{css:{fontSize:".65rem",color:"#8b5cf6",fontWeight:"600",background:"rgba(139,92,246,0.12)",padding:"2px 8px",borderRadius:"6px"}},"🤖 AI"));
      }
      if(entry._user){
        (function(eid){
          foot.appendChild(el("button",{cls:"btng",css:{fontSize:".72rem",padding:"4px 10px"},onclick:function(){
            var s = Sv.get("gu_entries")||[];
            Sv.set("gu_entries", s.filter(function(x){ return x.id!==eid; }));
            go("govtupdates");
            toast("Entry removed");
          }},"✕ Remove"));
        })(entry.id);
      }
      card.appendChild(foot);
      listWrap.appendChild(card);
    });
    setTimeout(function(){ triggerReveal(listWrap); }, 10);
  }

  // Tabs (+ bookmarks filter chip)
  var tabs = el("div",{cls:"gu-tabs"});
  [["all","🔔 All"],["vacancy","📋 Vacancy"],["admitcard","🪪 Admit Card"],["examdate","📅 Exam Date"],["result","🏆 Result"]].forEach(function(td){
    var tb = el("button",{cls:"gu-tab"+(activeTab.v===td[0]?" gu-active":""),onclick:function(){
      activeTab.v = td[0];
      tabs.querySelectorAll(".gu-tab").forEach(function(b){ b.classList.remove("gu-active"); });
      tb.classList.add("gu-active");
      renderList();
    }},td[1]);
    tb.dataset.type = td[0];
    tabs.appendChild(tb);
  });
  var bmTab = el("button",{cls:"gu-tab",onclick:function(){
    showBookmarksOnly.v = !showBookmarksOnly.v;
    bmTab.classList.toggle("gu-active", showBookmarksOnly.v);
    renderList();
  }},"⭐ Saved");
  tabs.appendChild(bmTab);

  searchBox.addEventListener("input", renderList);

  wrap.appendChild(searchBox);
  wrap.appendChild(tabs);

  // Loading skeleton
  var skeleton = el("div",{css:{display:"flex",flexDirection:"column",gap:"14px",paddingTop:"10px"}});
  skeleton.innerHTML = Array(4).fill(
    '<div class="gu-card skeleton-box" style="height:120px;border-color:transparent;box-shadow:none;">' +
      '<div class="skeleton-box" style="height:22px;width:30%;border-radius:6px;margin-bottom:14px;background:var(--bg)!important"></div>' +
      '<div class="skeleton-box" style="height:16px;width:85%;border-radius:4px;margin-bottom:10px;background:var(--bg)!important"></div>' +
      '<div class="skeleton-box" style="height:16px;width:60%;border-radius:4px;background:var(--bg)!important"></div>' +
    '</div>'
  ).join('');
  wrap.appendChild(skeleton);
  wrap.appendChild(listWrap);

  // ── Fetch Live Government Updates ──
  (async function(){
    var persistedCache = Sv.get("gu_cache");
    var persistedFetchTime = Sv.get("gu_cache_time") || 0;
    if(!guRssCache && persistedCache && (Date.now()-persistedFetchTime) < 600000){
      guRssCache = persistedCache;
      guLastFetch = persistedFetchTime;
    }

    if(guRssCache && (Date.now()-guLastFetch) < 600000){
      allEntries = guRssCache;
      skeleton.style.display = 'none';
      updateStats();
      renderList();
      statusTxt.textContent = '✅ Cached — '+allEntries.length+' updates loaded';
      guMarkAllSeen(allEntries);
      return;
    }

    skeleton.innerHTML = '<div class="ca-spinner" style="margin:0 auto 12px"></div>Fetching live govt updates...';

    var stored = Sv.get("gu_entries") || [];

    var fetchPromises = GU_RSS_FEEDS.map(function(feed){
      return Promise.race([
        guFetchFeed(feed),
        new Promise(function(_, reject) {
          setTimeout(function(){ reject(new Error('timeout')); }, 20000);
        })
      ]).catch(function(){ return []; });
    });

    var results = await Promise.allSettled(fetchPromises);
    var fetchedEntries = [];
    results.forEach(function(r){
      if(r.status === 'fulfilled' && Array.isArray(r.value)){
        fetchedEntries = fetchedEntries.concat(r.value);
      }
    });

    var usedFallback = false;
    var oldCache = Sv.get("gu_cache") || [];
    var usedFallback = false;

    // If we fetched ANY new items, OR if we already have items in our cache:
    if (fetchedEntries.length > 0 || oldCache.length > 0) {
      
      // Combine new live entries + old cached entries + user entries
      var combined = fetchedEntries.concat(oldCache).concat(stored);
      
      var seen = {};
      var finalEntries = [];
      
      // Deduplicate (so we don't show the same job twice)
      for(var i = 0; i < combined.length; i++) {
        var e = combined[i];
        var key = (e.title || '').slice(0, 50).toLowerCase();
        if(!seen[key]) {
          seen[key] = true;
          finalEntries.push(e);
        }
      }
      
      // Sort by date (newest first)
      finalEntries.sort(function(a,b){ return (b.date||'') > (a.date||'') ? 1 : -1; });
      
      // Cap it at 150 total items
      allEntries = finalEntries.slice(0, 150);
      
      if (fetchedEntries.length > 0) {
        statusTxt.textContent = '● Live — ' + allEntries.length + ' updates available';
        liveDot.style.background = '#4ade80'; // Green dot
      } else {
        // The fetch failed (network drop/proxy block), but we kept the cache!
        statusTxt.textContent = '✅ Cached — ' + allEntries.length + ' updates available';
        liveDot.style.background = '#f59e0b'; // Yellow/Orange dot
      }
      
    } else {
      // ONLY trigger the hardcoded 10-item fallback if both the fetch AND the cache are completely empty
      usedFallback = true;
      allEntries = stored.concat(GU_FALLBACK);
      statusTxt.textContent = '📋 Offline Mode — ' + GU_FALLBACK.length + ' curated updates';
      liveDot.style.background = '#f59e0b';
    }

    // Save our hard work to the cache for next time
    guRssCache = allEntries;
    guLastFetch = Date.now();
    Sv.set("gu_cache", allEntries);
    Sv.set("gu_cache_time", guLastFetch);

    if (usedFallback) {
      var banner = el("div",{css:{background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",fontSize:".78rem",color:"#f59e0b",fontWeight:"600"}},"⚠️ Live feed unavailable right now — showing curated updates instead.");
      wrap.insertBefore(banner, statsBar);
    }

    skeleton.style.display = 'none';
    updateStats();
    renderList();
    guMarkAllSeen(allEntries);
  })();

  w.appendChild(wrap);
  return w;
}

// --- BOOKMARK HELPERS (quiz/study bookmarks — unchanged, separate from gu_bookmarks) ---
function getBookmarks(subj) { return Sv.get("bm_"+subj) || []; }
function isBookmarked(subj, qText) { return getBookmarks(subj).some(function(b){ return b.q === qText; }); }
function toggleBookmark(subj, qObj) {
  var bms = getBookmarks(subj);
  var idx = bms.findIndex(function(b){ return b.q === qObj.q; });
  var isBm = false;
  if (idx >= 0) { bms.splice(idx, 1); toast("Bookmark removed"); }
  else { bms.push(qObj); toast("Saved to Bookmarks! ⭐"); isBm = true; }
  Sv.set("bm_"+subj, bms);
  return isBm;
}
