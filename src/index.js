import './styles.scss';

const contactDialog = document.querySelector('#contact-dialog');
const contactOpenButton = document.querySelector('[data-contact-open]');
const contactCloseButton = document.querySelector('[data-contact-close]');
const contactForm = contactDialog?.querySelector('form');
const contactStatus = contactDialog?.querySelector('[data-contact-status]');

if (contactDialog instanceof HTMLDialogElement) {
  contactOpenButton?.addEventListener('click', () => {
    contactDialog.showModal();
    contactDialog.querySelector('input[type="email"]')?.focus();
  });

  contactCloseButton?.addEventListener('click', () => contactDialog.close());

  contactDialog.addEventListener('click', (event) => {
    if (event.target === contactDialog) {
      contactDialog.close();
    }
  });

  if (contactForm instanceof HTMLFormElement && contactStatus instanceof HTMLElement) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (!(submitButton instanceof HTMLButtonElement)) return;

      submitButton.disabled = true;
      contactStatus.hidden = false;
      contactStatus.textContent = 'Deine Nachricht wird gesendet …';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Die Nachricht konnte nicht gesendet werden.');
        }

        contactForm.hidden = true;
        contactDialog.querySelector('#contact-dialog-title').textContent = 'Vielen Dank!';
        contactStatus.textContent = 'Deine Nachricht wurde gesendet. Ich melde mich bald bei dir.';
      } catch (error) {
        console.error('Contact form submission failed:', error);
        contactStatus.textContent = 'Das Senden hat leider nicht funktioniert. Bitte versuche es noch einmal.';
      } finally {
        submitButton.disabled = false;
      }
    });
  }
}
