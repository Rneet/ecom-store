-- Add a demo product to test the product detail page
-- Run this in your Supabase SQL Editor

INSERT INTO products (
  name,
  description,
  image_url,
  features,
  is_featured,
  display_order,
  category_id
) VALUES (
  'Premium Mineral Water',
  'Our flagship premium mineral water, sourced from pristine Himalayan springs. Rich in essential minerals and perfectly balanced pH for optimal hydration and wellness.',
  'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY[
    'Natural mineral content with 84+ trace minerals',
    'pH balanced at 7.8 for optimal hydration',
    'BPA-free recyclable packaging',
    'Sourced from protected Himalayan springs',
    'Laboratory tested for purity and safety',
    'Zero artificial additives or chemicals',
    'Crisp, refreshing taste',
    'Available in multiple sizes'
  ],
  true,
  1,
  (SELECT id FROM product_categories LIMIT 1)
);

-- Add another demo product - Alkaline Water
INSERT INTO products (
  name,
  description,
  image_url,
  features,
  is_featured,
  display_order,
  category_id
) VALUES (
  'Alkaline Water Plus',
  'Enhanced alkaline water with pH 9.5+ for superior hydration. Helps neutralize acidity and supports overall wellness with added electrolytes.',
  'https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY[
    'High pH level of 9.5+ for alkaline benefits',
    'Enhanced with natural electrolytes',
    'Supports body pH balance',
    'Antioxidant-rich formula',
    'Improves hydration efficiency',
    'Eco-friendly glass bottle option',
    'Premium filtration process',
    'Perfect for active lifestyles'
  ],
  true,
  2,
  (SELECT id FROM product_categories LIMIT 1)
);

-- Add third demo product - Vitamin B12 Water
INSERT INTO products (
  name,
  description,
  image_url,
  features,
  is_featured,
  display_order,
  category_id
) VALUES (
  'Vitamin B12 Enhanced Water',
  'Fortified water infused with Vitamin B12 for energy and vitality. Perfect for those seeking an extra boost throughout their day.',
  'https://images.pexels.com/photos/1187766/pexels-photo-1187766.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARRAY[
    'Fortified with 100% daily value of Vitamin B12',
    'Supports energy metabolism',
    'Enhances mental clarity and focus',
    'Zero sugar, zero calories',
    'Natural fruit essence for taste',
    'Vegan-friendly formulation',
    'Ideal for busy professionals',
    'Convenient on-the-go packaging'
  ],
  true,
  3,
  (SELECT id FROM product_categories LIMIT 1)
);
