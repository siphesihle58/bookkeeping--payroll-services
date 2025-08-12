/* Basic site JS for interactivity and form handling */

/* NAV TOGGLE for mobile */
document.querySelectorAll('.nav-toggle').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const nav = btn.closest('.header-inner').querySelector('.nav-list');
    if(nav.style.display === 'block'){ nav.style.display = ''; }
    else { nav.style.display = 'block'; }
  });
});

/* SMOOTH SCROLL for internal anchors (if used) */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth'});
  });
});

/* SERVICES: dynamic list and search */
const servicesData = [
  {id:1, title:'Bookkeeping', tags:['bookkeeping','accounts','ledger'], desc:'Financial statement prep, AP/AR, ledgers.'},
  {id:2, title:'Payroll Processing', tags:['payroll','payslip','PAYE','UIF'], desc:'Payroll admin, payslips, tax filings.'},
  {id:3, title:'SARS Compliance', tags:['compliance','sars','tax'], desc:'Statutory filing & reconciliation.'},
  {id:4, title:'Financial Reporting', tags:['reporting','analysis'], desc:'Monthly/quarterly reports & analysis.'},
  {id:5, title:'Forecasting & Budgeting', tags:['forecast','budget'], desc:'Planning, budgets, cashflow forecasts.'}
];

function renderServices(filterText=''){
  const container = document.getElementById('servicesList');
  if(!container) return;
  const q = filterText.trim().toLowerCase();
  container.innerHTML = '';
  const shown = servicesData.filter(s=>{
    if(!q) return true;
    return s.title.toLowerCase().includes(q) || s.tags.join(' ').includes(q) || s.desc.toLowerCase().includes(q);
  });
  shown.forEach(s=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<h4>${s.title}</h4><p>${s.desc}</p><p class="muted">Tags: ${s.tags.join(', ')}</p>`;
    container.appendChild(el);
  });
}

/* Hook up search on services page */
const serviceSearch = document.getElementById('serviceSearch');
if(serviceSearch){
  renderServices('');
  serviceSearch.addEventListener('input', ()=> renderServices(serviceSearch.value));
  document.getElementById('clearSearch').addEventListener('click', ()=>{
    serviceSearch.value = '';
    renderServices('');
  });
}

/* QUICK QUOTE form saves to localStorage */
const quoteForm = document.getElementById('quoteForm');
if(quoteForm){
  quoteForm.addEventListener('submit', e=>{
    e.preventDefault();
    const data = {
      name: document.getElementById('qName').value || '',
      email: document.getElementById('qEmail').value || '',
      phone: document.getElementById('qPhone').value || '',
      service: document.getElementById('qService').value,
      message: document.getElementById('qMessage').value,
      submitted: new Date().toISOString()
    };
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes.push(data);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    alert('Quote request saved locally — open console or localStorage to review (demo).');
    quoteForm.reset();
  });
}

/* CONTACT FORM handling & validation */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  const preview = document.getElementById('preview');
  const attachFile = document.getElementById('attachFile');

  attachFile.addEventListener('change', (ev)=>{
    const f = ev.target.files[0];
    if(!f){ preview.textContent = 'No file chosen'; return; }
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '120px';
      img.style.borderRadius = '8px';
      preview.innerHTML = '';
      preview.appendChild(img);
    };
    reader.readAsDataURL(f);
  });

  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    if(!fullName || !email){
      alert('Please fill required fields: name and email.');
      return;
    }
    const payload = {
      fullName,
      businessName: document.getElementById('businessName').value.trim(),
      email,
      phone: document.getElementById('phone').value.trim(),
      serviceType: document.getElementById('serviceType').value,
      message: document.getElementById('message').value.trim(),
      date: new Date().toISOString()
    };
    const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
    msgs.push(payload);
    localStorage.setItem('messages', JSON.stringify(msgs));
    alert('Thanks! Message saved locally (demo).');
    contactForm.reset();
    preview.textContent = 'No file chosen';
  });
}

/* Service filter on homepage (select) */
const serviceFilter = document.getElementById('serviceFilter');
if(serviceFilter){
  serviceFilter.addEventListener('change', ()=>{
    const v = serviceFilter.value;
    const services = document.querySelectorAll('#serviceGrid .service');
    services.forEach(s=>{
      if(v === 'all' || s.dataset.type === v) s.style.display = '';
      else s.style.display = 'none';
    });
  });
}

/* Testimonials carousel (very light) */
(function(){
  const wrap = document.getElementById('testimonialWrap');
  if(!wrap) return;
  const items = wrap.querySelectorAll('.testimonial');
  let idx = 0;
  function show(i){
    items.forEach((it,ii)=> it.classList.toggle('active', ii===i));
  }
  show(idx);
  document.getElementById('prevTest').addEventListener('click', ()=>{ idx = (idx-1+items.length)%items.length; show(idx);});
  document.getElementById('nextTest').addEventListener('click', ()=>{ idx = (idx+1)%items.length; show(idx);});
  // auto rotate:
  setInterval(()=>{ idx = (idx+1)%items.length; show(idx); }, 6000);
})();

/* small utility: log stored items for debugging */
console.log('Saved quotes:', JSON.parse(localStorage.getItem('quotes') || '[]'));
console.log('Saved messages:', JSON.parse(localStorage.getItem('messages') || '[]'));
