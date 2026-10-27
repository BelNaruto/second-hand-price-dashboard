// Tiny proxy so your RapidAPI key never reaches the browser. Node 18+, zero dependencies.
const http = require('http');
const fs = require('fs');
const KEY = process.env.RAPIDAPI_KEY;
const HOST = process.env.RAPIDAPI_HOST || 'classifieds-listings-api.p.rapidapi.com';
if (!KEY) { console.error('Set RAPIDAPI_KEY (see .env.example)'); process.exit(1); }

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/') { res.setHeader('content-type', 'text/html'); return res.end(fs.readFileSync(__dirname + '/index.html')); }
  if (u.pathname === '/compare' || u.pathname === '/cheapest') {
    const path = u.pathname === '/compare' ? '/api/search/compare' : '/api/search/cheapest';
    const r = await fetch(`https://${HOST}${path}${u.search}`, { headers: { 'X-RapidAPI-Key': KEY, 'X-RapidAPI-Host': HOST } });
    res.statusCode = r.status; res.setHeader('content-type', 'application/json');
    return res.end(await r.text());
  }
  res.statusCode = 404; res.end('not found');
}).listen(process.env.PORT || 3000, () => console.log('http://localhost:' + (process.env.PORT || 3000)));
