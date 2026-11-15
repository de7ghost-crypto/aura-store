// Shop page: load products once, then filter, sort and search them in the browser

const grid = document.getElementById('product-grid');
const resultsCount = document.getElementById('results-count');
const searchInput = document.getElementById('search-input');
const categoryPills = document.getElementById('category-pills');
const sortSelect = document.getElementById('sort-select');

const fallbackProducts = [
  { id: 1, name: 'Oversized Cotton Tee', price: 45.00, image: 'bundo-kim-zkHv9pvrE9U-unsplash.jpg', category: 'Men', createdAt: '2024-01-10', description: 'A relaxed, oversized fit tee in 100% organic cotton. Breathable and built for everyday wear.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Grey'] },
  { id: 2, name: 'Slim Fit Denim Jacket', price: 89.00, image: 'kevin-grieve-JHKD-YFZ9Lk-unsplash.jpg', category: 'Men', createdAt: '2024-01-12', description: 'A tailored denim jacket with a slim cut, finished with brushed metal buttons.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Black'] },
  { id: 3, name: 'Classic Wool Coat', price: 149.00, image: 'tian-dayong-8UsQoiJLNNQ-unsplash.jpg', category: 'Women', createdAt: '2024-01-15', description: 'A timeless wool-blend coat, tailored for a structured silhouette that layers well.', sizes: ['S', 'M', 'L'], colors: ['Camel', 'Black', 'Grey'] },
  { id: 4, name: 'Pleated Midi Skirt', price: 65.00, image: 'yuliia-pakhomova-g3AwbdZut70-unsplash.jpg', category: 'Women', createdAt: '2024-01-17', description: 'A flowing pleated midi skirt with a high waist and soft drape.', sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Cream'] },
  { id: 5, name: 'Cargo Trousers', price: 72.00, image: 'sammy-swae-dmtDzF1ybPE-unsplash.jpg', category: 'Accessories', createdAt: '2024-01-18', description: 'Utility-inspired cargo trousers with multiple pockets and an adjustable waist.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Khaki', 'Black'] },
  { id: 6, name: 'Knit Sweater', price: 58.00, image: 'haryo-setyadi-acn5ERAeSb4-unsplash.jpg', category: 'Women', createdAt: '2024-01-20', description: 'A soft ribbed-knit sweater, perfect for layering through colder months.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Cream', 'Navy', 'Burgundy'] },
  { id: 7, name: 'Leather Ankle Boots', price: 120.00, image: 'vicky-cheng-4mLKBKMPoHo-unsplash.jpg', category: 'Accessories', createdAt: '2024-01-24', description: 'Genuine leather ankle boots with a durable rubber sole and stitched detailing.', sizes: ['6', '7', '8', '9', '10'], colors: ['Black', 'Brown'] },
  { id: 8, name: 'Linen Shirt', price: 52.00, image: 'caio-coelho-QRN47la37gw-unsplash.jpg', category: 'Men', createdAt: '2024-01-27', description: 'A breathable linen shirt with a relaxed fit, ideal for warm weather.', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Sky Blue'] }
];

let allProducts = [];
let activeCategory = 'All';

// Shimmer boxes while the data loads
function showSkeletons() {
  grid.innerHTML = Array(8).fill(`
    <div class="skeleton-card">
      <div class="skeleton-box skeleton-image"></div>
      <div class="skeleton-box skeleton-text"></div>
      <div class="skeleton-box skeleton-text short"></div>
    </div>
  `).join('');
}

// Draw whatever list we hand it
function renderProducts(list) {
  if (list.length === 0) {
    grid.innerHTML = '<p class="empty-state">Nothing matches that yet. Try another word or category.</p>';
    resultsCount.textContent = 'Showing 0 products';
    return;
  }

  grid.innerHTML = list
    .map(product => `
      <div class="product-card">
        <a href="product.html?id=${product.id}">
          <div class="product-image-wrap">
            <img src="${productImageUrl(product)}" alt="${product.name}">
          </div>
          <h3>${product.name}</h3>
        </a>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="btn" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
      </div>
    `)
    .join('');

  attachAddToCartListeners();

  resultsCount.textContent = `Showing ${list.length} ${list.length === 1 ? 'product' : 'products'}`;
}

// Apply the search box, the category pill and the sort choice together
function applyFilters() {
  const searchText = searchInput.value.trim().toLowerCase();

  // filter() gives back a new array, so allProducts is never changed
  const result = allProducts.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });

  const sortBy = sortSelect.value;

  if (sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  renderProducts(result);
}

// Typing in the search box
searchInput.addEventListener('input', applyFilters);

// Changing the sort dropdown
sortSelect.addEventListener('change', applyFilters);

// Clicking a category pill (event delegation, same pattern as your cart)
categoryPills.addEventListener('click', (event) => {
  const pill = event.target.closest('.pill');
  if (!pill) return;

  activeCategory = pill.dataset.category;

  categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');

  applyFilters();
});

// Fetch once, then hand over to applyFilters
async function loadProducts() {
  showSkeletons();

  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      throw new Error('Request failed');
    }

    const products = await response.json();
    allProducts = Array.isArray(products) && products.length ? products : fallbackProducts;
  } catch (error) {
    allProducts = fallbackProducts;
  }

  applyFilters();
}

loadProducts();