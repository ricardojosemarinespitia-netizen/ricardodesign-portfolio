/* Configuración de medición — OBSOLETO desde el 19 oct 2026.
   La medición (GA4, Microsoft Clarity, píxel de Meta) y el consentimiento viven ahora en js/cookies.js: los IDs están en el objeto RD_IDS de ese archivo.
   Este objeto se deja apagado para que assets/js/app.js no empuje eventos a un dataLayer que no existe. */
window.RD_MEDICION = { gtmId: null, activo: false };
