import './styles.scss';

const contactDialog = document.querySelector('#contact-dialog');
const contactOpenButton = document.querySelector('[data-contact-open]');
const contactCloseButton = document.querySelector('[data-contact-close]');

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
}
