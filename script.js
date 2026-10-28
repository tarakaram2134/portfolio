document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  const navLinks = new Map(
    [...document.querySelectorAll('.site-header nav a')]
      .map((link) => [link.getAttribute('href').slice(1), link])
  );

  const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.remove('active'));
      navLinks.get(entry.target.id)?.classList.add('active');
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  document.querySelectorAll('main section[id]')
    .forEach((section) => navigationObserver.observe(section));
});

