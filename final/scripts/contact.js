// contact.js — Contact form validation for mStore

const form = document.getElementById('contact-form');
const messageSlot = document.getElementById('form-message');

function showFormMessage(text, isError = false) {
  if (!messageSlot) return;
  messageSlot.textContent = text;
  messageSlot.hidden = false;
  messageSlot.style.backgroundColor = isError ? '#FDECEC' : '#E7F5EC';
  messageSlot.style.color = isError ? '#8B1A10' : '#1B5E20';
  messageSlot.style.borderLeftColor = isError ? '#C0392B' : '#1B5E20';
}

function clearFormMessage() {
  if (!messageSlot) return;
  messageSlot.hidden = true;
  messageSlot.textContent = '';
}

if (form) {
  form.addEventListener('submit', (event) => {
    clearFormMessage();

    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      showFormMessage('Please fill out all required fields.', true);
      return;
    }

    // Form is valid — let the browser submit to form-action.html.
    // We simply surface a quick confirmation for the user.
    showFormMessage('Sending your message…');

    // Persist the last name so form-action can greet the user if desired.
    try {
      const nameField = form.querySelector('#name');
      if (nameField) {
        localStorage.setItem('mstore:lastName', nameField.value);
      }
    } catch (error) {
      console.warn('Could not save last name:', error);
    }
  });
}