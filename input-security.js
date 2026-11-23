/* ATROPOLIES Stage 2.6: browser-side input safety helpers.
   These improve UX and reduce accidental unsafe rendering. They are NOT a
   security boundary: repeat all important validation and authorization server-side. */
(() => {
  'use strict';

  const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

  function cleanText(value, maxLength = 200) {
    return String(value ?? '').replace(CONTROL_CHARS, '').trim().slice(0, maxLength);
  }

  function normalizeEmail(value) {
    return cleanText(value, 254).toLowerCase();
  }

  function validEmail(value) {
    const email = normalizeEmail(value);
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validDisplayName(value) {
    const name = cleanText(value, 80);
    return name.length >= 2 && name.length <= 80 && !/[<>]/.test(name);
  }

  function validPassword(value) {
    return typeof value === 'string' && value.length >= 12 && value.length <= 128;
  }

  function setText(element, value, maxLength = 500) {
    if (element) element.textContent = cleanText(value, maxLength);
  }

  // Lightweight duplicate-submit guard. Real abuse prevention belongs at the
  // Supabase Auth/API/server layer, because browser controls can be bypassed.
  const lastSubmit = new Map();
  function allowSubmit(key, cooldownMs = 3000) {
    const now = Date.now();
    const previous = lastSubmit.get(key) || 0;
    if (now - previous < cooldownMs) return false;
    lastSubmit.set(key, now);
    return true;
  }

  window.ATROPOLIES_INPUT = Object.freeze({
    cleanText, normalizeEmail, validEmail, validDisplayName,
    validPassword, setText, allowSubmit
  });
})();
