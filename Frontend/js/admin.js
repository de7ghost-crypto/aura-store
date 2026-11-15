const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user || user.role !== 'admin') {
  window.location.href = 'login.html';
}

const API_URL = 'http://localhost:3000/api/products';

const showFormBtn = document.getElementById('show-form-btn');
const formContainer = document.getElementById('product-form-container');
const form = document.getElementById('product-form');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-form-btn');
const productList = document.getElementById('admin-product-list');

const idInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('image');
const descriptionInput = document.getElementById('description');
const sizesInput = document.getElementById('sizes');
const colorsInput = document.getElementById('colors');
const categoryInput = document.getElementById('category');

// Show the form for ADDING a new product
showFormBtn.addEventListener('click', () => {
  form.reset();
  idInput.value = '';
  formTitle.textContent = 'Add Product';
  formContainer.classList.remove('hidden');
});

// Hide the form
cancelBtn.addEventListener('click', () => {
  formContainer.classList.add('hidden');
});

// Load and display all products
async function loadAdminProducts() {
  const response = await fetch(API_URL);
  const products = await response.json();

  productList.innerHTML = products
    .map(product => `
      <div class="admin-product-row">
        <img src="${product.image}" alt="${product.name}">
        <div class="info">
          <h4>${product.name}</h4>
          <p>$${product.price.toFixed(2)}</p>
        </div>
        <div class="actions">
          <button class="edit-btn" data-id="${product.id}">Edit</button>
          <button class="delete-btn" data-id="${product.id}">Delete</button>
        </div>
      </div>
    `)
    .join('');
}

// Handle form submit (both create AND update)
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const productData = {
    name: nameInput.value,
    price: parseFloat(priceInput.value),
    image: imageInput.value,
    description: descriptionInput.value,
    category: categoryInput.value,
    sizes: sizesInput.value.split(',').map(s => s.trim()),
    colors: colorsInput.value.split(',').map(c => c.trim())
  };

  const isEditing = idInput.value !== '';

  const url = isEditing ? `${API_URL}/${idInput.value}` : API_URL;
  const method = isEditing ? 'PUT' : 'POST';

  await fetch(url, {
  method: method,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(productData)
});

  formContainer.classList.add('hidden');
  loadAdminProducts();
});

// Handle Edit and Delete clicks (event delegation, same pattern as your cart)
productList.addEventListener('click', async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;

  if (event.target.classList.contains('delete-btn')) {
    const confirmed = confirm('Delete this product?');
    if (!confirmed) return;

    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    loadAdminProducts();
  }

  if (event.target.classList.contains('edit-btn')) {
    const response = await fetch(`${API_URL}/${id}`);
    const product = await response.json();

    idInput.value = product.id;
    nameInput.value = product.name;
    priceInput.value = product.price;
    imageInput.value = product.image;
    descriptionInput.value = product.description;
    categoryInput.value = product.category;
    sizesInput.value = product.sizes.join(', ');
    colorsInput.value = product.colors.join(', ');

    formTitle.textContent = 'Edit Product';
    formContainer.classList.remove('hidden');
  }
});

loadAdminProducts();
document.getElementById('logout-link').addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});