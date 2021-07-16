const slider = document.querySelector('.slide-container')
const slides = Array.from(document.querySelectorAll('.slide'));

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let previousTranslate = 0;
let animationID = 0;
let currentIndex = 0;

const touchStart = (index) => (e) => {
  currentIndex = index;
  startPos = getPositionX(e);
  isDragging = true;
  animationID = requestAnimationFrame(animation);
  slider.classList.add('grabbing');
}

const touchEnd = () => {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - previousTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  }

  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }

  setPositionByIndex();

  slider.classList.remove('grabbing');
}

const touchMove = (e) => {
  if (isDragging) {
    const currentPosition = getPositionX(e);
    currentTranslate = previousTranslate + currentPosition - startPos;
  }
}

const getPositionX = (e) => {
  return e.type.includes('mouse')
    ? e.pageX
    : e.touches[0].clientX;
}

const animation = () => {
  setSliderPosition();
  isDragging && requestAnimationFrame(animation);
}

const setSliderPosition = () => {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -window.innerWidth;
  previousTranslate = currentTranslate;
  setSliderPosition();
}

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img');
  slideImage.addEventListener('dragstart', (e) => e.preventDefault())

  // Touch events
  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchend', touchEnd);
  slide.addEventListener('touchmove', touchMove);

  // Mouse events
  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', touchEnd);
  slide.addEventListener('mousemove', touchMove);
});


// Disable context menu
window.oncontextmenu = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

window.addEventListener('resize', setPositionByIndex)

