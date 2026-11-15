const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  { name: "Oversized Cotton Tee", price: 45.00, image: "bundo-kim-zkHv9pvrE9U-unsplash.jpg", description: "A relaxed, oversized fit tee in 100% organic cotton. Breathable and built for everyday wear.", sizes: ["S", "M", "L", "XL"], colors: ["Black", "White", "Grey"] },
  { name: "Slim Fit Denim Jacket", price: 89.00, image: "kevin-grieve-JHKD-YFZ9Lk-unsplash.jpg", description: "A tailored denim jacket with a slim cut, finished with brushed metal buttons.", sizes: ["S", "M", "L", "XL"], colors: ["Blue", "Black"] },
  { name: "Classic Wool Coat", price: 149.00, image: "tian-dayong-8UsQoiJLNNQ-unsplash.jpg", description: "A timeless wool-blend coat, tailored for a structured silhouette that layers well.", sizes: ["S", "M", "L"], colors: ["Camel", "Black", "Grey"] },
  { name: "Pleated Midi Skirt", price: 65.00, image: "yuliia-pakhomova-g3AwbdZut70-unsplash.jpg", description: "A flowing pleated midi skirt with a high waist and soft drape.", sizes: ["XS", "S", "M", "L"], colors: ["Black", "Cream"] },
  { name: "Cargo Trousers", price: 72.00, image: "sammy-swae-dmtDzF1ybPE-unsplash.jpg", description: "Utility-inspired cargo trousers with multiple pockets and an adjustable waist.", sizes: ["S", "M", "L", "XL"], colors: ["Khaki", "Black"] },
  { name: "Knit Sweater", price: 58.00, image: "haryo-setyadi-acn5ERAeSb4-unsplash.jpg", description: "A soft ribbed-knit sweater, perfect for layering through colder months.", sizes: ["S", "M", "L", "XL"], colors: ["Cream", "Navy", "Burgundy"] },
  { name: "Leather Ankle Boots", price: 120.00, image: "vicky-cheng-4mLKBKMPoHo-unsplash.jpg", description: "Genuine leather ankle boots with a durable rubber sole and stitched detailing.", sizes: ["6", "7", "8", "9", "10"], colors: ["Black", "Brown"] },
  { name: "Linen Shirt", price: 52.00, image: "caio-coelho-QRN47la37gw-unsplash.jpg", description: "A breathable linen shirt with a relaxed fit, ideal for warm weather.", sizes: ["S", "M", "L", "XL"], colors: ["White", "Sky Blue"] }
];

async function main() {
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('Seeded 8 products successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });