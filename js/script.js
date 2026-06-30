// =========================
// CARRUSEL DE PROYECTOS
// =========================
// Selecciona el contenedor de slides, los puntos de navegación y las flechas del carrusel.
const slides = document.querySelector('.project-slides');
const dots = document.querySelectorAll('.project-dot');
const navButtons = document.querySelectorAll('.project-nav-btn');

let currentIndex = 0;

// Cambia el proyecto visible y actualiza el estado activo de los puntos de navegación.
function updateCarousel(index) {
  if (!slides) return;

  const totalSlides = slides.children.length;
  currentIndex = (index + totalSlides) % totalSlides;

  // Mueve el carrusel horizontalmente para mostrar el slide seleccionado.
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Marca el punto correspondiente como activo.
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

if (slides) {
  updateCarousel(0);
}

// =========================
// MODAL DE IMÁGENES
// =========================
// Obtiene los elementos del modal y las imágenes que pueden abrirlo.
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('imageModalImg');
const closeModalBtn = document.querySelector('.image-modal-close');
const galleryImages = document.querySelectorAll('.project-gallery img');

// Cierra el modal y lo oculta visualmente.
function closeModal() {
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

// Al hacer clic en una imagen de la galería, se muestra en el modal con la misma imagen y texto alternativo.
galleryImages.forEach((img) => {
  img.addEventListener('click', () => {
    if (!modal || !modalImg) return;

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });
});

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (modal) {
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
}

// =========================
// FORMULARIO DE CONTACTO
// =========================
const contactForm = document.getElementById('contactForm');
const formEndpoint = 'https://script.google.com/macros/s/AKfycbxXxFT1Ta_Y0CxKoaDbo2lZ5KMIRNhPkQuwRKgxaJQkvoB6mPJeYQjHlONn-HXM-SNkCQ/exec';

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success mt-3';
      successMessage.textContent = '¡Gracias! Tu consulta fue enviada correctamente.';

      contactForm.appendChild(successMessage);
      contactForm.reset();

      setTimeout(() => successMessage.remove(), 4000);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);

      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-danger mt-3';
      errorMessage.textContent = 'No se pudo enviar la consulta. Inténtalo nuevamente.';

      contactForm.appendChild(errorMessage);
    }
  });
}
