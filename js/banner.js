
function showMainContent() {
  const banner = document.getElementById('banner');
  const dotsContainer = document.querySelector('.banner-dots');

  banner.innerHTML = '';
  dotsContainer.innerHTML = '';

  const slides = [];
  const dots = [];

  const slide2 = document.createElement('img');
  slide2.classList.add('slide');
  slide2.src = '../assets/banner.png';

  const slide3Container = document.createElement('div');
  slide3Container.classList.add('slide');

  const slide3 = document.createElement('video');
  slide3.classList.add('slide');
  slide3.muted = true;
  slide3.loop = true;
  slide3.playsInline = true;
  slide3.preload = 'auto';

  const videoSourceWebM = document.createElement('source');
  videoSourceWebM.src = '../assets/pumpkin.webm';
  videoSourceWebM.type = 'video/webm';
  slide3.appendChild(videoSourceWebM);

  const soundToggle = document.createElement('div');
  soundToggle.classList.add('video-button', 'glass', 'glass--border-full');
  soundToggle.type = 'button';
  soundToggle.innerHTML = `
          <svg class="mute-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <line x1="2" y1="22" x2="22" y2="2" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2"/>
          </svg>`;

  slide3Container.appendChild(slide3);
  slide3Container.appendChild(soundToggle);

  soundToggle.addEventListener('click', () => this.toggleSound());

  const slide4 = document.createElement('img');
  slide4.classList.add('slide');
  slide4.src = 'https://media.giphy.com/media/26n6WgS456BJN3JwA/giphy.gif';

  slides.push(slide2, slide3Container, slide4);

  slides.forEach((slide, index) => {
    banner.appendChild(slide);

    const dot = document.createElement('button');
    dot.classList.add('banner-dot');
    dot.setAttribute('data-index', index);
    dotsContainer.appendChild(dot);
    dots.push(dot);

    dot.addEventListener('click', () => {
      this.goToSlide(index);
    });
  });

  this.bannerElements = {
    slides,
    dots,
    currentSlide: 0,
    soundToggle,
  };
  this.addScrollHandler();
  this.goToSlide(0);
}

function addScrollHandler() {
  const banner = document.getElementById('banner');

  banner.addEventListener('scroll', () => {
    const scrollTop = banner.scrollTop;
    const bannerHeight = banner.clientHeight;

    const currentIndex = Math.round(scrollTop / bannerHeight);

    this.updateActiveSlide(currentIndex);
  });
}

function updateActiveSlide(index) {
  const { slides, dots, soundToggle, currentSlide } = this.bannerElements;

  if (currentSlide === index) return;

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  const currentVideo = this.findVideoInSlide(slides[currentSlide]);
  if (currentVideo) {
    currentVideo.pause();
    soundToggle.style.display = 'none';
  }

  slides[index].classList.add('active');
  dots[index].classList.add('active');

  const nextVideo = this.findVideoInSlide(slides[index]);
  if (nextVideo) {
    nextVideo.play().catch(e => {
      nextVideo.muted = true;
      nextVideo.play().catch(e2 => {
        console.log('Still cannot play:', e2);
      });
    });

    soundToggle.style.display = 'flex';
  } else {
    soundToggle.style.display = 'none';
  }

  this.bannerElements.currentSlide = index;
}

function findVideoInSlide(slide) {
  if (slide.tagName === 'VIDEO') {
    return slide;
  }

  const video = slide.querySelector('video');
  if (video) {
    return video;
  }

  const videos = slide.getElementsByTagName('video');
  return videos.length > 0 ? videos[0] : null;
}

function goToSlide(index) {
  const { slides, dots, soundToggle, currentSlide } = this.bannerElements;

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  const currentSlideElement = slides[currentSlide];
  let currentVideo = null;

  if (
    currentSlideElement.classList.contains('slide') &&
    currentSlideElement.children.length > 0
  ) {
    currentVideo = currentSlideElement.querySelector('video');
  }

  if (currentVideo) {
    currentVideo.pause();
    soundToggle.style.display = 'none';
  }

  slides[index].classList.add('active');
  dots[index].classList.add('active');

  const nextSlideElement = slides[index];
  let nextVideo = null;

  if (
    nextSlideElement.classList.contains('slide') &&
    nextSlideElement.children.length > 0
  ) {
    nextVideo = nextSlideElement.querySelector('video');
  }

  if (nextVideo) {
    nextVideo
      .play()
      .then(() => {
        soundToggle.style.display = 'flex';
      })
      .catch(e => {
        console.log('Autoplay error:', e);
        soundToggle.style.display = 'none';
      });
  } else {
    soundToggle.style.display = 'none';
  }

  const slideOffsetTop = slides[index].offsetTop;
  banner.scrollTo({
    top: slideOffsetTop,
    behavior: 'smooth',
  });

  this.bannerElements.currentSlide = index;
}

function toggleSound() {
  const { slides, currentSlide, soundToggle } = this.bannerElements;
  const slide = slides[currentSlide];

  // Используем ту же функцию поиска видео
  const video = this.findVideoInSlide(slide);

  if (video) {
    video.muted = !video.muted;
    soundToggle.innerHTML = video.muted
      ? (soundToggle.innerHTML = `
          <svg class="mute-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <line x1="2" y1="22" x2="22" y2="2" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2"/>
          </svg>
        `)
      : (soundToggle.innerHTML = `
              <svg class="mute-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2">
                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            `);
  }
}

let slideInterval;

function getNextSlideIndex() {
  const activeSlide = document.querySelector('.slide.active');
  const allSlides = document.querySelectorAll('.slide');

  if (!activeSlide) {
    return 0;
  }

  const currentIndex = Array.from(allSlides).indexOf(activeSlide);
  const nextIndex = (currentIndex + 1) % allSlides.length;

  return nextIndex;
}

function startSlideShow() {
  slideInterval = setInterval(() => {
    const nextIndex = getNextSlideIndex();
    goToSlide(nextIndex);
  }, 30000);
}

function stopSlideShow() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function setupSwipeDetection() {
  const sliderContainer =
    document.querySelector('.slides-container') || document.body;
  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  sliderContainer.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = false;
    stopSlideShow();
  });

  sliderContainer.addEventListener('touchmove', e => {
    if (!startX || !startY) return;

    const diffX = e.touches[0].clientX - startX;
    const diffY = e.touches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isSwiping = true;
    }
  });

  sliderContainer.addEventListener('touchend', () => {
    if (isSwiping) {
      setTimeout(startSlideShow, 5000);
    } else {
      startSlideShow();
    }

    startX = 0;
    startY = 0;
    isSwiping = false;
  });

  sliderContainer.addEventListener('mousedown', stopSlideShow);
  sliderContainer.addEventListener('mouseup', () => {
    setTimeout(startSlideShow, 3000);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  showMainContent();
  startSlideShow();
  setupSwipeDetection();
});
