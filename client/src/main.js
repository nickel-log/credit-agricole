import "./index.css";

const LOGO = "/assets/credit-agricole-logo.png";
const helpItems = [
  ["user", "Connexion", "Trouvez de l’aide en cas d’identifiant ou de code personnel oubliés, problème de connexion, ..."],
  ["shield", "Sécurité", "Découvrez nos conseils"],
  ["lock", "Fraude", "Découvrez nos conseils"],
  ["help", "Questions les plus fréquentes", "Trouvez la solution parmi les questions et réponses que les clients se posent le plus souvent."],
  ["tool", "Un problème technique ?", "Nous signaler un problème technique"],
  ["bank", "Banque en ligne", "Découvrez tout ce que vous pouvez faire en ligne"],
];
const keypad = ["6", "4", "2", "0", "5", "9", "1", "7", "3", "8"];
const root = document.querySelector("#root");
const state = { stage: "identifier", loading: "initial", identifier: "", code: "", showCode: false, modal: null };

function icon(name, size = 18) {
  const paths = {
    arrow: `<path d="M4 12h16m-6-6 6 6-6 6"/>`,
    left: `<path d="m15 18-6-6 6-6M9 12h11"/>`,
    x: `<path d="m6 6 12 12M18 6 6 18"/>`,
    user: `<circle cx="12" cy="8" r="3"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>`,
    shield: `<path d="M12 3 19 6v5c0 4.3-2.7 7.4-7 10-4.3-2.6-7-5.7-7-10V6l7-3Z"/><path d="m9.5 12 1.7 1.7 3.4-3.4"/>`,
    lock: `<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>`,
    help: `<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 3.8 1.9c-1 .7-1.5 1.1-1.5 2.2M12 16.7h.01"/>`,
    tool: `<path d="m14.7 6.3 3-3 3 3-3 3"/><path d="M17.7 6.3 11 13l-2-2-6 6 3 3 6-6-2-2 6.7-6.7"/>`,
    bank: `<path d="m3 10 9-6 9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18"/>`,
    eye: `<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>`,
    eyeOff: `<path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3 3.7M6.3 6.4C3.7 8.1 2 12 2 12s3.6 6 10 6c1.1 0 2.1-.2 3-.5"/>`,
    backspace: `<path d="M20 5H9l-6 7 6 7h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z"/><path d="m12 9 4 6m0-6-4 6"/>`,
    check: `<path d="M12 3 19 6v5c0 4.3-2.7 7.4-7 10-4.3-2.6-7-5.7-7-10V6l7-3Z"/><path d="m9.5 12 1.7 1.7 3.4-3.4"/>`,
    file: `<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>`,
    home: `<path d="m3 11 9-8 9 8v9H3z"/><path d="M9 20v-6h6v6"/>`,
    logout: `<path d="M10 5H5v14h5M14 8l4 4-4 4m4-4H9"/>`,
  };
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.help}</svg>`;
}

function brand() { return `<div class="brand" aria-label="Crédit Agricole Languedoc"><img class="brand__image" src="${LOGO}" alt="Crédit Agricole Languedoc"></div>`; }
function topbar() { return `<header class="topbar">${brand()}<button class="close-button" data-action="close" aria-label="Fermer l’aperçu">${icon("x", 17)}<span>Fermer</span></button></header>`; }
function arrowLink(label, action = "") { return `<button class="find-link" data-action="${action}">${label} ${icon("arrow", 14)}</button>`; }

function loadingScreen(type) {
  const initial = type === "initial";
  return `<section class="loading-screen" aria-live="polite" aria-busy="true">
    <div class="loading-brand-wrap"><div class="loading-spinner" aria-hidden="true"></div><div class="loading-logo">${brand()}</div></div>
    <p class="loading-kicker">Crédit Agricole du Languedoc</p>
    <h1>${initial ? "Préparation de votre espace" : "Connexion en cours"}</h1>
    <p class="loading-caption">${initial ? "Veuillez patienter quelques instants" : "Vérification de vos informations sécurisées"}</p>
  </section>`;
}

function assistance() {
  return `<section class="support-section" aria-labelledby="support-title"><div class="support-heading"><h2 id="support-title">Vous avez besoin d’assistance ?</h2></div><div class="support-grid">${helpItems.map(([ico, title, text], i) => `<article class="support-card" style="animation-delay:${i * 45 + 110}ms"><div class="support-card__icon">${icon(ico, 17)}</div><div class="support-card__body"><h3>${title}</h3><p>${text}</p><button class="support-card__link" data-action="help" data-title="${title}">Accéder ${icon("arrow", 14)}</button></div></article>`).join("")}</div></section>`;
}

function identifierPage() {
  return `<section class="login-hero" aria-labelledby="page-title"><div class="hero-orb hero-orb--left"></div><div class="hero-orb hero-orb--right"></div><div class="login-panel"><h1 id="page-title">Accéder à mon espace client</h1><form class="login-form" data-form="identifier" novalidate><div class="field-head"><label for="identifier">Identifiant</label><span>Saisissez votre identifiant</span></div><input id="identifier" name="identifier" type="text" placeholder="Identifiant" autocomplete="username"><p class="field-error" data-error="identifier"></p>${arrowLink("Où trouver mon identifiant ?", "identifier-help")}<button class="submit-button" type="submit">Valider ${icon("arrow", 16)}</button><p class="new-customer">Vous n’êtes pas encore client ? <button type="button" data-action="new-customer">Devenir client</button></p></form></div></section>`;
}

function codePage() {
  const slots = Array.from({ length: 6 }, (_, i) => `<span class="code-digit ${state.code[i] ? "code-digit--filled" : ""}">${state.code[i] ? (state.showCode ? state.code[i] : "•") : "-"}</span>`).join("");
  return `<section class="login-hero code-hero" aria-labelledby="page-title"><div class="hero-orb hero-orb--left"></div><div class="hero-orb hero-orb--right"></div><div class="login-panel"><h1 id="page-title">Accéder à mon espace client</h1><form class="login-form passcode-form" data-form="code"><div class="field-head"><label>Code personnel</label><span>Saisissez votre code personnel à l’aide du clavier ci-dessous</span></div><div class="code-entry" tabindex="-1"><div class="code-inputs">${slots}</div><button type="button" class="show-code" data-action="toggle-code" aria-label="${state.showCode ? "Masquer" : "Afficher"} le code">${icon(state.showCode ? "eyeOff" : "eye", 21)}</button></div>${arrowLink("J’ai oublié ou perdu mon code personnel", "code-help")}<div class="keypad" aria-label="Clavier numérique">${keypad.map(n => `<button type="button" class="keypad__key" data-digit="${n}">${n}</button>`).join("")}<button type="button" class="keypad__key keypad__backspace" data-action="backspace" aria-label="Effacer le dernier chiffre">${icon("backspace", 21)}</button></div><div class="form-actions"><button type="button" class="back-link" data-action="back">${icon("left", 14)} Retour</button><button class="submit-button connect-button" type="submit">Se connecter ${icon("arrow", 16)}</button></div></form></div></section>`;
}

function welcomePage() {
  return `<section class="welcome-page" aria-labelledby="welcome-title"><div class="welcome-orb"></div><div class="welcome-panel"><div class="welcome-icon">${icon("check", 30)}</div><p class="section-kicker">Connexion réussie</p><h1 id="welcome-title">Bienvenue dans votre espace client</h1><p class="welcome-text">Bonjour, votre connexion simulée est active. Retrouvez ici un aperçu de vos services Crédit Agricole du Languedoc.</p><div class="welcome-user">${icon("user", 17)}<span>Identifiant : <strong>${escapeHtml(state.identifier)}</strong></span></div><div class="welcome-actions"><button class="welcome-card" data-action="placeholder"><span class="welcome-card__icon">${icon("bank", 19)}</span><span><strong>Mes comptes</strong><small>Consulter vos comptes</small></span>${icon("arrow", 16)}</button><button class="welcome-card" data-action="placeholder"><span class="welcome-card__icon">${icon("file", 19)}</span><span><strong>Mes documents</strong><small>Retrouver vos relevés</small></span>${icon("arrow", 16)}</button><button class="welcome-card" data-action="placeholder"><span class="welcome-card__icon">${icon("home", 19)}</span><span><strong>Mon agence</strong><small>Contacter votre conseiller</small></span>${icon("arrow", 16)}</button></div><button class="logout-button" data-action="logout">${icon("logout", 16)} Se déconnecter</button></div></section>`;
}

function modal(title) {
  const text = title.includes("code") || title.includes("identifiant") ? "Pour cette démonstration, cette rubrique explique simplement le parcours sécurisé. Aucune donnée sensible n’est enregistrée." : "Cette rubrique d’assistance est prête à vous accompagner depuis votre espace sécurisé.";
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" data-action="close-modal" aria-label="Fermer">${icon("x", 18)}</button><div class="modal-icon">${icon("help", 21)}</div><p class="section-kicker">Information</p><h2 id="modal-title">${title}</h2><p>${text}</p><button class="modal-action" data-action="close-modal">Compris ${icon("arrow", 16)}</button></div></div>`;
}

function render() {
  const visible = state.loading ? loadingScreen(state.loading) : state.stage === "welcome" ? welcomePage() : state.stage === "code" ? codePage() : identifierPage();
  root.innerHTML = `${topbar()}${visible}${!state.loading && state.stage !== "welcome" ? assistance() : ""}${!state.loading && state.stage === "welcome" ? `<footer class="page-footer"><span>Crédit Agricole du Languedoc</span><span class="footer-dot"></span><span>Une banque proche de vous</span></footer>` : ""}${state.modal ? modal(state.modal) : ""}`;
  bindEvents();
}

function setNotice(message) { const toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); toast.innerHTML = `${icon("check", 18)} ${message}`; document.body.appendChild(toast); window.setTimeout(() => toast.remove(), 4300); }
function escapeHtml(value) { return value.replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c])); }
function codeDigit(digit) { if (state.code.length < 6) { state.code += digit; render(); } }
function backspace() { state.code = state.code.slice(0, -1); render(); }
function bindEvents() {
  root.querySelectorAll("[data-digit]").forEach(button => button.addEventListener("click", () => codeDigit(button.dataset.digit)));
  root.querySelectorAll("[data-action]").forEach(element => element.addEventListener("click", event => handleAction(event, element.dataset.action, element.dataset.title)));
  const form = root.querySelector("[data-form]");
  if (form) form.addEventListener("submit", event => { event.preventDefault(); if (form.dataset.form === "identifier") submitIdentifier(form); else submitCode(); });
}
function handleAction(event, action, title) {
  if (action === "close") setNotice("Vous pouvez fermer cet aperçu à tout moment.");
  if (action === "toggle-code") { state.showCode = !state.showCode; render(); }
  if (action === "backspace") backspace();
  if (action === "back") { state.stage = "identifier"; state.code = ""; render(); }
  if (action === "logout") { state.stage = "identifier"; state.identifier = ""; state.code = ""; render(); setNotice("Vous êtes déconnecté de la démonstration."); }
  if (action === "identifier-help") { state.modal = "Où trouver mon identifiant ?"; render(); }
  if (action === "code-help") { state.modal = "J’ai oublié ou perdu mon code personnel"; render(); }
  if (action === "new-customer") { state.modal = "Devenir client"; render(); }
  if (action === "help") { state.modal = title; render(); }
  if (action === "close-modal") { if (event.target === event.currentTarget || event.currentTarget.classList.contains("modal-close") || event.currentTarget.classList.contains("modal-action")) { state.modal = null; render(); } }
  if (action === "placeholder") setNotice("Cette rubrique sera bientôt disponible dans votre espace.");
}
function submitIdentifier(form) {
  const input = form.querySelector("#identifier");
  if (!input.value.trim()) { const error = form.querySelector('[data-error="identifier"]'); error.textContent = "Veuillez saisir votre identifiant."; input.focus(); return; }
  state.identifier = input.value.trim(); state.stage = "code"; state.code = ""; render(); setNotice("Identifiant accepté pour cette démonstration.");
}
function submitCode() {
  if (state.code.length < 6) { setNotice("Veuillez saisir les 6 chiffres de votre code personnel."); return; }
  state.loading = "connection"; render();
  const request = fetch("/api/demo-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: state.identifier }) }).catch(() => ({ ok: true }));
  Promise.all([request, new Promise(resolve => window.setTimeout(resolve, 1550))]).then(() => {
    state.loading = null;
    state.stage = "welcome";
    render();
    setNotice("Connexion simulée réussie.");
  });
}

render();
window.setTimeout(() => { if (state.loading === "initial") { state.loading = null; render(); } }, 1350);
