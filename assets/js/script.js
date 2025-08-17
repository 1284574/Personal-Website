'use strict';

/* ---------- helpers ---------- */
const toggleActive = (el) => el?.classList.toggle('active');

/* ---------- sidebar (exists) ---------- */
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => toggleActive(sidebar));
}

/* ---------- testimonials modal (optional) ---------- */
const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer   = document.querySelector('[data-modal-container]');
const modalCloseBtn    = document.querySelector('[data-modal-close-btn]');
const overlay          = document.querySelector('[data-overlay]');
const modalImg         = document.querySelector('[data-modal-img]');
const modalTitle       = document.querySelector('[data-modal-title]');
const modalText        = document.querySelector('[data-modal-text]');

const toggleTestimonialsModal = () => {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
  }
};

// only wire up if everything relevant exists
if (testimonialsItem.length && modalContainer && overlay && modalImg && modalTitle && modalText) {
  testimonialsItem.forEach(item => {
    item.addEventListener('click', function () {
      const avatar = this.querySelector('[data-testimonials-avatar]');
      const title  = this.querySelector('[data-testimonials-title]');
      const text   = this.querySelector('[data-testimonials-text]');
      if (avatar) { modalImg.src = avatar.src; modalImg.alt = avatar.alt || ''; }
      if (title)  { modalTitle.innerHTML = title.innerHTML; }
      if (text)   { modalText.innerHTML = text.innerHTML; }
      toggleTestimonialsModal();
    });
  });
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', toggleTestimonialsModal);
  if (overlay)       overlay.addEventListener('click', toggleTestimonialsModal);
}

/* ---------- custom select + filters (optional) ---------- */
const select       = document.querySelector('[data-select]');
const selectItems  = document.querySelectorAll('[data-select-item]');
const selectValue  = document.querySelector('[data-select-value]'); // ✅ fixed attribute name
const filterBtn    = document.querySelectorAll('[data-filter-btn]');
const filterItems  = document.querySelectorAll('[data-filter-item]');

const runFilter = (val) => {
  if (!filterItems.length) return;
  const selected = (val || 'all').toLowerCase();
  filterItems.forEach(el => {
    const show = selected === 'all' || selected === (el.dataset.category || '').toLowerCase();
    el.classList.toggle('active', show);
  });
};

if (select) {
  select.addEventListener('click', () => toggleActive(select));
}
if (selectItems.length) {
  selectItems.forEach(it => {
    it.addEventListener('click', function () {
      const chosen = this.innerText.trim();
      if (selectValue) selectValue.innerText = chosen;
      if (select) toggleActive(select);
      runFilter(chosen);
    });
  });
}
if (filterBtn.length) {
  let lastClickedBtn = filterBtn[0];
  filterBtn.forEach(btn => {
    btn.addEventListener('click', function () {
      const chosen = this.innerText.trim();
      if (selectValue) selectValue.innerText = chosen;
      runFilter(chosen);
      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      this.classList.add('active');
      lastClickedBtn = this;
    });
  });
}

/* ---------- contact form (optional) ---------- */
const form       = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn    = document.querySelector('[data-form-btn]');

if (form && formInputs.length && formBtn) {
  formInputs.forEach(inp => {
    inp.addEventListener('input', () => {
      if (form.checkValidity()) formBtn.removeAttribute('disabled');
      else formBtn.setAttribute('disabled', '');
    });
  });
}

/* ---------- page navigation (exists) ---------- */
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages           = document.querySelectorAll('[data-page]');

const showPage = (key) => {
  const target = (key || '').trim().toLowerCase();
  pages.forEach(p => p.classList.toggle('active', (p.dataset.page || '').toLowerCase() === target));
  navigationLinks.forEach(btn => {
    const label = btn.textContent.trim().toLowerCase();
    btn.classList.toggle('active', label === target);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

if (navigationLinks.length && pages.length) {
  navigationLinks.forEach(btn => {
    // ensure button doesn't accidentally submit forms
    if (!btn.getAttribute('type')) btn.setAttribute('type','button');
    btn.addEventListener('click', () => showPage(btn.textContent));
  });

  // ensure exactly one page is active on load
  const current = [...pages].find(p => p.classList.contains('active'))?.dataset.page || 'about';
  showPage(current);
}
