// 离线缓存（自动生成：_tools/build-pwa.mjs）。只缓存本网站自己的文件；不缓存任何第三方内容。
const VERSION = "31759b395f", CORE_CACHE = "europa-core-" + VERSION, IMG_CACHE = "europa-img-008e05002f";
const CORE = ["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
const IMAGES = ["img/bcn-batllo.jpg","img/bcn-boqueria.jpg","img/bcn-bunkers.jpg","img/bcn-gotic.jpg","img/bcn-gracia.jpg","img/bcn-guell.jpg","img/bcn-mnac.jpg","img/bcn-montjuic.jpg","img/bcn-palau.jpg","img/bcn-pedrera.jpg","img/bcn-sagrada.jpg","img/bcn-santpau.jpg","img/bcn-tibidabo.jpg","img/ch-blausee.jpg","img/ch-eigergletscher.jpg","img/ch-first.jpg","img/ch-gornergrat.jpg","img/ch-grindelwald.jpg","img/ch-jungfraujoch.jpg","img/ch-kapellbruecke.jpg","img/ch-kleinescheidegg.jpg","img/ch-lakeluzern.jpg","img/ch-lakezurich.jpg","img/ch-lauterbrunnen.jpg","img/ch-lindenhof.jpg","img/ch-lindt.jpg","img/ch-maennlichen.jpg","img/ch-mgp.jpg","img/ch-muerren.jpg","img/ch-oeschinensee.jpg","img/ch-pilatus.jpg","img/ch-rhinefalls.jpg","img/ch-riffelsee.jpg","img/ch-rigi.jpg","img/ch-schilthorn.jpg","img/ch-schwarzsee.jpg","img/ch-staubbach.jpg","img/ch-sunnegga.jpg","img/ch-uetliberg.jpg","img/ch-wengen.jpg","img/ch-zermatt.jpg","img/ch-zurichold.jpg","img/cover-ch.jpg","img/par-alexandre.jpg","img/par-arc.jpg","img/par-champs.jpg","img/par-cruise.jpg","img/par-eiffel.jpg","img/par-louvre.jpg","img/par-notredame.jpg","img/par-orsay.jpg","img/par-sacrecoeur.jpg","img/par-saintechapelle.jpg","img/par-seine.jpg","img/par-trocadero.jpg","img/par-tuileries.jpg"];
self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CORE_CACHE);
    await c.addAll(CORE.map(u => new Request(u, { cache: "reload" })));          // 页面本体必须全部成功
    const ic = await caches.open(IMG_CACHE);
    await Promise.all(IMAGES.map(async u => { if (await ic.match(u)) return; try { const r = await fetch(new Request(u, { cache: "reload" })); if (r.ok) await ic.put(u, r); } catch (err) {} }));
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("europa-") && k !== CORE_CACHE && k !== IMG_CACHE) await caches.delete(k);   // 只删旧缓存，不碰用户数据
    await self.clients.claim();
    for (const c of await self.clients.matchAll({ includeUncontrolled: true })) c.postMessage("cached");
  })());
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== self.location.origin) return;       // 外部链接（地图、购票）不经过缓存
  if (req.mode === "navigate") {                                                       // 页面：先用缓存（离线 / 打不开 GitHub 也能启动），新版本由更新提示切换
    e.respondWith((async () => (await (await caches.open(CORE_CACHE)).match("index.html")) || fetch(req))());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true }); if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && url.pathname.includes("/img/")) (await caches.open(IMG_CACHE)).put(req, res.clone());
    return res;
  })());
});
