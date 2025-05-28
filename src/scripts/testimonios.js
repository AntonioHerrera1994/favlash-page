let currentIndex = 0;
const slider = document.getElementById('slider');
const totalSlides = Math.floor(slider.children.length / 2);

function moveSlide(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = totalSlides - 1;
  if (currentIndex >= totalSlides) currentIndex = 0;
  slider.style.transform = `translateX(-${100 * currentIndex}%)`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('next').addEventListener('click', () => moveSlide(1));
  document.getElementById('prev').addEventListener('click', () => moveSlide(-1));
  setInterval(() => moveSlide(1), 5000);
});
