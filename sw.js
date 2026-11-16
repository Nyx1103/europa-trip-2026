// 离线缓存（自动生成：_tools/build-pwa.mjs）。只缓存本网站自己的文件；不缓存任何第三方内容。
const VERSION = "72a36ad7f7", CORE_CACHE = "europa-core-" + VERSION, IMG_CACHE = "europa-img-008e05002f";
const CORE = ["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install", e => {      // 只缓存页面本体：很快完成
  e.waitUntil(caches.open(CORE_CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: "reload" })))));
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("europa-") && k !== CORE_CACHE && k !== IMG_CACHE) await caches.delete(k);   // 只删旧缓存，不碰用户数据
    await self.clients.claim();
  })());
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== self.location.origin) return;       // 外部链接（地图、购票）不经过缓存
  if (req.mode === "navigate") {                                                       // 页面：先用缓存（离线 / 打不开 GitHub 也能启动），新版本由更新提示切换
    e.respondWith((async () => {
      const page = (await (await caches.open(CORE_CACHE)).match("index.html")) || (await caches.match("index.html"));
      return page || fetch(req);
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true }); if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && url.pathname.includes("/img/")) (await caches.open(IMG_CACHE)).put(req, res.clone());
    return res;
  })());
});
