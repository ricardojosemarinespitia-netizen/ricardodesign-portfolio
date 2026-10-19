const ENDPOINT = "https://gekcbhhybrvipnqyrbsi.supabase.co/functions/v1/registro";
const f = document.getElementById("f"), b = document.getElementById("b"), m = document.getElementById("msg");
f.addEventListener("submit", async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  if (!d.nombre.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo.trim())) { m.className = "err"; m.textContent = "Revisa tu nombre y tu correo."; return; }
  b.disabled = true; m.className = ""; m.textContent = "Enviando…";
  try {
    const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
    const j = await r.json();
    if (j.ok) { m.className = "ok"; m.textContent = j.ya_registrado ? "Ya estabas registrado. Te escribiremos pronto." : "¡Listo! Revisa tu correo."; f.reset(); }
    else { m.className = "err"; m.textContent = j.error || "No pudimos registrarte. Inténtalo de nuevo."; }
  } catch { m.className = "err"; m.textContent = "Sin conexión. Inténtalo de nuevo."; }
  b.disabled = false;
});
