var V='v7',C='math-'+V,IMG=[];for(var p=1;p<=4;p++)for(var n=1;n<=3;n++)['r1','r2','r3','t1','t2','t3'].forEach(function(e){IMG.push('img/'+e+'/p'+p+'-'+n+'.webp')});
var CORE=['./','index.html','style.css?v=7','kanji.js?v=7','problems.js?v=7','manga.js?v=7','app.js?v=7','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(CORE.concat(IMG).map(function(u){return new Request(u,{cache:'reload'})}))}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;
 var u=new URL(r.url);if(u.origin!==location.origin)return;
 if(/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(u.pathname)){
  e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)});return res})}));return}
 // HTML/JS/CSS/manifest: ネットワーク優先、オフライン時はキャッシュ
 e.respondWith(fetch(r,{cache:'no-store'}).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res})
  .catch(function(){return caches.match(r).then(function(m){return m||caches.match(r,{ignoreSearch:true})||caches.match('index.html')}).then(function(m){return m||caches.match('index.html')})}));
});
