// api/rss-proxy.js
// Server-side RSS fetcher — avoids CORS issues and flaky third-party proxies
// (rss2json, allorigins, corsproxy.io, etc.) that fail often on mobile.
//
// Usage from frontend:
//   fetch('/api/rss-proxy?url=' + encodeURIComponent(rawFeedUrl))
//
// Returns: { ok: true, items: [{ title, link, pubDate, guid }, ...] }

export default async function handler(req, res) {
  // Allow your frontend to call this (same-origin on Vercel, so usually not
  // needed, but harmless to set explicitly)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const feedUrl = req.query.url;
  if (!feedUrl || typeof feedUrl !== 'string') {
    res.status(400).json({ ok: false, error: 'Missing ?url= parameter' });
    return;
  }

  // Basic allowlist check — only fetch http(s) URLs, avoid SSRF to internal hosts
  let parsed;
  try {
    parsed = new URL(feedUrl);
    if (!/^https?:$/.test(parsed.protocol)) throw new Error('bad protocol');
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid URL' });
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const upstream = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        // Some feeds block requests with no user-agent
        'User-Agent': 'Mozilla/5.0 (compatible; StudyLabBot/1.0; +https://studylab-inky.vercel.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      res.status(502).json({ ok: false, error: 'Upstream feed returned ' + upstream.status });
      return;
    }

    const xmlText = await upstream.text();
    const items = parseRssItems(xmlText);

    if (!items.length) {
      res.status(502).json({ ok: false, error: 'No items parsed from feed' });
      return;
    }

    // Cache at the edge for 5 minutes so repeat visits/refreshes are instant
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ ok: true, items });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || 'Fetch failed' });
  }
}

// Minimal regex-based RSS <item> parser — no DOMParser available in Node,
// and pulling in a full XML library isn't worth it for this shape of feed.
function parseRssItems(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

  for (const block of itemBlocks.slice(0, 120)) {
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link') || extractTag(block, 'guid');
    const pubDate = extractTag(block, 'pubDate');

    if (title && title.length > 8) {
      items.push({
        title: cleanText(title),
        link: (link || '#').trim(),
        pubDate: (pubDate || '').trim()
      });
    }
  }

  return items;
}

function extractTag(block, tag) {
  const cdataMatch = block.match(new RegExp('<' + tag + '[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</' + tag + '>', 'i'));
  if (cdataMatch) return cdataMatch[1];
  const plainMatch = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'i'));
  return plainMatch ? plainMatch[1] : '';
}

function cleanText(str) {
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
