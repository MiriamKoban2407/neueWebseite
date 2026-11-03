import './styles.scss';

const contactDialog = document.querySelector('#contact-dialog');
const contactOpenButton = document.querySelector('[data-contact-open]');
const contactCloseButton = document.querySelector('[data-contact-close]');
const contactForm = contactDialog?.querySelector('form');
const contactStatus = contactDialog?.querySelector('[data-contact-status]');
const contactTitle = contactDialog?.querySelector('#contact-dialog-title');
const defaultContactTitle = contactTitle?.textContent;

if (contactDialog instanceof HTMLDialogElement) {
  const pageUrl = new URL(window.location.href);
  const submissionSucceeded = pageUrl.searchParams.get('contact') === 'sent';

  if (
    submissionSucceeded &&
    contactForm instanceof HTMLFormElement &&
    contactStatus instanceof HTMLElement &&
    contactTitle instanceof HTMLElement
  ) {
    contactForm.hidden = true;
    contactTitle.textContent = 'Vielen Dank!';
    contactStatus.hidden = false;
    contactStatus.textContent = 'Deine Nachricht wurde gesendet. Ich melde mich bald bei dir.';
    pageUrl.searchParams.delete('contact');
    window.history.replaceState({}, '', pageUrl);
    contactDialog.showModal();
  }

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
      const emailInput = contactForm.querySelector('input[name="email"]');
      const replyToInput = contactForm.querySelector('input[name="_replyto"]');
      if (!(emailInput instanceof HTMLInputElement) || !(replyToInput instanceof HTMLInputElement)) {
        console.error('Contact form email fields are missing.');
      } else {
        replyToInput.value = emailInput.value;
      }
    });
  }
}
