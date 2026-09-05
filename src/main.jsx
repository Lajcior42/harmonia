import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Analityka (Plausible) — prywatna, bez ciasteczek, zgodna z RODO, bez bannera zgody.
// Włącza się dopiero gdy ustawisz zmienną VITE_PLAUSIBLE_DOMAIN (np. "harmonia.pl").
// Konto: https://plausible.io -> "Add a website" -> wpisz tę samą domenę.
const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
if (plausibleDomain) {
  const s = document.createElement("script");
  s.defer = true;
  s.setAttribute("data-domain", plausibleDomain);
  s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
