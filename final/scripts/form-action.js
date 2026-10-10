// form-action.js — Reads the contact form submission from the URL

const summary = document.getElementById('submission-summary');

if (summary) {
  const params = new URLSearchParams(window.location.search);

  const entries = [
    ['Name', params.get('name')],
    ['Email', params.get('email')],
    ['Subject', params.get('subject')],
    ['Message', params.get('message')]
  ];

  const visible = entries.filter(([, value]) => value);

  if (!visible.length) {
    summary.textContent =
      'No submission data was found. Please return to the contact page and try again.';
    summary.style.backgroundColor = '#FFF7E0';
    summary.style.color = '#7A5A00';
    summary.style.borderLeftColor = '#F2A900';
  } else {
    // Escape values before injecting into the DOM
    const escape = (str) =>
      String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    summary.innerHTML = visible
      .map(([label, value]) => `<p><strong>${label}:</strong> ${escape(value)}</p>`)
      .join('');
  }
}