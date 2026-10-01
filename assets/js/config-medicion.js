/* Configuración de medición (plan §9.1).
   DESACTIVADA. No se inventan IDs. Para activar:
   1) El dueño entrega su ID de Google Tag Manager (formato GTM-XXXXXXX).
      GA4, Meta Pixel y Clarity se configuran DENTRO de GTM, no aquí.
   2) La página /privacidad/ debe estar completa (sin {{placeholders}}).
   3) Ampliar la CSP de todas las páginas y de _headers (ver LEEME.md).
   4) Poner activo:true y el gtmId real. El banner de cookies aparecerá solo. */
window.RD_MEDICION = { gtmId: null, activo: false };
