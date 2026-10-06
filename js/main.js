// Highlights the section you are reading in the sidebar navigation:
// the last one whose top has passed a line near the top of the screen.

const links = [...document.querySelectorAll('.nav a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href')));

function currentSection() {
  const screen = window.innerHeight;
  const toBottom = document.documentElement.scrollHeight - screen - window.scrollY;

  // At the very bottom, a section picked in the nav wins if it's on screen.
  const picked = sections.find((s) => '#' + s.id === location.hash);
  if (toBottom < 2 && picked && picked.getBoundingClientRect().top < screen) return picked;

  // The last sections are too short to scroll up to the line,
  // so during the last screen of scrolling the line slides down to the bottom edge.
  const base = Math.min(screen / 4, 120);
  const line = toBottom < screen ? screen - toBottom * (screen - base) / screen : base;
  return sections.filter((s) => s.getBoundingClientRect().top <= line).pop() || sections[0];
}

function updateActive() {
  const current = currentSection();
  links.forEach((a, i) => a.classList.toggle('is-active', sections[i] === current));
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateActive();
    ticking = false;
  });
}, { passive: true });
window.addEventListener('resize', updateActive);
window.addEventListener('hashchange', updateActive);
updateActive();

// Clips play only while they are on screen, so the page doesn't download every video up front.
// Visitors who prefer reduced motion get the poster frame and can start a clip themselves.
// Everyone else can pause a clip with a click (or Enter / Space), and it stays paused.
const clips = document.querySelectorAll('video');
const pausedByHand = new Set();

function play(v) {
  if (!pausedByHand.has(v)) v.play().catch(() => {});
}

function togglePause(v) {
  if (v.paused) {
    pausedByHand.delete(v);
    play(v);
  } else {
    pausedByHand.add(v);
    v.pause();
  }
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  clips.forEach((v) => { v.controls = true; });
} else {
  clips.forEach((v) => {
    v.tabIndex = 0;
    v.addEventListener('click', () => togglePause(v));
    v.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      togglePause(v);
    });
  });

  if ('IntersectionObserver' in window) {
    const clipObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) play(target);
        else target.pause();
      });
    }, { rootMargin: '200px 0px' });

    clips.forEach((v) => clipObserver.observe(v));
  } else {
    clips.forEach(play);
  }
}
