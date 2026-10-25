/* GJ Welcome Books — affichage du livret digital. WB.render(data, element, {img:'chemin/img/', preview:true|false}) */
(function (g) {
  var T = {
    fr: {welcome: 'Bienvenue à', hosts: 'Vos hôtes', wifi: 'Wi-Fi', connect: 'Se connecter', call: 'Appeler', address: 'Adresse', maps: 'Ouvrir dans Plans',
      t: ['Accueil', 'Arrivée', 'Adresses', 'Infos'], chap: 'Chapitre', checkin: 'Arrivée', checkout: 'Départ', from: 'à partir de', before: 'avant',
      parking: 'Stationnement', keys: 'Les clés', how: 'Comment entrer', leave: 'Avant de partir', rules: 'Règles de la maison', trash: 'Tri des déchets',
      emergency: 'Urgences', eu: 'Urgences (Europe)', doctor: 'Médecin', pharmacy: 'Pharmacie', password: 'Mot de passe', network: 'Réseau',
      copy: 'Copier', copied: 'Copié ✓', scan: 'Scannez avec l’appareil photo pour vous connecter', close: 'Fermer', go: 'Itinéraire →',
      placesLead: 'Nos adresses préférées autour de la maison.', arriveLead: 'Tout pour arriver sereinement.', infoLead: 'Les petites choses à savoir.',
      cats: {resto: 'Restaurants', plage: 'Plages', courses: 'Courses', voir: 'À voir', activ: 'Activités', autre: 'Autres adresses'},
      end: 'Bon séjour !', nothing: 'À compléter'},
    en: {welcome: 'Welcome to', hosts: 'Your hosts', wifi: 'Wi-Fi', connect: 'Connect', call: 'Call', address: 'Address', maps: 'Open in Maps',
      t: ['Home', 'Arrival', 'Places', 'Info'], chap: 'Chapter', checkin: 'Check-in', checkout: 'Check-out', from: 'from', before: 'before',
      parking: 'Parking', keys: 'Keys', how: 'How to get in', leave: 'Before you leave', rules: 'House rules', trash: 'Recycling & bins',
      emergency: 'Emergencies', eu: 'Emergency (Europe)', doctor: 'Doctor', pharmacy: 'Pharmacy', password: 'Password', network: 'Network',
      copy: 'Copy', copied: 'Copied ✓', scan: 'Scan with your camera to connect', close: 'Close', go: 'Directions →',
      placesLead: 'Our favourite places around the house.', arriveLead: 'Everything for a smooth arrival.', infoLead: 'The little things worth knowing.',
      cats: {resto: 'Restaurants', plage: 'Beaches', courses: 'Groceries', voir: 'Sights', activ: 'Activities', autre: 'Other places'},
      end: 'Enjoy your stay!', nothing: 'To be completed'},
    it: {welcome: 'Benvenuti a', hosts: 'I vostri host', wifi: 'Wi-Fi', connect: 'Connettiti', call: 'Chiama', address: 'Indirizzo', maps: 'Apri in Mappe',
      t: ['Home', 'Arrivo', 'Indirizzi', 'Info'], chap: 'Capitolo', checkin: 'Check-in', checkout: 'Check-out', from: 'dalle', before: 'entro le',
      parking: 'Parcheggio', keys: 'Le chiavi', how: 'Come entrare', leave: 'Prima di partire', rules: 'Regole della casa', trash: 'Raccolta differenziata',
      emergency: 'Emergenze', eu: 'Emergenze (Europa)', doctor: 'Medico', pharmacy: 'Farmacia', password: 'Password', network: 'Rete',
      copy: 'Copia', copied: 'Copiato ✓', scan: 'Inquadra con la fotocamera per connetterti', close: 'Chiudi', go: 'Indicazioni →',
      placesLead: 'I nostri posti preferiti intorno alla casa.', arriveLead: 'Tutto per arrivare tranquilli.', infoLead: 'Le piccole cose da sapere.',
      cats: {resto: 'Ristoranti', plage: 'Spiagge', courses: 'Spesa', voir: 'Da vedere', activ: 'Attività', autre: 'Altri indirizzi'},
      end: 'Buon soggiorno!', nothing: 'Da completare'}
  };
  var THEME = {
    sicile: ['#173A5E', '#C46F48', '#E2A62A'], provence: ['#4A3C6B', '#C2643C', '#D9A441'], lisbonne: ['#16306B', '#1E4FA0', '#E7B33C'],
    amalfi: ['#13606A', '#4F8A3C', '#F2C230'], cyclades: ['#163F78', '#C93A7E', '#F2B8D4'], marrakech: ['#173E37', '#B4533A', '#E3A13A']
  };
  var P = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var I = {
    home: '<svg viewBox="0 0 24 24" ' + P + '><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    key: '<svg viewBox="0 0 24 24" ' + P + '><circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3M14 9l2 2"/></svg>',
    map: '<svg viewBox="0 0 24 24" ' + P + '><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
    info: '<svg viewBox="0 0 24 24" ' + P + '><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    wifi: '<svg viewBox="0 0 24 24" ' + P + ' stroke-width="2.2"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/></svg>',
    tel: '<svg viewBox="0 0 24 24" ' + P + '><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" ' + P + '><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" ' + P + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    chev: '<svg viewBox="0 0 24 24" width="20" height="20" ' + P + '><path d="M9 5l7 7-7 7"/></svg>'
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
  function lines(s) { return String(s || '').split(/\n+/).map(function (x) { return x.replace(/^\s*[-•*\d.)]+\s*/, '').trim(); }).filter(Boolean); }
  function telHref(n) { return 'tel:' + String(n || '').replace(/[^\d+]/g, ''); }
  function mapsHref(a) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a || ''); }
  function wifiStr(d) { var q = function (s) { return String(s || '').replace(/([\\;,:"])/g, '\\$1'); }; return 'WIFI:T:' + (d.wifiPass ? 'WPA' : 'nopass') + ';S:' + q(d.wifiName) + ';P:' + q(d.wifiPass) + ';;'; }
  function qrSvg(text) {
    try { var q = g.qrcode(0, 'M'); q.addData(unescape(encodeURIComponent(text))); q.make(); return q.createSvgTag({cellSize: 4, margin: 0, scalable: true}); } catch (e) { return ''; }
  }
  function brand(name) { var w = String(name || '').trim().split(/\s+/); if (w.length < 2) return esc(w[0] || ''); return esc(w[0]) + ' <i>' + esc(w.slice(1).join(' ')) + '</i>'; }
  function hero(k, title, lead, small) {
    return '<div class="wb-hero sm"><p class="wb-k">' + esc(k) + '</p><h2>' + esc(title) + '</h2>' + (lead ? '<p>' + esc(lead) + '</p>' : '') + '</div>';
  }
  function list(arr, cls) { return '<ul class="' + (cls || 'wb-list') + '">' + arr.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>'; }

  function build(d, o) {
    var t = T[d.lang] || T.fr, th = THEME[d.style] || THEME.sicile;
    var name = d.name || 'Casa', hosts = (d.hosts || []).filter(function (h) { return h && (h.name || h.phone); });
    var hostNames = hosts.map(function (h) { return h.name; }).filter(Boolean).join(' & ');
    var tile = (o.img || '') + 'wb/tile-' + (THEME[d.style] ? d.style : 'sicile') + '.webp';
    var h = '';
    // Accueil
    h += '<section class="wb-p" data-p="0"><div class="wb-hero">' + (d.place ? '<p class="wb-k">' + esc(d.place) + '</p>' : '') +
      '<h2>' + esc(t.welcome) + '<em>' + esc(name) + '</em></h2>' + (d.intro ? '<p>' + esc(d.intro) + '</p>' : '') +
      (hostNames ? '<div class="wb-hosts"><p class="wb-k">' + esc(t.hosts) + '</p><b>' + esc(hostNames) + '</b></div>' : '') + '</div><div class="wb-body">';
    if (d.wifiName) h += '<button type="button" class="wb-card wb-wifi" data-wifi><span class="ic">' + I.wifi + '</span><span><h3>' + esc(t.wifi) + '</h3><small>' + esc(d.wifiName) + ' · ' + esc(t.connect) + '</small></span><span class="ch">' + I.chev + '</span></button>';
    if (hosts.length) h += '<div class="wb-row' + (hosts.length < 2 ? ' one' : '') + '">' + hosts.map(function (x) {
      return '<a class="wb-card" href="' + esc(telHref(x.phone)) + '"><p class="wb-k">' + I.tel + esc(t.call) + '</p><h3>' + esc(x.name || t.call) + '</h3><small>' + esc(x.phone) + '</small></a>';
    }).join('') + '</div>';
    if (d.address) h += '<a class="wb-card" href="' + esc(mapsHref(d.address)) + '" target="_blank" rel="noopener"><p class="wb-k">' + I.pin + esc(t.address) + '</p><h3>' + esc(d.address.split(',')[0]) + '</h3><small>' + esc(d.address.split(',').slice(1).join(',').trim()) + (d.address.indexOf(',') > -1 ? ' · ' : '') + esc(t.maps) + '</small></a>';
    h += [1, 2, 3].map(function (i) { return '<button type="button" class="wb-card wb-chap" data-t="' + i + '"><span><p class="wb-k">' + esc(t.chap) + ' 0' + i + '</p><h3>' + esc(t.t[i]) + '</h3></span><span class="ch">' + I.chev + '</span></button>'; }).join('');
    h += '</div></section>';
    // Arrivée
    var steps = lines(d.checkinSteps), out = lines(d.checkoutSteps);
    h += '<section class="wb-p" data-p="1" hidden>' + hero(t.chap + ' 01', t.t[1], t.arriveLead) + '<div class="wb-body">';
    h += '<div class="wb-row">' + '<div class="wb-card"><p class="wb-k">' + I.clock + esc(t.checkin) + '</p><div class="wb-time"><small>' + esc(t.from) + '</small><b>' + esc(d.checkin || '—') + '</b></div></div>' +
      '<div class="wb-card"><p class="wb-k">' + I.clock + esc(t.checkout) + '</p><div class="wb-time"><small>' + esc(t.before) + '</small><b>' + esc(d.checkout || '—') + '</b></div></div></div>';
    if (steps.length) h += '<p class="wb-h">' + esc(t.how) + '</p><ol class="wb-steps">' + steps.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ol>';
    if (d.keys) h += '<div class="wb-dark"><p class="wb-k">' + esc(t.keys) + '</p><p>' + esc(d.keys) + '</p></div>';
    if (d.parking) h += '<div class="wb-card"><p class="wb-k">' + I.pin + esc(t.parking) + '</p><p style="margin-top:6px">' + esc(d.parking) + '</p></div>';
    if (out.length) h += '<p class="wb-h">' + esc(t.leave) + '</p>' + list(out);
    h += '</div></section>';
    // Adresses
    var places = (d.places || []).filter(function (p) { return p && p.name; }), cats = {};
    places.forEach(function (p) { (cats[p.cat || 'autre'] = cats[p.cat || 'autre'] || []).push(p); });
    h += '<section class="wb-p" data-p="2" hidden>' + hero(t.chap + ' 02', t.t[2], t.placesLead) + '<div class="wb-body">';
    if (!places.length) h += '<p class="wb-empty">' + esc(t.nothing) + '</p>';
    ['resto', 'plage', 'courses', 'voir', 'activ', 'autre'].forEach(function (c) {
      if (!cats[c]) return;
      h += '<p class="wb-h">' + esc(t.cats[c]) + '</p>';
      cats[c].forEach(function (p) {
        h += '<div class="wb-card wb-place"><h3>' + esc(p.name) + '</h3>' + (p.note ? '<p>' + esc(p.note) + '</p>' : '') +
          '<a class="go" href="' + esc(mapsHref(p.addr || (p.name + ' ' + (d.place || '')))) + '" target="_blank" rel="noopener">' + esc(t.go) + '</a></div>';
      });
    });
    h += '</div></section>';
    // Infos
    var rules = lines(d.rules);
    h += '<section class="wb-p" data-p="3" hidden>' + hero(t.chap + ' 03', t.t[3], t.infoLead) + '<div class="wb-body">';
    if (rules.length) h += '<p class="wb-h">' + esc(t.rules) + '</p>' + list(rules);
    if (d.trash) h += '<p class="wb-h">' + esc(t.trash) + '</p><div class="wb-card"><p>' + esc(d.trash) + '</p></div>';
    h += '<p class="wb-h">' + esc(t.emergency) + '</p>';
    var em = [[t.eu, d.emergency || '112']];
    if (d.doctor) em.push([t.doctor, d.doctor]);
    if (d.pharmacy) em.push([t.pharmacy, d.pharmacy]);
    hosts.forEach(function (x) { if (x.phone) em.push([x.name || t.hosts, x.phone]); });
    h += em.map(function (x) { return '<a class="wb-card wb-tel" href="' + esc(telHref(/\d/.test(x[1]) ? x[1] : '')) + '"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></a>'; }).join('');
    h += '</div></section>';
    h += '<div class="wb-zig"></div><div class="wb-end">' + esc(t.end) + (hostNames ? ' — ' + esc(hostNames) : '') + '<small>GJ Welcome Books</small></div>';

    var tabs = '<nav class="wb-tabs">' + [I.home, I.key, I.map, I.info].map(function (ic, i) { return '<button type="button" data-t="' + i + '">' + ic + '<span>' + esc(t.t[i]) + '</span></button>'; }).join('') + '</nav>';
    var sheet = '<div class="wb-sheet" hidden><div><h3>' + esc(t.wifi) + '</h3>' +
      '<div class="wb-kv"><span><small>' + esc(t.network) + '</small><b>' + esc(d.wifiName) + '</b></span></div>' +
      (d.wifiPass ? '<div class="wb-kv"><span><small>' + esc(t.password) + '</small><b data-pw>' + esc(d.wifiPass) + '</b></span><button type="button" class="wb-btn" data-copy>' + esc(t.copy) + '</button></div>' : '') +
      '<div class="wb-qr">' + qrSvg(wifiStr(d)) + '</div><p class="wb-qrnote">' + esc(t.scan) + '</p><button type="button" class="wb-btn ghost" data-close>' + esc(t.close) + '</button></div></div>';
    return {
      style: '--a:' + th[0] + ';--b:' + th[1] + ';--c:' + th[2] + ';--tile:url(' + tile + ')',
      html: '<header class="wb-top"><span class="wb-brand">' + brand(name) + '</span><span class="wb-lang">' + esc((d.lang || 'fr').toUpperCase()) + '</span></header><div class="wb-scroll">' + h + '</div>' + tabs + sheet,
      copied: t.copied, copy: t.copy
    };
  }

  function show(root, i) {
    root.querySelectorAll('.wb-p').forEach(function (s) { s.hidden = s.getAttribute('data-p') !== String(i); });
    root.querySelectorAll('.wb-tabs button').forEach(function (b) { if (b.getAttribute('data-t') === String(i)) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    root._tab = i;
  }

  function render(d, root, o) {
    o = o || {};
    var r = build(d || {}, o), sc = root.querySelector('.wb-scroll'), top = sc ? sc.scrollTop : 0;
    root.className = 'wb'; root.setAttribute('style', r.style); root.innerHTML = r.html;
    show(root, root._tab || 0);
    if (sc) root.querySelector('.wb-scroll').scrollTop = top;
    root._t = r;
    if (root._bound) return;
    root._bound = true;
    root.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-t],[data-wifi],[data-close],[data-copy],a');
      if (!el) return;
      if (el.hasAttribute('data-t')) { show(root, +el.getAttribute('data-t')); root.querySelector('.wb-scroll').scrollTop = 0; return; }
      if (el.hasAttribute('data-wifi')) { root.querySelector('.wb-sheet').hidden = false; return; }
      if (el.hasAttribute('data-close')) { root.querySelector('.wb-sheet').hidden = true; return; }
      if (el.hasAttribute('data-copy')) {
        var pw = root.querySelector('[data-pw]').textContent, done = function () { el.textContent = root._t.copied; setTimeout(function () { el.textContent = root._t.copy; }, 1800); };
        try { navigator.clipboard.writeText(pw).then(done, function () {}); } catch (e) {}
        return;
      }
      if (o.preview && el.tagName === 'A') ev.preventDefault();
    });
    root.addEventListener('click', function (ev) { if (ev.target.classList.contains('wb-sheet')) ev.target.hidden = true; });
  }
  g.WB = {render: render, themes: THEME, i18n: T};
})(window);
