const carouselTrack = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const prevButton = document.querySelector('.carousel-btn.prev');
const nextButton = document.querySelector('.carousel-btn.next');
const scrollProgress = document.getElementById('scrollProgress');
const heroMedia = document.querySelector('.hero-media');
const pickButtons = document.querySelectorAll('.pick-button');

let currentSlide = 0;
let autoSlideInterval;

function getSlides() {
  return Array.from(carouselTrack.querySelectorAll('.slide'));
}

function buildDots() {
  const slides = getSlides();
  dotsContainer.innerHTML = '';

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para foto ${index + 1}`);
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
      restartAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
}

function updateCarousel() {
  const slides = getSlides();
  if (!slides.length) return;

  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;

  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  const dots = dotsContainer.querySelectorAll('button');
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === currentSlide);
  });
}

function nextSlide() {
  currentSlide += 1;
  updateCarousel();
}

function prevSlide() {
  currentSlide -= 1;
  updateCarousel();
}

function startAutoSlide() {
  autoSlideInterval = window.setInterval(() => {
    nextSlide();
  }, 5500);
}

function restartAutoSlide() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  startAutoSlide();
}

function handleScrollEffects() {
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (heroMedia) {
    const shift = Math.min(window.scrollY * 0.08, 28);
    heroMedia.style.setProperty('--hero-shift', `${shift}px`);
  }
}

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      pickButtons.forEach((button) => {
        const target = button.getAttribute('href') || '';
        button.classList.toggle('is-current', target === `#${entry.target.id}`);
      });
    });
  },
  {
    threshold: 0.55,
  }
);

if (prevButton && nextButton) {
  prevButton.addEventListener('click', () => {
    prevSlide();
    restartAutoSlide();
  });

  nextButton.addEventListener('click', () => {
    nextSlide();
    restartAutoSlide();
  });
}

if (pickButtons[0]) {
  pickButtons[0].classList.add('is-current');
}

revealElements.forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.experience-block').forEach((section) => {
  sectionObserver.observe(section);
});

window.addEventListener('scroll', handleScrollEffects, { passive: true });
window.addEventListener('load', handleScrollEffects);

buildDots();
updateCarousel();
startAutoSlide();
handleScrollEffects();
