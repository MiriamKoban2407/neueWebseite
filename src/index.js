import './styles.scss';

const contactDialog = document.querySelector('#contact-dialog');
const contactOpenButton = document.querySelector('[data-contact-open]');
const contactCloseButton = document.querySelector('[data-contact-close]');
const contactForm = contactDialog?.querySelector('form');
const contactStatus = contactDialog?.querySelector('[data-contact-status]');
const contactTitle = contactDialog?.querySelector('#contact-dialog-title');
const defaultContactTitle = contactTitle?.textContent;

if (contactDialog instanceof HTMLDialogElement) {
  contactOpenButton?.addEventListener('click', () => {
    if (contactForm instanceof HTMLFormElement && contactForm.hidden) {
      contactForm.reset();
      contactForm.hidden = false;
      if (contactStatus instanceof HTMLElement) {
        contactStatus.hidden = true;
        contactStatus.textContent = '';
      }
      if (contactTitle instanceof HTMLElement && defaultContactTitle) {
        contactTitle.textContent = defaultContactTitle;
      }
    }

    contactDialog.showModal();
    if (contactForm instanceof HTMLFormElement && !contactForm.hidden) {
      contactForm.querySelector('input[type="email"]')?.focus();
    }
  });

  contactCloseButton?.addEventListener('click', () => contactDialog.close());

  contactDialog.addEventListener('click', (event) => {
    if (event.target === contactDialog) {
      contactDialog.close();
    }
  });

  if (contactForm instanceof HTMLFormElement && contactStatus instanceof HTMLElement) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (!(submitButton instanceof HTMLButtonElement)) return;

      submitButton.disabled = true;
      contactStatus.hidden = false;
      contactStatus.textContent = 'Deine Nachricht wird gesendet …';

      const emailInput = contactForm.querySelector('input[name="email"]');
      const replyToInput = contactForm.querySelector('input[name="_replyto"]');
      if (!(emailInput instanceof HTMLInputElement) || !(replyToInput instanceof HTMLInputElement)) {
        submitButton.disabled = false;
        console.error('Contact form email fields are missing.');
        contactStatus.textContent = 'Das Formular ist gerade nicht verfügbar. Bitte lade die Seite neu.';
        return;
      }
      replyToInput.value = emailInput.value;

      const iframe = document.createElement('iframe');
      iframe.name = `contact-form-${Date.now()}`;
      iframe.title = 'Kontaktformular-Übermittlung';
      iframe.hidden = true;

      let iframeReady = false;
      let timeoutId;
      const finish = () => {
        clearTimeout(timeoutId);
        iframe.remove();
        contactForm.removeAttribute('target');
        submitButton.disabled = false;
      };
      const showError = () => {
        finish();
        contactStatus.textContent = 'Das Senden hat leider nicht funktioniert. Bitte versuche es noch einmal.';
      };

      iframe.addEventListener('load', () => {
        if (!iframeReady) {
          iframeReady = true;
          contactForm.target = iframe.name;
          timeoutId = setTimeout(showError, 30000);

          try {
            HTMLFormElement.prototype.submit.call(contactForm);
          } catch (error) {
            console.error('Contact form submission failed:', error);
            showError();
          }
          return;
        }

        finish();
        contactForm.hidden = true;
        if (contactTitle instanceof HTMLElement) {
          contactTitle.textContent = 'Vielen Dank!';
        }
        contactStatus.textContent = 'Deine Nachricht wurde gesendet. Ich melde mich bald bei dir.';
      });

      timeoutId = setTimeout(showError, 30000);
      document.body.append(iframe);
    });
  }
}
