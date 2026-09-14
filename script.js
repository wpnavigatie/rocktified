(() => {
  const content = window.ROCKTIFIED_CONTENT;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  $('[data-about-intro]').textContent = content.aboutIntro;
  $('[data-contact-link]').href = `mailto:${content.contactEmail}`;
  $('[data-contact-link]').firstChild.textContent = `${content.contactEmail} `;
  $('[data-year]').textContent = new Date().getFullYear();

  const nextShow = content.shows[0];
  $('[data-next-month]').textContent = nextShow.month;
  $('[data-next-day]').textContent = nextShow.day;
  $('[data-next-weekday]').textContent = nextShow.weekday;
  $('[data-next-title]').textContent = nextShow.title;
  $('[data-next-location]').textContent = nextShow.location;

  $('[data-shows]').innerHTML = content.shows.slice(1).map(show => `
    <article class="show-row">
      <div class="show-date"><strong>${show.day}</strong><span>${show.month}</span></div>
      <div class="show-info"><h3>${show.title}</h3><p>${show.location}</p></div>
      <span class="show-type">${show.type}</span>
    </article>
  `).join('');

  $('[data-repertoire]').innerHTML = content.repertoire.map(item => `
    <div class="repertoire-row"><span>${item.artist}</span><strong>-</strong><span>${item.song}</span></div>
  `).join('');

  const gallery = window.ROCKTIFIED_GALLERY;
  const mediaGallery = $('[data-media-gallery]');
  const imageItems = gallery.images.slice().sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const videoItems = gallery.videos.slice().sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const mediaItems = [
    ...imageItems.map((src, index) => ({ type: 'image', src, number: index + 1 })),
    ...videoItems.map((src, index) => ({ type: 'video', src, number: index + 1 }))
  ];
  mediaGallery.innerHTML = mediaItems.map(item => {
    const label = item.type === 'image' ? `Foto ${item.number}` : `Video ${item.number}`;
    if (item.type === 'video') {
      return `<article class="media-card media-video-card reveal"><div class="media-frame"><video src="${item.src}" controls preload="metadata" playsinline aria-label="${label}"></video></div></article>`;
    }
    return `<article class="media-card media-photo-card reveal"><div class="media-frame"><img src="${item.src}" alt="${label} van Rocktified" loading="lazy"></div></article>`;
  }).join('');

  const menuButton = $('.menu-toggle');
  const navigation = $('.main-nav');
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', isOpen);
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  const sections = $$('main > section');
  const navLinks = $$('.main-nav a[data-nav]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === entry.target.id));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(element => revealObserver.observe(element));
})();
