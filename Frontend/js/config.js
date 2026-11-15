// One place for the backend address.
// On your own computer it talks to localhost, anywhere else it talks to Render.

const API_BASE =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://aura-backend-fgoz.onrender.com';