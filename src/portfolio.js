import './portfolio.scss';
import { projects } from './projects.js';

const slidesEl = document.querySelector('[data-spotlight-slides]');
const dotsEl = document.querySelector('[data-spotlight-dots]');
const counterEl = document.querySelector('[data-spotlight-counter]');
const prevButton = document.querySelector('[data-spotlight-prev]');
const nextButton = document.querySelector('[data-spotlight-next]');
const listEl = document.querySelector('[data-project-list]');
const countEl = document.querySelector('[data-project-count]');

const pad = (n) => String(n).padStart(2, '0');

slidesEl.innerHTML = projects
  .map(
    (p, i) => `
      <article class="spotlight__slide" aria-roledescription="Folie" aria-label="${i + 1} von ${projects.length}">
        <div class="spotlight__media">
          <img src="${p.image}" alt="${p.alt}" />
          <span class="spotlight__badge">Featured</span>
        </div>
        <div class="spotlight__body">
          <p class="spotlight__meta">${p.category}</p>
          <h3 class="spotlight__title">${p.title}</h3>
          <p class="spotlight__summary">${p.summary}</p>
          <a href="#projekt-${i + 1}" class="spotlight__link">Zum Projekt <span aria-hidden="true">&rarr;</span></a>
        </div>
      </article>`,
  )
  .join('');

dotsEl.innerHTML = projects
  .map((p, i) => `<button type="button" class="spotlight__dot" data-dot="${i}" aria-label="Projekt ${i + 1}: ${p.title}"></button>`)
  .join('');

listEl.innerHTML = projects
  .map(
    (p, i) => `
      <li class="project" id="projekt-${i + 1}">
        <span class="project__number">${pad(i + 1)}</span>
        <div class="project__body">
          <p class="project__meta">${p.category}</p>
          <h3 class="project__title">${p.title}</h3>
          <p class="project__summary">${p.summary}</p>
          <p class="project__role"><span>Meine Rolle:</span> ${p.role}</p>
          <ul class="project__tags">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
          <div class="project__videos">${(p.videos ?? [])
            .map(
              (id) => `
            <div class="project__video">
              <iframe src="https://www.instagram.com/reel/${id}/embed" title="Instagram Reel" loading="lazy" allowtransparency="true" allowfullscreen></iframe>
            </div>`,
            )
            .join('')}</div>
        </div>
      </li>`,
  )
  .join('');

countEl.textContent = `${projects.length} Projekte`;

const slides = slidesEl.querySelectorAll('.spotlight__slide');
const dots = dotsEl.querySelectorAll('.spotlight__dot');

let current = 0;

function show(index) {
  current = (index + projects.length) % projects.length;
  slides.forEach((slide, i) => {
    slide.hidden = i !== current;
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === current);
    dot.setAttribute('aria-current', i === current ? 'true' : 'false');
  });
  counterEl.textContent = `${pad(current + 1)} / ${pad(projects.length)}`;
}

prevButton.addEventListener('click', () => show(current - 1));
nextButton.addEventListener('click', () => show(current + 1));
dotsEl.addEventListener('click', (event) => {
  const dot = event.target.closest('[data-dot]');
  if (dot) show(Number(dot.dataset.dot));
});

show(0);
