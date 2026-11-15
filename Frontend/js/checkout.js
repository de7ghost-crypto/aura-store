// Checkout page: show the order, collect an email if needed, place the order

const API_URL = 'http://localhost:3000/api/orders';

const cart = JSON.parse(localStorage.getItem('cart')) || [];
let token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const layout = document.getElementById('checkout-layout');
const summary = document.getElementById('checkout-summary');
const emptyCart = document.getElementById('empty-cart');
const guestField = document.getElementById('guest-email-field');
const accountNote = document.getElementById('account-note');
const placeOrderBtn = document.getElementById('place-order-btn');
const orderError = document.getElementById('order-error');
const successBox = document.getElementById('order-success');
const successText = document.getElementById('success-text');

function showError(message) {
  orderError.textContent = message;
  orderError.classList.remove('hidden');
}

function renderSummary() {
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  summary.innerHTML = cart
    .map(item => `
      <div class="summary-item">
        <div>
          <h4>${item.name}</h4>
          <p>${[item.size, item.color].filter(Boolean).join(' / ')} · Qty ${item.quantity || 1}</p>
        </div>
        <strong>$${(item.price * (item.quantity || 1)).toFixed(2)}</strong>
      </div>
    `)
    .join('') + `
      <div class="summary-total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    `;
}

// Set up the page for an empty cart, a guest, or a logged in customer
if (cart.length === 0) {
  layout.classList.add('hidden');
  emptyCart.classList.remove('hidden');
} else {
  renderSummary();

  if (token) {
    guestField.classList.add('hidden');
    accountNote.textContent = user && user.email ? `Ordering as ${user.email}` : 'Ordering with your account';
    accountNote.classList.remove('hidden');
  }
}

placeOrderBtn.addEventListener('click', async () => {
  const guestEmail = document.getElementById('guest-email').value.trim();
  orderError.classList.add('hidden');

  if (!token && !guestEmail) {
    showError('Please enter your email so we can confirm your order.');
    return;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = 'Placing your order...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ items: cart, guestEmail })
    });

    const data = await response.json();

    if (!response.ok) {
      // An expired login is treated as a guest by the server, so ask for an email
      if (token && data.error && data.error.includes('Email')) {
        token = null;
        guestField.classList.remove('hidden');
        accountNote.classList.add('hidden');
        showError('Your login has expired. Enter your email to continue as a guest.');
      } else {
        showError(data.error || 'Something went wrong. Please try again.');
      }
      return;
    }

    localStorage.removeItem('cart');
    layout.classList.add('hidden');
    successText.textContent = `Order #${data.id} has been received.`;
    successBox.classList.remove('hidden');
  } catch (error) {
    showError('Could not reach the store. Check that the backend is running.');
  } finally {
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = 'Place order';
  }
});