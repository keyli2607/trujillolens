/* ==========================================================================
   LENS GROUP TRUJILLO — APPOINTMENT & CONTACT MODULE
   ========================================================================== */

function setupAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('apptDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('apptName').value.trim();
    const phone = document.getElementById('apptPhone').value.trim();
    const service = document.getElementById('apptService').value;
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;
    const notes = document.getElementById('apptNotes').value.trim();

    if (!name || !phone || !service || !date) {
      alert('Por favor completa todos los campos requeridos para coordinar tu cita.');
      return;
    }

    const message = 
      `*¡Hola Lens Group Trujillo! Deseo agendar una cita oftálmica / visita a la óptica.*\n\n` +
      `*Nombre:* ${name}\n` +
      `*Teléfono:* ${phone}\n` +
      `*Servicio requerido:* ${service}\n` +
      `*Fecha solicitada:* ${date}\n` +
      `*Turno preferido:* ${time}\n` +
      (notes ? `*Observaciones:* ${notes}\n\n` : `\n`) +
      `¿Podrían confirmarme la disponibilidad en su sede de Trujillo? ¡Muchas gracias!`;

    // Registrar prospecto / cita en Supabase
    if (window.LG?.supabase?.registerAppointment) {
      window.LG.supabase.registerAppointment({ name, phone, service, date, time, notes })
        .catch(err => console.warn('Supabase appointment error:', err));
    }

    const whatsappUrl = `https://wa.me/51958169535?text=${encodeURIComponent(message)}`;

    // Show visual confirmation
    const successBox = document.getElementById('appointmentSuccess');
    if (successBox) {
      successBox.style.display = 'block';
      form.style.display = 'none';
    }

    // Open WhatsApp in new tab
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  });
}

function resetAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  const successBox = document.getElementById('appointmentSuccess');
  if (form && successBox) {
    form.reset();
    form.style.display = 'block';
    successBox.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', setupAppointmentForm);
