const cartToggle = document.querySelector('.cart-toggle');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalContainer = document.querySelector('.cart-total');
const clearCartBtn = document.querySelector('.clear-cart-btn');

const localProductImages = {
  'Oversized Cotton Tee': 'bundo-kim-zkHv9pvrE9U-unsplash.jpg',
  'Slim Fit Denim Jacket': 'kevin-grieve-JHKD-YFZ9Lk-unsplash.jpg',
  'Classic Wool Coat': 'tian-dayong-8UsQoiJLNNQ-unsplash.jpg',
  'Pleated Midi Skirt': 'yuliia-pakhomova-g3AwbdZut70-unsplash.jpg',
  'Cargo Trousers': 'sammy-swae-dmtDzF1ybPE-unsplash.jpg',
  'Knit Sweater': 'haryo-setyadi-acn5ERAeSb4-unsplash.jpg',
  'Leather Ankle Boots': 'vicky-cheng-4mLKBKMPoHo-unsplash.jpg',
  'Linen Shirt': 'caio-coelho-QRN47la37gw-unsplash.jpg'
};

function productImageUrl(product) {
  const image = typeof product.image === 'string' ? product.image.trim() : '';
  const isPlaceholder = /placehold\.co|unsplash\.com\/photos/i.test(image);

  if ((!image || isPlaceholder) && localProductImages[product.name]) {
    return new URL(localProductImages[product.name], document.baseURI).href;
  }

  return image;
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
  cartToggle.textContent = `Cart (${cart.length})`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    cartTotalContainer.textContent = '';
    return;
  }

  cartItemsContainer.innerHTML = cart
  .map((item, index) => `
    <div class="cart-item">
      <span>
        ${item.name}
        ${item.size ? ` — ${item.size}` : ''}
        ${item.color ? ` / ${item.color}` : ''}
        ${item.quantity > 1 ? ` × ${item.quantity}` : ''}
      </span>
      <span>
        $${(item.price * (item.quantity || 1)).toFixed(2)}
        <button class="cart-item-remove" data-index="${index}">✕</button>
      </span>
    </div>
  `)
  .join('');

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  cartTotalContainer.innerHTML = `<span>Total</span><span>$${total.toFixed(2)}</span>`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

function attachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.product-card .btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      cart.push({
        name: button.dataset.name,
        price: parseFloat(button.dataset.price)
      });
      saveCart();
    });
  });
}

attachAddToCartListeners();

cartToggle.addEventListener('click', () => {
  cartDropdown.classList.toggle('open');
});

// Event delegation: listen on the container, check what was actually clicked
cartItemsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('cart-item-remove')) {
    const index = event.target.dataset.index;
    cart.splice(index, 1);
    saveCart();
  }
});

clearCartBtn.addEventListener('click', () => {
  cart = [];
  saveCart();
});

updateCartDisplay();
function renderAccountLink() {
  const accountLink = document.getElementById('account-link');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (user) {
    accountLink.innerHTML = `<a href="#" id="logout-btn">Logout</a>`;
    document.getElementById('logout-btn').addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    });
  } else {
    accountLink.innerHTML = `<a href="customer-login.html">Login</a>`;
  }
}

renderAccountLink();