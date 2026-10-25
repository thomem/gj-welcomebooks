/* GJ Welcome Books — photo du livret dessinée directement sur un canvas (sans html2canvas, marche sur Safari/iPhone).
   WBPhoto.draw(data, {img:'chemin/img/', credit:[...]}) -> Promise<canvas> */
(function (g) {
  var S = 2, W = 390;                       // échelle et largeur d'une page (en px CSS)
  var DISP = '"Cormorant Garamond", Georgia, serif', BODY = 'Karla, "Helvetica Neue", Arial, sans-serif';
  var CREAM = '#FBF7F0', LINE = '#E4D7C2', INK = '#2C2A27', MUTED = '#625D55';

  function lines(s) { return String(s || '').split(/\n+/).map(function (x) { return x.replace(/^\s*[-•*\d.)]+\s*/, '').trim(); }).filter(Boolean); }
  function font(x, w, size, fam, it) { x.font = (it ? 'italic ' : '') + w + ' ' + size + 'px ' + fam; }
  function wrap(x, text, maxW) {
    var out = [], words = String(text || '').split(/\s+/), cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (x.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t;
    });
    if (cur) out.push(cur);
    return out;
  }
  function rr(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function spaced(x, text, px, py, sp) { for (var i = 0; i < text.length; i++) { x.fillText(text[i], px, py); px += x.measureText(text[i]).width + sp; } }

  // Mesure + dessin d'un bloc : chaque bloc renvoie sa hauteur ; si draw=false on mesure seulement
  function block(x, b, y, th, draw) {
    var L = 16, IW = W - 2 * L, h = 0;
    if (b.t === 'h') {
      font(x, 500, 26, DISP); var ls = wrap(x, b.text, IW);
      if (draw) { x.fillStyle = th[0]; ls.forEach(function (l, i) { x.fillText(l, L + 2, y + 26 + i * 29); }); }
      return 10 + ls.length * 29 + 4;
    }
    if (b.t === 'card' || b.t === 'dark' || b.t === 'wifi') {
      var pad = 16, tw = IW - 2 * pad - (b.t === 'wifi' ? 60 : 0), parts = [];
      if (b.k) parts.push({f: [700, 10, BODY], c: b.t === 'dark' ? th[2] : th[1], txt: [b.k.toUpperCase()], lh: 16, sp: 2});
      if (b.title) { font(x, 500, 22, DISP); parts.push({f: [500, 22, DISP], c: b.t === 'dark' ? '#fff' : th[0], txt: wrap(x, b.title, tw), lh: 26}); }
      if (b.text) { font(x, 400, 14.5, BODY); parts.push({f: [400, 14.5, BODY], c: b.t === 'dark' ? '#fff' : INK, txt: wrap(x, b.text, tw), lh: 21}); }
      if (b.small) { font(x, 400, 13, BODY); parts.push({f: [400, 13, BODY], c: MUTED, txt: wrap(x, b.small, tw), lh: 19}); }
      h = pad * 2 + parts.reduce(function (a, p) { return a + p.txt.length * p.lh + 4; }, 0);
      if (draw) {
        rr(x, L, y, IW, h, 16);
        x.fillStyle = b.t === 'dark' ? th[0] : (b.t === 'wifi' ? '#DDE5DF' : '#fff'); x.fill();
        if (b.t !== 'dark') { x.strokeStyle = b.t === 'wifi' ? '#C3CFC6' : LINE; x.lineWidth = 1; x.stroke(); }
        var cx = L + pad + (b.t === 'wifi' ? 60 : 0), cy = y + pad;
        if (b.t === 'wifi') { x.fillStyle = th[0]; x.beginPath(); x.arc(L + pad + 23, y + h / 2, 23, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2.2; x.lineCap = 'round';
          [14, 9, 4].forEach(function (r) { x.beginPath(); x.arc(L + pad + 23, y + h / 2 + 7, r, Math.PI * 1.22, Math.PI * 1.78); x.stroke(); }); }
        parts.forEach(function (p) {
          font(x, p.f[0], p.f[1], p.f[2]); x.fillStyle = p.c;
          p.txt.forEach(function (l) { cy += p.lh; if (p.sp) spaced(x, l, cx, cy - 4, p.sp); else x.fillText(l, cx, cy - 5); });
          cy += 4;
        });
      }
      return h + 10;
    }
    if (b.t === 'row') {
      var cw = (IW - 10) / 2, hs = b.items.map(function (c) {
        font(x, 500, 22, DISP); var a = wrap(x, c.title, cw - 28); font(x, 400, 13, BODY); var s = wrap(x, c.small, cw - 28);
        return {c: c, a: a, s: s, h: 32 + 16 + a.length * 26 + s.length * 19 + 4};
      });
      h = Math.max.apply(null, hs.map(function (q) { return q.h; }));
      if (draw) hs.forEach(function (q, i) {
        var px = L + i * (cw + 10); rr(x, px, y, cw, h, 16); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = LINE; x.lineWidth = 1; x.stroke();
        var cy = y + 16; font(x, 700, 10, BODY); x.fillStyle = th[1]; spaced(x, (q.c.k || '').toUpperCase(), px + 14, cy + 12, 2); cy += 16;
        font(x, 500, 22, DISP); x.fillStyle = th[0]; q.a.forEach(function (l) { cy += 26; x.fillText(l, px + 14, cy - 5); });
        font(x, 400, 13, BODY); x.fillStyle = MUTED; q.s.forEach(function (l) { cy += 19; x.fillText(l, px + 14, cy - 4); });
      });
      return h + 10;
    }
    if (b.t === 'list' || b.t === 'steps') {
      font(x, 400, 14.5, BODY); var ind = b.t === 'steps' ? 40 : 18, cy = y + 4;
      b.items.forEach(function (it, i) {
        var ls = wrap(x, it, IW - ind - 4);
        if (draw) {
          if (b.t === 'steps') { x.fillStyle = th[0]; x.beginPath(); x.arc(L + 14, cy + 13, 14, 0, 7); x.fill(); font(x, 700, 13, BODY); x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(String(i + 1), L + 14, cy + 18); x.textAlign = 'left'; font(x, 400, 14.5, BODY); }
          else { x.fillStyle = th[1]; x.beginPath(); x.arc(L + 5, cy + 11, 3.5, 0, 7); x.fill(); }
          x.fillStyle = INK; ls.forEach(function (l, j) { x.fillText(l, L + ind, cy + 17 + j * 21); });
        }
        cy += Math.max(b.t === 'steps' ? 30 : 0, ls.length * 21) + 8;
      });
      return cy - y + 4;
    }
    if (b.t === 'tel') {
      font(x, 400, 14.5, BODY); var lw = x.measureText(b.label).width; font(x, 700, 15, BODY); var vs = wrap(x, b.value, IW - 40 - lw - 16);
      h = 28 + vs.length * 20;
      if (draw) { rr(x, L, y, IW, h, 16); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = LINE; x.stroke();
        font(x, 400, 14.5, BODY); x.fillStyle = INK; x.fillText(b.label, L + 16, y + 30);
        font(x, 700, 15, BODY); x.fillStyle = th[0]; x.textAlign = 'right'; vs.forEach(function (l, j) { x.fillText(l, L + IW - 16, y + 30 + j * 20); }); x.textAlign = 'left'; }
      return h + 10;
    }
    if (b.t === 'credit') {
      font(x, 400, 12.5, BODY); var cl = [];
      b.items.slice(1).forEach(function (s) { cl = cl.concat(wrap(x, s, IW - 32)); });
      h = 28 + 24 + cl.length * 18;
      if (draw) { rr(x, L, y + 4, IW, h, 14); x.fillStyle = th[0]; x.fill(); x.textAlign = 'center';
        font(x, 500, 19, DISP); x.fillStyle = th[2]; x.fillText(b.items[0], W / 2, y + 34);
        font(x, 400, 12.5, BODY); x.fillStyle = '#fff'; cl.forEach(function (l, j) { x.fillText(l, W / 2, y + 56 + j * 18); }); x.textAlign = 'left'; }
      return h + 26;
    }
    return 0;
  }

  function hero(x, y, p, th, tile, draw) {
    var L = 20, IW = W - 40, h = 34;
    font(x, 500, p.big ? 40 : 38, DISP); var t1 = wrap(x, p.title, IW), t2 = p.em ? wrap(x, p.em, IW) : [];
    font(x, 400, 14.5, BODY); var lead = p.lead ? wrap(x, p.lead, IW - 20) : [];
    h += (p.k ? 18 : 0) + 8 + (t1.length + t2.length) * (p.big ? 42 : 40) + (lead.length ? 12 + lead.length * 22 : 0) + (p.hosts ? 72 : 0) + (p.big ? 34 : 46);
    if (!draw) return h;
    x.save(); x.beginPath(); x.rect(0, y, W, h); x.clip();
    x.fillStyle = th[0]; x.fillRect(0, y, W, h);
    if (tile) { for (var ty = y; ty < y + h; ty += 130) for (var tx = 0; tx < W; tx += 130) x.drawImage(tile, tx, ty, 130, 130); }
    x.fillStyle = 'rgba(10,20,35,.45)'; x.fillRect(0, y, W, h); x.restore();
    var cy = y + 34;
    if (p.k) { font(x, 700, 10.5, BODY); x.fillStyle = '#fff'; spaced(x, p.k.toUpperCase(), L, cy + 10, 2.5); cy += 18; }
    cy += 8; font(x, 500, p.big ? 40 : 38, DISP); x.fillStyle = '#fff';
    t1.forEach(function (l) { cy += p.big ? 42 : 40; x.fillText(l, L, cy - 8); });
    font(x, 500, 40, DISP, true); x.fillStyle = th[2]; t2.forEach(function (l) { cy += 42; x.fillText(l, L, cy - 8); });
    if (lead.length) { cy += 12; font(x, 400, 14.5, BODY); x.fillStyle = '#fff'; lead.forEach(function (l) { cy += 22; x.fillText(l, L, cy - 5); }); }
    if (p.hosts) { cy += 30; font(x, 700, 10.5, BODY); x.fillStyle = th[2]; spaced(x, p.hostsK.toUpperCase(), L, cy + 8, 2.5); font(x, 500, 25, DISP); x.fillStyle = '#fff'; x.fillText(p.hosts, L, cy + 40); }
    if (!p.big) { x.fillStyle = CREAM; for (var sx = 0; sx < W + 32; sx += 64) { x.beginPath(); x.arc(sx + 32, y + h + 18, 20, Math.PI, 0); x.fill(); } }
    return h;
  }

  function pages(d, t, o) {
    var hosts = (d.hosts || []).filter(function (h) { return h && (h.name || h.phone); });
    var hn = hosts.map(function (h) { return h.name; }).filter(Boolean).join(' & '), P = [];
    var home = [];
    if (d.wifiName) home.push({t: 'wifi', title: t.wifi, small: d.wifiName + ' · ' + t.connect});
    if (hosts.length) home.push(hosts.length > 1 ? {t: 'row', items: hosts.slice(0, 2).map(function (h) { return {k: t.call, title: h.name || t.call, small: h.phone}; })} : {t: 'card', k: t.call, title: hosts[0].name, small: hosts[0].phone});
    if (d.address) home.push({t: 'card', k: t.address, title: d.address.split(',')[0], small: d.address.split(',').slice(1).join(',').trim() + ' · ' + t.maps});
    [1, 2, 3].forEach(function (i) { home.push({t: 'card', k: t.chap + ' 0' + i, title: t.t[i]}); });
    P.push({hero: {big: true, k: d.place, title: t.welcome, em: d.name || 'Casa', lead: d.intro, hosts: hn, hostsK: t.hosts}, blocks: home});
    var ar = [{t: 'row', items: [{k: t.checkin, title: d.checkin || '—', small: t.from}, {k: t.checkout, title: d.checkout || '—', small: t.before}]}];
    if (lines(d.checkinSteps).length) ar.push({t: 'h', text: t.how}, {t: 'steps', items: lines(d.checkinSteps)});
    if (d.keys) ar.push({t: 'dark', k: t.keys, text: d.keys});
    if (d.parking) ar.push({t: 'card', k: t.parking, text: d.parking});
    if (lines(d.checkoutSteps).length) ar.push({t: 'h', text: t.leave}, {t: 'list', items: lines(d.checkoutSteps)});
    P.push({hero: {k: t.chap + ' 01', title: t.t[1], lead: t.arriveLead}, blocks: ar});
    var pl = [], places = (d.places || []).filter(function (p) { return p && p.name; });
    ['resto', 'plage', 'courses', 'voir', 'activ', 'autre'].forEach(function (c) {
      var g2 = places.filter(function (p) { return (p.cat || 'autre') === c; });
      if (!g2.length) return; pl.push({t: 'h', text: t.cats[c]});
      g2.forEach(function (p) { pl.push({t: 'card', title: p.name, text: p.note, small: t.go}); });
    });
    P.push({hero: {k: t.chap + ' 02', title: t.t[2], lead: t.placesLead}, blocks: pl});
    var inf = [];
    if (lines(d.rules).length) inf.push({t: 'h', text: t.rules}, {t: 'list', items: lines(d.rules)});
    if (d.trash) inf.push({t: 'h', text: t.trash}, {t: 'card', text: d.trash});
    inf.push({t: 'h', text: t.emergency}, {t: 'tel', label: t.eu, value: d.emergency || '112'});
    if (d.doctor) inf.push({t: 'tel', label: t.doctor, value: d.doctor});
    if (d.pharmacy) inf.push({t: 'tel', label: t.pharmacy, value: d.pharmacy});
    hosts.forEach(function (h) { if (h.phone) inf.push({t: 'tel', label: h.name || t.hosts, value: h.phone}); });
    P.push({hero: {k: t.chap + ' 03', title: t.t[3], lead: t.infoLead}, blocks: inf});
    P.forEach(function (p) { if (o.credit) p.blocks.push({t: 'credit', items: o.credit}); });
    return P;
  }

  function drawPage(pg, d, th, tile, t, name) {
    var m = document.createElement('canvas').getContext('2d'), y = 56;
    y += hero(m, y, pg.hero, th, null, false) + 18;
    pg.blocks.forEach(function (b) { y += block(m, b, y, th, false); });
    var H = y + 70, cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S;
    var x = cv.getContext('2d'); x.scale(S, S); x.textBaseline = 'alphabetic';
    x.fillStyle = CREAM; x.fillRect(0, 0, W, H);
    // en-tête
    var wds = String(name || '').trim().split(/\s+/);
    font(x, 500, 23, DISP); x.fillStyle = th[0]; x.fillText(wds[0] || '', 18, 36);
    var w0 = x.measureText((wds[0] || '') + ' ').width; font(x, 500, 23, DISP, true); x.fillStyle = th[1]; x.fillText(wds.slice(1).join(' '), 18 + w0, 36);
    rr(x, W - 58, 14, 42, 28, 14); x.strokeStyle = LINE; x.lineWidth = 1; x.stroke(); font(x, 700, 11, BODY); x.fillStyle = th[0]; x.textAlign = 'center'; x.fillText((d.lang || 'fr').toUpperCase(), W - 37, 32); x.textAlign = 'left';
    x.fillStyle = LINE; x.fillRect(0, 55, W, 1);
    y = 56; y += hero(x, y, pg.hero, th, tile, true) + 18;
    pg.blocks.forEach(function (b) { y += block(x, b, y, th, true); });
    font(x, 500, 19, DISP, true); x.fillStyle = th[0]; x.textAlign = 'center';
    var hn = (d.hosts || []).map(function (h) { return h && h.name; }).filter(Boolean).join(' & ');
    x.fillText(t.end + (hn ? ' — ' + hn : ''), W / 2, y + 30); x.textAlign = 'left';
    return cv;
  }

  function loadImg(src) { return new Promise(function (ok) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; setTimeout(function () { ok(null); }, 6000); }); }

  g.WBPhoto = {
    draw: function (d, o) {
      o = o || {};
      var t = WB.i18n[d.lang] || WB.i18n.fr, th = WB.themes[d.style] || WB.themes.sicile;
      var fonts = (document.fonts && document.fonts.load) ? Promise.all([
        document.fonts.load('500 20px "Cormorant Garamond"'), document.fonts.load('italic 500 20px "Cormorant Garamond"'),
        document.fonts.load('400 14px Karla'), document.fonts.load('700 14px Karla')]).catch(function () {}) : Promise.resolve();
      var fontsT = Promise.race([fonts, new Promise(function (ok) { setTimeout(ok, 3000); })]);
      return Promise.all([loadImg((o.img || '') + 'wb/tile-' + (WB.themes[d.style] ? d.style : 'sicile') + '.webp'), fontsT]).then(function (r) {
        var tile = r[0], ps = pages(d, t, o).map(function (pg) { return drawPage(pg, d, th, tile, t, d.name || 'Casa'); });
        var G = 40 * S, Wt = ps.reduce(function (a, c) { return a + c.width; }, 0) + G * 5, Ht = Math.max.apply(null, ps.map(function (c) { return c.height; })) + G * 2;
        var cv = document.createElement('canvas'); cv.width = Wt; cv.height = Ht; var x = cv.getContext('2d');
        x.fillStyle = '#E9E1D3'; x.fillRect(0, 0, Wt, Ht);
        var px = G; ps.forEach(function (c) { x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(px + 12, G + 16, c.width, c.height); x.drawImage(c, px, G); px += c.width + G; });
        return cv;
      });
    }
  };
})(window);
