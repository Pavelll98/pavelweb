(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var btn = form.querySelector('[type="submit"]');
  var resultEl = document.getElementById('form-result');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = {};
    new FormData(form).forEach(function (val, key) { data[key] = val; });

    if (!data.gdpr_consent) {
      show('error', 'Prosím odsouhlaste zpracování osobních údajů.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Odesílám…';
    hide();

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        return res.json().then(function (json) { return { ok: res.ok, json: json }; });
      })
      .then(function (r) {
        reset();
        if (r.ok && r.json.ok) {
          show('success', 'Zpráva odeslána! Ozvu se vám do 24 hodin.');
          form.reset();
        } else {
          show('error', r.json.error || 'Odeslání se nezdařilo. Zkuste to prosím znovu.');
        }
      })
      .catch(function () {
        reset();
        show('error', 'Nepodařilo se odeslat zprávu. Zkontrolujte připojení a zkuste znovu.');
      });
  });

  function show(type, msg) {
    resultEl.textContent = msg;
    resultEl.className = 'form-result form-result--' + type;
    resultEl.removeAttribute('hidden');
  }

  function hide() {
    resultEl.setAttribute('hidden', '');
    resultEl.className = 'form-result';
  }

  function reset() {
    btn.disabled = false;
    btn.textContent = 'Odeslat zprávu';
  }
})();
