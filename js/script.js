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
const formMessage = document.getElementById('formMessage');

// Mostrar un mensaje de estado debajo del formulario.
function showFormMessage(message, type = 'info') {
  if (!formMessage) return;

  formMessage.className = `alert mt-3 ${type === 'success' ? 'alert-success' : type === 'danger' ? 'alert-danger' : 'alert-info'}`;
  formMessage.textContent = message;
}

// Validar que todos los campos estén completos y que el teléfono tenga 9 dígitos.
function validarFormulario(datos) {
  if (!datos.nombre || !datos.pais || !datos.email || !datos.telefono || !datos.consulta) {
    return 'Todos los campos deben completarse.';
  }

  const telefonoSoloNumeros = datos.telefono.replace(/\D/g, '');
  if (telefonoSoloNumeros.length !== 9) {
    return 'El teléfono debe tener exactamente 9 números.';
  }

  return null;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || 'Enviar';

    const datosFormulario = {
      nombre: document.getElementById('nombre')?.value?.trim() || '',
      pais: document.getElementById('pais')?.value?.trim() || '',
      email: document.getElementById('email')?.value?.trim() || '',
      telefono: document.getElementById('telefono')?.value?.trim() || '',
      consulta: document.getElementById('consulta')?.value?.trim() || ''
    };

    const errorValidacion = validarFormulario(datosFormulario);
    if (errorValidacion) {
      showFormMessage(errorValidacion, 'danger');
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }

    // Mostrar el estado de envío al usuario antes de procesar la respuesta.
    showFormMessage('Enviando...', 'info');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Enviamos el JSON al script PHP local.
    try {
      const response = await fetch('bd/bd.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosFormulario)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        showFormMessage('Gracias por tu interés en Delta Logic. Tu consulta es el primer paso hacia una solución digital que impulse tu crecimiento. Te responderemos a la brevedad.', 'success');
        contactForm.reset();
      } else {
        showFormMessage(`No se pudo guardar la consulta: ${result.message || 'Error desconocido'}`, 'danger');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      showFormMessage('No se pudo enviar la consulta. Inténtalo nuevamente.', 'danger');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
