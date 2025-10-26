// Product image utility - provides default images for product categories
// Uses Unsplash for high-quality, free-to-use images

const productImages = {
  // Millet Flour products
  'Flour': [
    'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&h=500&fit=crop', // Flour in bowl
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', // Grain flour
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop', // Millet grains
    'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=500&h=500&fit=crop', // Flour powder
  ],
  
  // Millet Snacks
  'Snacks': [
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&h=500&fit=crop', // Healthy snacks
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&h=500&fit=crop', // Snack mix
    'https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?w=500&h=500&fit=crop', // Indian snacks
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop', // Savory snacks
  ],
  
  // Millet Cookies
  'Cookies': [
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=500&fit=crop', // Cookies stack
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop', // Healthy cookies
    'https://images.unsplash.com/photo-1590080876876-5f2c1a2c725a?w=500&h=500&fit=crop', // Cookies plate
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500&h=500&fit=crop', // Biscuits
  ],
  
  // Ready to Cook products
  'Ready to Cook': [
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop', // Meal mix
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', // Breakfast mix
    'https://images.unsplash.com/photo-1606756790138-261d2eb2fd2f?w=500&h=500&fit=crop', // Indian breakfast
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop', // Ready to cook
  ],
  
  // Default fallback
  'default': [
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop', // Millets
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', // Grains
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop', // Organic products
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&h=500&fit=crop', // Healthy food
  ]
};

// Get image for a product based on its category and name
export const getProductImage = (product) => {
  if (!product) return productImages.default[0];
  
  // If product has an image/photo field, use it
  if (product.image) return product.image;
  if (product.photo) return product.photo;
  if (product.imageUrl) return product.imageUrl;
  
  // Get category-specific images
  const category = product.category || 'default';
  const categoryImages = productImages[category] || productImages.default;
  
  // Use product name or id to consistently assign the same image
  const productIdentifier = product.name || product._id || '';
  const hash = productIdentifier.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = hash % categoryImages.length;
  
  return categoryImages[imageIndex];
};

// Get category image
export const getCategoryImage = (category) => {
  const categoryImages = productImages[category] || productImages.default;
  return categoryImages[0];
};

// Preload images for better performance
export const preloadProductImages = (products) => {
  products.forEach(product => {
    const img = new Image();
    img.src = getProductImage(product);
  });
};

export default productImages;

