import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, Shield, Leaf, Award, Droplet, Package, Truck, Phone } from 'lucide-react';
import { type Product } from '../lib/supabase';

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('500ml');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Mock products data (same as in App.tsx)
      const mockProducts: Product[] = [
        {
          id: '1',
          category_id: 'cat-1',
          name: 'Premium Mineral Water',
          slug: 'premium-mineral-water',
          description: 'Our flagship premium mineral water, sourced from pristine Himalayan springs. Rich in essential minerals and perfectly balanced pH for optimal hydration.',
          long_description: 'Experience the purest form of hydration with our Premium Mineral Water.',
          image_url: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=1200',
          features: ['Natural mineral content with 84+ trace minerals', 'pH balanced at 7.8', 'BPA-free recyclable packaging', 'Sourced from protected Himalayan springs', 'Laboratory tested for purity', 'Zero artificial additives'],
          benefits: ['Optimal hydration', 'Essential minerals', 'Pure taste'],
          specifications: { pH: '7.8', minerals: '84+' },
          is_featured: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          category_id: 'cat-2',
          name: 'Alkaline Water Plus',
          slug: 'alkaline-water-plus',
          description: 'Enhanced alkaline water with pH 9.5+ for superior hydration. Helps neutralize acidity and supports overall wellness with added electrolytes.',
          long_description: 'Elevate your hydration with our premium alkaline water.',
          image_url: 'https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=1200',
          features: ['High pH level of 9.5+', 'Enhanced with natural electrolytes', 'Supports body pH balance', 'Antioxidant-rich formula', 'Improves hydration efficiency', 'Eco-friendly glass bottle option'],
          benefits: ['Alkaline benefits', 'Better hydration', 'Antioxidants'],
          specifications: { pH: '9.5+', type: 'Alkaline' },
          is_featured: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          category_id: 'cat-3',
          name: 'Vitamin B12 Enhanced Water',
          slug: 'vitamin-b12-water',
          description: 'Fortified water infused with Vitamin B12 for energy and vitality. Perfect for those seeking an extra boost throughout their day.',
          long_description: 'Get your daily dose of energy with Vitamin B12 enhanced water.',
          image_url: 'https://images.pexels.com/photos/1187766/pexels-photo-1187766.jpeg?auto=compress&cs=tinysrgb&w=1200',
          features: ['Fortified with 100% daily value of Vitamin B12', 'Supports energy metabolism', 'Enhances mental clarity', 'Zero sugar, zero calories', 'Natural fruit essence', 'Vegan-friendly formulation'],
          benefits: ['Energy boost', 'Mental clarity', 'Zero calories'],
          specifications: { vitamin_b12: '100%', calories: '0' },
          is_featured: true,
          display_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Find the product by ID
      const foundProduct = mockProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    } catch (error) {
      console.error('Error finding product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full hover:shadow-xl transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const sizes = ['250ml', '500ml', '1L', '2L', '5L'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <Droplet className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-500 bg-clip-text text-transparent">BrandBleu</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Product Detail Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Product Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 to-cyan-400/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-[600px] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full mb-4">
                  <Star className="h-4 w-4 text-blue-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all font-semibold text-lg hover:scale-105 flex items-center justify-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Now</span>
                </button>
                <button className="bg-white text-blue-700 px-8 py-4 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all font-semibold text-lg flex items-center justify-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Us</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose This Product</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Certified Purity</h3>
              <p className="text-gray-600">Laboratory tested and certified</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">100% recyclable packaging</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Award Winning</h3>
              <p className="text-gray-600">Recognized for excellence</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-900 via-cyan-900 to-sky-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Droplet className="h-8 w-8 text-cyan-300" />
            <span className="text-2xl font-bold">BrandBleu</span>
          </div>
          <p className="text-blue-100 mb-4">Premium natural water for a healthier lifestyle</p>
          <button
            onClick={() => navigate('/')}
            className="text-cyan-300 hover:text-white transition-colors font-semibold"
          >
            Back to Home
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ProductDetail;
