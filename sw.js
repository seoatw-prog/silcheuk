/* 오프라인 동작: 앱 파일을 휴대폰에 보관해 두고, 인터넷이 없으면 보관본으로 연다 */
const VERSION = "silcheuk-57e2f4ec72";
const FILES = ["./", "index.html", "jszip.min.js", "xlsx.full.min.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if(req.mode === "navigate"){
    e.respondWith(caches.match("index.html").then(r => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req)));
});
