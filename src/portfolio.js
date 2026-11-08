import './portfolio.scss';
import { projects } from './projects.js';

const slidesEl = document.querySelector('[data-spotlight-slides]');
const dotsEl = document.querySelector('[data-spotlight-dots]');
const counterEl = document.querySelector('[data-spotlight-counter]');
const prevButton = document.querySelector('[data-spotlight-prev]');
const nextButton = document.querySelector('[data-spotlight-next]');
const detailEl = document.querySelector('[data-project-detail]');
const countEl = document.querySelector('[data-project-count]');

const pad = (n) => String(n).padStart(2, '0');
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

slidesEl.innerHTML = projects
  .map(
    (project, index) => `
      <button type="button" class="spotlight__slide" data-project-open="${index}" aria-controls="project-detail-${index}" aria-label="Zu ${escapeHtml(project.title)} springen">
        <span class="spotlight__title">${escapeHtml(project.title)}</span>
        <span class="spotlight__summary">${escapeHtml(project.summary)}</span>
      </button>`,
  )
  .join('');

dotsEl.innerHTML = projects
  .map(
    (project, index) =>
      `<button type="button" class="spotlight__dot" data-dot="${index}" aria-label="Projekt ${index + 1}: ${escapeHtml(project.title)}"></button>`,
  )
  .join('');

countEl.textContent = `${projects.length} Projekte`;

const slides = slidesEl.querySelectorAll('.spotlight__slide');
const dots = dotsEl.querySelectorAll('.spotlight__dot');
let current = 0;

function show(index) {
  current = (index + projects.length) % projects.length;
  slides.forEach((slide, slideIndex) => {
    slide.hidden = slideIndex !== current;
    slide.setAttribute('aria-pressed', slideIndex === current ? 'true' : 'false');
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === current);
    dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
  });
  counterEl.textContent = `${pad(current + 1)} / ${pad(projects.length)}`;
}

function renderMedia(project, index) {
  const media = project.media[index];
  if (!media) return '';

  if (media.type === 'image') {
    return `
      <figure class="project-detail__media-slide${media.fit === 'contain' ? ' project-detail__media-slide--contain' : ''}">
        <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt)}" loading="lazy" />
        <figcaption>${escapeHtml(media.title)}</figcaption>
      </figure>`;
  }

  const embedUrl =
    media.type === 'instagram'
      ? `https://www.instagram.com/reel/${encodeURIComponent(media.id)}/embed`
      : `https://www.tiktok.com/embed/v2/${encodeURIComponent(media.id)}`;
  const videoUrl =
    media.type === 'instagram'
      ? `https://www.instagram.com/reel/${encodeURIComponent(media.id)}/`
      : `https://www.tiktok.com/@htlwienwest.it/video/${encodeURIComponent(media.id)}`;

  return `
    <div class="project-detail__media-slide">
      <div class="project-detail__video">
        <iframe src="${embedUrl}" title="${escapeHtml(media.title)}" loading="lazy" allowfullscreen></iframe>
      </div>
      <a class="project-detail__media-link" href="${videoUrl}" target="_blank" rel="noopener noreferrer">
        Video auf ${media.type === 'instagram' ? 'Instagram' : 'TikTok'} ansehen <span aria-hidden="true">&rarr;</span>
      </a>
    </div>`;
}

function renderProject(project, index) {
  const media = project.media ?? [];
  return `
    <article class="project-detail__article${index % 2 === 0 ? ' project-detail--media-left' : ''}${project.mediaLayout === 'compact' ? ' project-detail__article--compact-media' : ''}" id="project-detail-${index}" data-project-card="${index}">
      <div class="project-detail__copy">
        <p class="project-detail__meta">${escapeHtml(project.category)}</p>
        <h3 class="project-detail__title">${escapeHtml(project.title)}</h3>
        <p class="project-detail__description">${escapeHtml(project.description)}</p>
        <div class="project-detail__skills">
          <p class="eyebrow">Fähigkeiten</p>
          <ul>${project.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="project-detail__media" aria-label="Medien zu ${escapeHtml(project.title)}">
        ${
          media.length
            ? media.length > 1
              ? `<div class="project-detail__media-carousel">
                  <button type="button" class="project-detail__media-arrow" data-media-prev aria-label="Vorheriges Medium">&larr;</button>
                  <div class="project-detail__media-stage" data-media-stage>${renderMedia(project, 0)}</div>
                  <button type="button" class="project-detail__media-arrow" data-media-next aria-label="Nächstes Medium">&rarr;</button>
                  <div class="project-detail__media-controls">
                    <div class="project-detail__media-dots">
                      ${media
                        .map(
                          (item, mediaIndex) =>
                            `<button type="button" class="project-detail__media-dot${mediaIndex === 0 ? ' is-active' : ''}" data-media-dot="${mediaIndex}" aria-label="Medium ${mediaIndex + 1}: ${escapeHtml(item.title)}" aria-current="${mediaIndex === 0 ? 'true' : 'false'}"></button>`,
                        )
                        .join('')}
                    </div>
                  </div>
                </div>`
              : `<div class="project-detail__media-stage" data-media-stage>${renderMedia(project, 0)}</div>`
            : '<p class="project-detail__media-empty">Weitere Einblicke auf Anfrage.</p>'
        }
      </div>
    </article>
  `;
}

function setupMediaCarousel(project, article) {
  const media = project.media ?? [];
  if (!media.length) return;

  const stage = article.querySelector('[data-media-stage]');
  const mediaDots = article.querySelectorAll('[data-media-dot]');
  const mediaSlides = new Map();
  const initialSlide = stage.firstElementChild;
  if (initialSlide) {
    initialSlide.dataset.mediaIndex = '0';
    mediaSlides.set(0, initialSlide);
  }
  let currentMedia = 0;
  const showMedia = (mediaIndex) => {
    const nextMedia = (mediaIndex + media.length) % media.length;
    if (nextMedia === currentMedia) return;
    currentMedia = nextMedia;

    let activeSlide = mediaSlides.get(currentMedia);
    if (!activeSlide) {
      const template = document.createElement('template');
      template.innerHTML = renderMedia(project, currentMedia).trim();
      activeSlide = template.content.firstElementChild;
      if (!activeSlide) {
        throw new Error(`Could not render media ${currentMedia} for ${project.title}`);
      }
      activeSlide.dataset.mediaIndex = String(currentMedia);
      mediaSlides.set(currentMedia, activeSlide);
      stage.append(activeSlide);
    }

    mediaSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentMedia;
      const iframe = slide.querySelector('iframe');
      if (iframe) {
        if (isActive && iframe.getAttribute('src') === 'about:blank' && iframe.dataset.mediaSrc) {
          iframe.src = iframe.dataset.mediaSrc;
        } else if (!isActive && iframe.getAttribute('src') !== 'about:blank') {
          iframe.dataset.mediaSrc = iframe.getAttribute('src');
          iframe.src = 'about:blank';
        }
      }
      slide.hidden = !isActive;
    });
    mediaDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentMedia);
      dot.setAttribute('aria-current', dotIndex === currentMedia ? 'true' : 'false');
    });
  };

  article.querySelector('[data-media-prev]')?.addEventListener('click', () => showMedia(currentMedia - 1));
  article.querySelector('[data-media-next]')?.addEventListener('click', () => showMedia(currentMedia + 1));
  mediaDots.forEach((dot) => {
    dot.addEventListener('click', () => showMedia(Number(dot.dataset.mediaDot)));
  });
}

function openProject(index) {
  detailEl.querySelector(`[data-project-card="${index}"]`).scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
}

detailEl.innerHTML = projects.map(renderProject).join('');
projects.forEach((project, index) => {
  setupMediaCarousel(project, detailEl.querySelector(`[data-project-card="${index}"]`));
});

prevButton.addEventListener('click', () => show(current - 1));
nextButton.addEventListener('click', () => show(current + 1));
dotsEl.addEventListener('click', (event) => {
  const dot = event.target.closest('[data-dot]');
  if (dot) show(Number(dot.dataset.dot));
});
slidesEl.addEventListener('click', (event) => {
  const slide = event.target.closest('[data-project-open]');
  if (slide) openProject(Number(slide.dataset.projectOpen));
});

show(0);
