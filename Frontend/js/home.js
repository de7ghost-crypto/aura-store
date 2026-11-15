const fallbackProducts = [
  { id: 1, name: 'Oversized Cotton Tee', price: 45.00, image: 'bundo-kim-zkHv9pvrE9U-unsplash.jpg', description: 'A relaxed, oversized fit tee in 100% organic cotton. Breathable and built for everyday wear.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Grey'] },
  { id: 2, name: 'Slim Fit Denim Jacket', price: 89.00, image: 'kevin-grieve-JHKD-YFZ9Lk-unsplash.jpg', description: 'A tailored denim jacket with a slim cut, finished with brushed metal buttons.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Black'] },
  { id: 3, name: 'Classic Wool Coat', price: 149.00, image: 'tian-dayong-8UsQoiJLNNQ-unsplash.jpg', description: 'A timeless wool-blend coat, tailored for a structured silhouette that layers well.', sizes: ['S', 'M', 'L'], colors: ['Camel', 'Black', 'Grey'] },
  { id: 4, name: 'Pleated Midi Skirt', price: 65.00, image: 'yuliia-pakhomova-g3AwbdZut70-unsplash.jpg', description: 'A flowing pleated midi skirt with a high waist and soft drape.', sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Cream'] }
];

async function loadProducts() {
  const grid = document.getElementById('product-grid');

  // Show 4 skeleton cards immediately
  grid.innerHTML = Array(4).fill(`
    <div class="skeleton-card">
      <div class="skeleton-box skeleton-image"></div>
      <div class="skeleton-box skeleton-text"></div>
      <div class="skeleton-box skeleton-text short"></div>
    </div>
  `).join('');

  try {
    const response = await fetch('API_BASE + '/api/products');
    if (!response.ok) {
      throw new Error('Request failed');
    }

    const products = await response.json();
    const displayProducts = Array.isArray(products) && products.length ? products : fallbackProducts;

    grid.innerHTML = displayProducts
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
  } catch (error) {
    grid.innerHTML = fallbackProducts
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
  }

  attachAddToCartListeners();
}

loadProducts();