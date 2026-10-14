(function () {
  var form = document.getElementById('sprint-form');
  if (!form) return;

  var REQUIRED = {
    name: 'Please enter your full name.',
    email: 'Please enter a valid email address.',
    businessName: 'Please enter your business name.',
    industry: 'Please enter your industry.',
    description: 'Please describe your business.',
    requirements: 'Please tell us what you need.',
  };
  var OPTIONAL = ['phone', 'website', 'targetCustomers', 'notes'];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var step1 = form.querySelector('[data-step="1"]');
  var step2 = form.querySelector('[data-step="2"]');
  var label = form.querySelector('[data-step-label]');
  var errorBox = form.querySelector('[data-form-error]');
  var submitBtn = form.querySelector('[data-submit]');
  var track = window.zyTrack || function () {};
  var started = false;

  function value(name) {
    return (form.elements[name].value || '').trim();
  }

  function setError(name, message) {
    var input = form.elements[name];
    var existing = document.getElementById(name + '-error');
    if (existing) existing.remove();
    if (!message) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      return;
    }
    var p = document.createElement('p');
    p.className = 'field-error';
    p.id = name + '-error';
    p.textContent = message;
    input.parentNode.appendChild(p);
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', p.id);
  }

  function validateStep1() {
    var firstInvalid = null;
    Object.keys(REQUIRED).forEach(function (name) {
      var v = value(name);
      var ok = name === 'email' ? EMAIL_RE.test(v) : v.length >= 2;
      setError(name, ok ? '' : REQUIRED[name]);
      if (!ok && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function showStep(n) {
    step1.hidden = n !== 1;
    step2.hidden = n !== 2;
    form.querySelector('[data-step-dot="2"]').classList.toggle('active', n === 2);
    label.textContent = n === 1 ? 'Step 1 of 2 · About your business' : 'Step 2 of 2 · Optional details';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var first = (n === 1 ? step1 : step2).querySelector('input, textarea');
    if (first) first.focus({ preventScroll: true });
  }

  form.addEventListener('input', function (event) {
    if (!started) {
      started = true;
      track('sprint_form_start');
    }
    if (event.target.getAttribute('aria-invalid') === 'true') setError(event.target.name, '');
  });

  form.querySelector('[data-next]').addEventListener('click', function () {
    if (validateStep1()) {
      track('sprint_form_step2');
      showStep(2);
    }
  });
  form.querySelector('[data-back]').addEventListener('click', function () {
    showStep(1);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (step2.hidden) {
      form.querySelector('[data-next]').click();
      return;
    }
    if (!validateStep1()) {
      showStep(1);
      return;
    }
    var payload = {};
    Object.keys(REQUIRED).concat(OPTIONAL).forEach(function (name) {
      payload[name] = value(name);
    });
    payload.company_website = form.elements.company_website.value;

    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.success) {
          track('generate_lead', { form: 'website_sprint', value: 1999, currency: 'USD' });
          window.location.href = '/thank-you';
          return;
        }
        if (result.data.field && REQUIRED[result.data.field]) {
          showStep(1);
          setError(result.data.field, result.data.error || REQUIRED[result.data.field]);
          form.elements[result.data.field].focus();
        } else {
          errorBox.textContent = result.data.error || 'Something went wrong. Please try again, or email contact@zyvibe.com.';
          errorBox.hidden = false;
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send my request';
      })
      .catch(function () {
        errorBox.textContent = 'Network error. Please check your connection and try again, or email contact@zyvibe.com.';
        errorBox.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send my request';
      });
  });
})();
