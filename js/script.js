const slides = document.querySelector('.project-slides');
const dots = document.querySelectorAll('.project-dot');
const navButtons = document.querySelectorAll('.project-nav-btn');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('imageModalImg');
const closeModalBtn = document.querySelector('.image-modal-close');
const galleryImages = document.querySelectorAll('.project-gallery img');

let currentIndex = 0;

function updateCarousel(index) {
  if (!slides) return;

  const totalSlides = slides.children.length;
  currentIndex = (index + totalSlides) % totalSlides;

  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentIndex);
  });
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.direction === 'next' ? 1 : -1;
    updateCarousel(currentIndex + direction);
  });
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    updateCarousel(Number(dot.dataset.index));
  });
});

galleryImages.forEach((img) => {
  img.addEventListener('click', () => {
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });
});

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

updateCarousel(0);
