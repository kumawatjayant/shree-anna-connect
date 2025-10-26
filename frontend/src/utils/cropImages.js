// Crop image utility - provides default images for different millet crops
// Uses Unsplash for high-quality, free-to-use images

const cropImages = {
  // Pearl Millet (Bajra)
  'Pearl Millet': [
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop', // Pearl millet
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop', // Millet field
  ],
  'Bajra': [
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
  ],

  // Finger Millet (Ragi)
  'Finger Millet': [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', // Finger millet
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&h=500&fit=crop', // Grains
  ],
  'Ragi': [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&h=500&fit=crop',
  ],

  // Foxtail Millet
  'Foxtail Millet': [
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop', // Foxtail
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
  ],
  'Kangni': [
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
  ],

  // Little Millet
  'Little Millet': [
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
  ],
  'Kutki': [
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
  ],

  // Kodo Millet
  'Kodo Millet': [
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop',
  ],
  'Kodo': [
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop',
  ],

  // Barnyard Millet
  'Barnyard Millet': [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop',
  ],
  'Sanwa': [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop',
  ],

  // Proso Millet
  'Proso Millet': [
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
  ],
  'Cheena': [
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
  ],

  // Sorghum (Jowar)
  'Sorghum': [
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
  ],
  'Jowar': [
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
  ],

  // Default fallback
  'default': [
    'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=500&h=500&fit=crop', // Millets
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', // Grains
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&h=500&fit=crop', // Organic
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop', // Field
  ]
};

// Get image for a crop based on its type and variety
export const getCropImage = (crop) => {
  if (!crop) return cropImages.default[0];
  
  // If crop has an image/photo field, use it
  if (crop.image) return crop.image;
  if (crop.photo) return crop.photo;
  if (crop.imageUrl) return crop.imageUrl;
  
  // Get crop type specific images
  const cropType = crop.cropType || crop.type || 'default';
  const variety = crop.variety || '';
  
  // Try to match by crop type or variety
  const cropKey = Object.keys(cropImages).find(key => 
    cropType.toLowerCase().includes(key.toLowerCase()) || 
    variety.toLowerCase().includes(key.toLowerCase())
  );
  
  const availableImages = cropKey ? cropImages[cropKey] : cropImages.default;
  
  // Use crop name or id to consistently assign the same image
  const cropIdentifier = `${cropType}-${variety}` || crop._id || '';
  const hash = cropIdentifier.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = hash % availableImages.length;
  
  return availableImages[imageIndex];
};

// Get crop type image
export const getCropTypeImage = (cropType) => {
  const cropKey = Object.keys(cropImages).find(key => 
    cropType.toLowerCase().includes(key.toLowerCase())
  );
  const images = cropKey ? cropImages[cropKey] : cropImages.default;
  return images[0];
};

// Preload images for better performance
export const preloadCropImages = (crops) => {
  crops.forEach(crop => {
    const img = new Image();
    img.src = getCropImage(crop);
  });
};

export default cropImages;

