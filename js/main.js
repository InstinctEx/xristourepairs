// ── SCROLL PROGRESS ─────────────────────────────────
const sp = document.getElementById('sp');
if(sp){
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - innerHeight) * 100;
    sp.style.width = pct + '%';
  }, {passive:true});
}

// ── NAV SCROLL ───────────────────────────────────────
const nav = document.getElementById('nav');
if(nav){
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, {passive:true});
}

// ── MOBILE MENU ──────────────────────────────────────
const mob = document.getElementById('mob');
const ham = document.getElementById('ham');
function toggleMenu(){
  if(!mob || !ham) return;
  const open = mob.classList.toggle('open');
  ham.classList.toggle('open');
  ham.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMenu(){
  if(!mob || !ham) return;
  ham.classList.remove('open');
  mob.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ── LANGUAGE ─────────────────────────────────────────
let langSwitching = false;
function setLang(l){
  const current = document.documentElement.classList.contains('lang-gr') ? 'gr' : 'en';
  if(l === current || langSwitching) return;
  try{ localStorage.setItem('xr-lang', l); }catch(e){}
  langSwitching = true;
  const overlay = document.getElementById('langOverlay');
  if(overlay) overlay.classList.add('run');
  setTimeout(() => {
    document.documentElement.className = 'lang-' + l;
    document.documentElement.setAttribute('lang', l === 'en' ? 'en' : 'el');
    const bGR = document.getElementById('btnGR'), bEN = document.getElementById('btnEN');
    const mGR = document.getElementById('mGR'), mEN = document.getElementById('mEN');
    if(bGR) bGR.classList.toggle('active', l === 'gr');
    if(bEN) bEN.classList.toggle('active', l === 'en');
    if(mGR) mGR.classList.toggle('active', l === 'gr');
    if(mEN) mEN.classList.toggle('active', l === 'en');
  }, 350);
  setTimeout(() => { if(overlay) overlay.classList.remove('run'); langSwitching = false; }, 800);
}
function updateMobLang(l){ setLang(l); }

// Restore language preference on load
(function restoreLang(){
  try{
    const saved = localStorage.getItem('xr-lang');
    if(saved === 'en' && !document.documentElement.classList.contains('lang-en')){
      document.documentElement.className = 'lang-en';
      document.documentElement.setAttribute('lang', 'en');
      const bGR = document.getElementById('btnGR'), bEN = document.getElementById('btnEN');
      const mGR = document.getElementById('mGR'), mEN = document.getElementById('mEN');
      if(bGR) bGR.classList.remove('active');
      if(bEN) bEN.classList.add('active');
      if(mGR) mGR.classList.remove('active');
      if(mEN) mEN.classList.add('active');
    }
  }catch(e){}
})();

// ── SCROLL REVEAL ─────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis'); });
}, {threshold:.12});
document.querySelectorAll('.sr').forEach(el => observer.observe(el));

// ── COUNTERS ──────────────────────────────────────────
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();
    function step(now){
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target).toLocaleString();
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  });
}, {threshold:.5});
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── ACTIVE NAV LINK ───────────────────────────────────
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');
if(sections.length && navLinks.length){
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const id = e.target.id;
        navLinks.forEach(a => {
          const href = a.getAttribute('href');
          a.classList.toggle('active-link', href === '#' + id);
        });
      }
    });
  }, {threshold:.4});
  sections.forEach(s => sectionObs.observe(s));
}

// ── FAQ TOGGLE ────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => item.classList.toggle('open'));
});

// ── PRIVACY / ANALYTICS CONSENT NOTICE ────────────────
// Note: class/id names deliberately avoid "cookie" or "banner"
// because ad blockers (uBlock, AdGuard, Brave Shields) auto-hide those.
(function privacyConsent(){
  var saved = null;
  try{ saved = localStorage.getItem('xr-consent'); }catch(e){}
  if(saved === 'granted' || saved === 'denied') return; // already chose

  var notice = document.createElement('div');
  notice.id = 'xr-privacy';
  notice.className = 'xr-privacy';
  notice.setAttribute('role', 'dialog');
  notice.setAttribute('aria-label', 'Privacy preferences');
  notice.setAttribute('aria-live', 'polite');
  notice.innerHTML =
    '<div class="xrp-inner">' +
      '<div class="xrp-icon"><i class="fas fa-shield-halved"></i></div>' +
      '<div class="xrp-text">' +
        '<strong class="xrp-title gr">Σεβόμαστε την ιδιωτικότητά σας</strong>' +
        '<strong class="xrp-title en">We respect your privacy</strong>' +
        '<p class="xrp-msg gr">Χρησιμοποιούμε αναλυτικά εργαλεία μόνο για να μετράμε την επισκεψιμότητα και να βελτιώνουμε τον ιστότοπο. <strong>Δεν διαφημίζουμε.</strong></p>' +
        '<p class="xrp-msg en">We use analytics only to measure traffic and improve the site. <strong>No advertising.</strong></p>' +
      '</div>' +
      '<div class="xrp-actions">' +
        '<button type="button" class="btn btn-outline xrp-btn" onclick="cookieReject()">' +
          '<span class="gr">Απόρριψη</span><span class="en">Reject</span>' +
        '</button>' +
        '<button type="button" class="btn btn-red xrp-btn" onclick="cookieAccept()">' +
          '<span class="gr">Αποδοχή</span><span class="en">Accept</span>' +
        '</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(notice);

  // Show after a short delay so it doesn't fight hero animation
  setTimeout(function(){
    notice.classList.add('show');
    requestAnimationFrame(function(){ notice.classList.add('vis'); });
  }, 900);
})();

function cookieAccept(){
  try{ localStorage.setItem('xr-consent', 'granted'); }catch(e){}
  if(typeof gtag === 'function'){
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
  }
  hidePrivacyNotice();
}
function cookieReject(){
  try{ localStorage.setItem('xr-consent', 'denied'); }catch(e){}
  if(typeof gtag === 'function'){
    gtag('consent', 'update', { 'analytics_storage': 'denied' });
  }
  hidePrivacyNotice();
}
function hidePrivacyNotice(){
  var n = document.getElementById('xr-privacy');
  if(!n) return;
  n.classList.remove('vis');
  setTimeout(function(){ n.classList.remove('show'); n.remove(); }, 450);
}

// Expose for inline handlers
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.setLang = setLang;
window.updateMobLang = updateMobLang;
window.cookieAccept = cookieAccept;
window.cookieReject = cookieReject;
