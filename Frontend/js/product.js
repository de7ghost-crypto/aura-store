// Product page: load one product, build the page, then show related pieces

const API = 'http://localhost:3000/api/products';
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));

const breadcrumb = document.getElementById('breadcrumb');
const root = document.getElementById('product-root');
const relatedSection = document.getElementById('related');

let product = null;
let selectedSize = null;
let selectedColor = null;
let quantity = 1;

// Grey shimmer blocks while the product loads
function showSkeleton() {
  root.innerHTML = `
    <div class="skeleton-box skeleton-image"></div>
    <div>
      <div class="skeleton-box skeleton-text"></div>
      <div class="skeleton-box skeleton-text short"></div>
      <div class="skeleton-box skeleton-text"></div>
    </div>
  `;
}

// Friendly message when something goes wrong
function showMessage(message) {
  breadcrumb.innerHTML = '';
  root.innerHTML = `
    <div class="empty-cart">
      <h2>${message}</h2>
      <a href="shop.html" class="btn">Back to the shop</a>
    </div>
  `;
}

// Build the whole product page from the product data
function renderProduct() {
  document.title = `${product.name} | Aura`;

  breadcrumb.innerHTML = `
    <a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <span>${product.name}</span>
  `;

  const showCategory = product.category && product.category !== 'Uncategorized';

  root.innerHTML = `
    <div class="product-media">
      <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="product-info">
      ${showCategory ? `<span class="eyebrow">${product.category}</span>` : ''}
      <h1>${product.name}</h1>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p class="product-desc">${product.description}</p>

      <div class="option-block">
        <div class="option-label"><strong>Size</strong><span id="chosen-size"></span></div>
        <div class="option-buttons" id="size-options">
          ${product.sizes.map(size => `<button type="button" class="option-btn" data-size="${size}">${size}</button>`).join('')}
        </div>
      </div>

      <div class="option-block">
        <div class="option-label"><strong>Colour</strong><span id="chosen-color"></span></div>
        <div class="option-buttons" id="color-options">
          ${product.colors.map(color => `<button type="button" class="option-btn" data-color="${color}">${color}</button>`).join('')}
        </div>
      </div>

      <div class="option-block">
        <div class="option-label"><strong>Quantity</strong></div>
        <div class="qty-stepper">
          <button type="button" data-qty="-1" aria-label="Fewer">&minus;</button>
          <span id="qty-value">1</span>
          <button type="button" data-qty="1" aria-label="More">+</button>
        </div>
      </div>

      <p id="option-error" class="option-error hidden">Please pick a size and a colour first.</p>
      <button type="button" id="add-btn" class="btn add-btn">Add to cart</button>

      <ul class="product-perks">
        <li>Free delivery on orders over $100</li>
        <li>Easy returns within 14 days</li>
        <li>Secure checkout</li>
      </ul>
    </div>
  `;

  // If there is only one choice, pick it for the shopper
  if (product.sizes.length === 1) pickOption('size', product.sizes[0]);
  if (product.colors.length === 1) pickOption('color', product.colors[0]);
}

// Mark one size or colour as selected
function pickOption(type, value) {
  if (type === 'size') {
    selectedSize = value;
  } else {
    selectedColor = value;
  }

  const containerId = type === 'size' ? 'size-options' : 'color-options';

  document.querySelectorAll(`#${containerId} .option-btn`).forEach(btn => {
    btn.classList.toggle('selected', btn.dataset[type] === value);
  });

  document.getElementById(`chosen-${type}`).textContent = value;
}

function changeQuantity(change) {
  quantity = Math.max(1, quantity + change);
  document.getElementById('qty-value').textContent = quantity;
}

// cart and saveCart() come from main.js
function addToCart(button) {
  const error = document.getElementById('option-error');

  if (!selectedSize || !selectedColor) {
    error.classList.remove('hidden');
    return;
  }

  error.classList.add('hidden');

  cart.push({
    name: product.name,
    price: product.price,
    size: selectedSize,
    color: selectedColor,
    quantity: quantity
  });
  saveCart();

  button.textContent = 'Added to cart';
  setTimeout(() => {
    button.textContent = 'Add to cart';
  }, 1500);
}

// One click listener handles every button on the page (event delegation)
root.addEventListener('click', (event) => {
  const sizeBtn = event.target.closest('[data-size]');
  const colorBtn = event.target.closest('[data-color]');
  const qtyBtn = event.target.closest('[data-qty]');
  const addBtn = event.target.closest('#add-btn');

  if (sizeBtn) pickOption('size', sizeBtn.dataset.size);
  if (colorBtn) pickOption('color', colorBtn.dataset.color);
  if (qtyBtn) changeQuantity(parseInt(qtyBtn.dataset.qty));
  if (addBtn) addToCart(addBtn);
});

// Show up to four other pieces, same category first
async function loadRelated() {
  try {
    const response = await fetch(API);
    const all = await response.json();

    const others = all.filter(p => p.id !== product.id);
    const sameCategory = others.filter(p => p.category === product.category);
    const rest = others.filter(p => p.category !== product.category);
    const picks = [...sameCategory, ...rest].slice(0, 4);

    if (picks.length === 0) return;

    relatedSection.innerHTML = `
      <h2>You might also like</h2>
      <div class="product-grid">
        ${picks.map(item => `
          <div class="product-card">
            <a href="product.html?id=${item.id}">
              <div class="product-image-wrap">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <h3>${item.name}</h3>
            </a>
            <p class="price">$${item.price.toFixed(2)}</p>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    // Related pieces are a bonus, so fail quietly
  }
}

async function loadProduct() {
  if (!productId) {
    showMessage('We could not find that piece.');
    return;
  }

  showSkeleton();

  try {
    const response = await fetch(`${API}/${productId}`);

    if (!response.ok) {
      showMessage('We could not find that piece.');
      return;
    }

    product = await response.json();
    renderProduct();
    loadRelated();
  } catch (error) {
    showMessage('Could not load this product. Check that the backend is running.');
  }
}

loadProduct();