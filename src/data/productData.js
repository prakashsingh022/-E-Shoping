// Unified product data for the entire application
export const allProducts = [
  // KURTA SETS
  {
    id: 1,
    name: "Floral Suit Set",
    image: "/Images/Grey.jpg",
    priceBefore: 2499,
    priceAfter: 1999,
    category: "Kurta sets",
    description: "Beautiful floral printed suit set made with soft cotton."
  },
  {
    id: 2,
    name: "Pastel Embroidered Set",
    image: "/Images/Black.jpg",
    priceBefore: 2799,
    priceAfter: 2239,
    category: "Kurta sets",
    description: "Elegant pastel suit set with hand embroidery."
  },
  {
    id: 3,
    name: "Blue Floral Cotton Set",
    image: "/Images/blue-flower.jpg",
    priceBefore: 2399,
    priceAfter: 1899,
    category: "Kurta sets",
    description: "Soft cotton suit set with floral blue design."
  },
  {
    id: 4,
    name: "Classic Blue Set",
    image: "/Images/Blue.jpg",
    priceBefore: 2599,
    priceAfter: 2079,
    category: "Kurta sets",
    description: "Classy navy blue suit set with dupatta."
  },

  // JUST LAUNCHED
  {
    id: 5,
    name: "Rani Pink Radiance Set",
    image: "/Images/White-Red.jpg",
    priceBefore: 3999,
    priceAfter: 2999,
    category: "Just Launched",
    description: "Elegant Rani Pink Radiance Suit Set perfect for festive wear."
  },
  {
    id: 6,
    name: "Indigo Printed Set",
    image: "/Images/indigo.png",
    priceBefore: 4299,
    priceAfter: 3199,
    category: "Just Launched",
    description: "Beautiful Indigo printed suit set."
  },

  // KURTI & TOP
  {
    id: 7,
    name: "Pink Blue Cotton Top",
    image: "/Images/pink-blue.jpg",
    priceBefore: 2299,
    priceAfter: 1839,
    category: "Kurti & Top",
    description: "Cotton suit set in pastel pink & blue shades."
  },
  {
    id: 8,
    name: "Yellow Cotton Daily wear",
    image: "/Images/yellow-cotton.jpg",
    priceBefore: 1999,
    priceAfter: 1599,
    category: "Kurti & Top",
    description: "Simple and elegant cotton yellow daily wear set."
  },

  // BOTTOMS WEAR
  {
    id: 9,
    name: "Maroon Classic Bottoms",
    image: "/Images/Maroon.jpg",
    priceBefore: 4299,
    priceAfter: 3199,
    category: "Bottoms wear",
    description: "Deep maroon classical suit set for an elegant look."
  },
  {
    id: 10,
    name: "Black Georgette Pants",
    image: "/Images/Black.jpg",
    priceBefore: 3999,
    priceAfter: 2999,
    category: "Bottoms wear",
    description: "Timeless black georgette suit set."
  },

  // TIE DYE
  {
   
  },
  
   

  // SALE
  {
    id: 13,
    name: "Yellow Anarkali (SALE)",
    image: "/Images/Yellow.jpg",
    priceBefore: 2799,
    priceAfter: 2239,
    category: "sale",
    description: "Bright yellow anarkali suit for festive vibes."
  },
  {
    id: 14,
    name: "Grey Floral (SALE)",
    image: "/Images/Grey.jpg",
    priceBefore: 3999,
    priceAfter: 2999,
    category: "sale",
    description: "Subtle grey floral suit set."
  },

  // DUPATTAS
  {
    id: 15,
    name: "Royal Blue Dupatta",
    image: "/Images/Blue.jpg",
    priceBefore: 4299,
    priceAfter: 3199,
    category: "Dupattas",
    description: "Royal blue traditional suit set."
  },
  {
    id: 16,
    name: "White Red Party Dupatta",
    image: "/Images/White-Red.jpg",
    priceBefore: 2899,
    priceAfter: 2319,
    category: "Dupattas",
    description: "Gorgeous white and red embroidered party wear suit."
  }
];

// Re-export old names for backward compatibility if needed, but pointed to new structure
export const luxeSetProducts = allProducts.filter(p => p.category === "Just Launched");
export const suitSetProducts = allProducts.filter(p => p.category === "Kurta sets");
