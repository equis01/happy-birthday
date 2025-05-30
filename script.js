// JavaScript para la cuenta regresiva
const targetDate = new Date("November 12, 2025 15:00:00").getTime();

const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    if (distance < 0) {
        clearInterval(countdownFunction);
        document.getElementById("countdown").innerHTML = "¡La fiesta ha comenzado!";
    }
}, 1000);

// JavaScript para la música de fondo y overlay de inicio
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const welcomeOverlay = document.getElementById('welcomeOverlay');
let isPlaying = false; // Estado inicial de la música

// Función para activar la música y ocultar el overlay
function activatePage() {
    welcomeOverlay.classList.add('hidden'); // Oculta el overlay
    // Asegura que la música se intente reproducir solo después del clic
    backgroundMusic.play().then(() => {
        console.log('Música de fondo reproduciéndose después de la interacción.');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>'; // Icono de música activa
        musicToggle.classList.add('playing');
        isPlaying = true;
    }).catch(error => {
        console.warn('La reproducción de música aún fue bloqueada o falló:', error);
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Icono de silencio
        musicToggle.classList.remove('playing');
        isPlaying = false;
    });

    // Eliminar el event listener una vez que la página ha sido activada
    welcomeOverlay.removeEventListener('click', activatePage);
    document.body.removeEventListener('click', activatePage); // Para el caso de que el overlay falle
}

// Event listener para el primer clic en el overlay o en el body
welcomeOverlay.addEventListener('click', activatePage);
// Fallback por si el overlay es difícil de clickear en algunos casos
// document.body.addEventListener('click', activatePage, { once: true }); // Usar { once: true } para que solo se ejecute una vez


musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Icono de silencio
        musicToggle.classList.remove('playing');
    } else {
        backgroundMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>'; // Icono de música activa
        musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// JavaScript para la ventana modal del formulario
const rsvpModal = document.getElementById('rsvpModal');
const openRsvpFormBtn = document.getElementById('openRsvpForm');
const closeRsvpModalButton = document.querySelector('.close-rsvp-modal');
const rsvpForm = document.getElementById('rsvpForm');

// Modal de error de capacidad
const capacityErrorModal = document.getElementById('capacityErrorModal');
const closeErrorModalButtons = document.querySelectorAll('.close-error-modal');

// Nuevo Modal de Confirmación de Envío Exitoso
const successModal = document.getElementById('successModal');
const closeSuccessModalButtons = document.querySelectorAll('.close-success-modal');


// Abrir modal de RSVP
openRsvpFormBtn.addEventListener('click', () => {
    rsvpModal.style.display = 'flex';
});

// Cerrar modal de RSVP (cruz)
closeRsvpModalButton.addEventListener('click', () => {
    rsvpModal.style.display = 'none';
});

// Cerrar modals al hacer clic fuera
window.addEventListener('click', (event) => {
    if (event.target == rsvpModal) {
        rsvpModal.style.display = 'none';
    } else if (event.target == capacityErrorModal) {
        capacityErrorModal.style.display = 'none';
    } else if (event.target == successModal) { // Cierra el modal de éxito también
        successModal.style.display = 'none';
    }
});

// Cierre del modal de error (tanto la "x" como el botón "Entendido")
closeErrorModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        capacityErrorModal.style.display = 'none';
    });
});

// Cierre del modal de éxito
closeSuccessModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        successModal.style.display = 'none';
    });
});


// Manejar el envío del formulario (¡REAL AHORA CON GAS!)
// **IMPORTANTE:** Reemplaza la URL con la de tu Web App de Google Apps Script
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxL_R9TR4DnuA0PNbscjL__YDzZSvH5TyW-lwpt-UTLFN-0jT31Ar1wWHpb-2j-WQzK/exec";

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const totalInvitados = parseInt(document.getElementById('totalInvitados').value);

    if (totalInvitados > 6) {
        rsvpModal.style.display = 'none'; // Cierra el modal de RSVP
        capacityErrorModal.style.display = 'flex'; // Abre el modal de error
        return; // Detiene el envío del formulario
    }

    // Preparar los datos del formulario
    const formData = new FormData(rsvpForm);
    
    // Realizar el envío usando Fetch API al script GAS
    fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        body: formData // Envía los datos del formulario directamente
    })
    .then(response => response.json()) // Espera una respuesta JSON del script GAS
    .then(result => {
        console.log('Respuesta de GAS:', result);
        if (result.result === "success") {
            rsvpModal.style.display = 'none'; // Cierra el modal de RSVP
            successModal.style.display = 'flex'; // Abre el modal de éxito
            rsvpForm.reset(); // Reinicia el formulario después del éxito
        } else {
            // Manejar errores de GAS (por ejemplo, si la hoja no existe o hay un problema en el script)
            alert('Hubo un error al enviar tu confirmación. Intenta de nuevo o contacta a los organizadores. Mensaje: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error al enviar el formulario (fetch):', error);
        alert('Hubo un error de conexión. Por favor, revisa tu conexión a internet o intenta más tarde.');
    });
});


// Funcionalidad para la ubicación (al hacer clic en Lugar y la dirección)
const eventLocationElement = document.getElementById('eventLocation');
const eventAddressElement = document.querySelector('.location-address');

const address = "Calle de la Torre 123, Ciudad Mágica"; // La dirección real

function openMapLink() {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent); // Detección más robusta
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`; // API de Google Maps más moderna
    const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;

    if (isMobile) {
        // En móviles, ofrecer Waze o Maps
        if (confirm("¿Abrir en Waze (aceptar) o Google Maps (cancelar)?")) {
            window.open(wazeUrl, '_blank');
        } else {
            window.open(googleMapsUrl, '_blank');
        }
    } else {
        // En desktop, abrir Google Maps
        window.open(googleMapsUrl, '_blank');
    }
}

eventLocationElement.addEventListener('click', openMapLink);
eventAddressElement.addEventListener('click', openMapLink);


// Funcionalidad para añadir al calendario (al hacer clic en Fecha y HORA)
const eventDateElement = document.getElementById('eventDate');
const eventTimeElement = document.getElementById('eventTime');

const eventTitle = "Cumpleaños de Iris Sofía";
const eventDescription = "Acompáñanos a celebrar los 3 años de Iris Sofía, estilo Rapunzel. ¡Será mágico!";
const eventLocationText = "Salón de Eventos El Reino Encantado, Calle de la Torre 123, Ciudad Mágica";

// Fecha y hora del evento
// Formato de fecha y hora ISO 8601 para compatibilidad
// La fecha es 12 de noviembre de 2025 a las 3:00 PM
const startTime = new Date("2025-11-12T15:00:00");
const endTime = new Date(startTime.getTime() + (3 * 60 * 60 * 1000)); // Duración de 3 horas

const startDate = startTime.toISOString().replace(/-|:|\.\d{3}/g, '');
const endDate = endTime.toISOString().replace(/-|:|\.\d{3}/g, '');

function openCalendarLink() {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocationText)}&dates=${startDate}/${endDate}`;
    window.open(googleCalendarUrl, '_blank');
}

eventDateElement.addEventListener('click', openCalendarLink);
eventTimeElement.addEventListener('click', openCalendarLink);
