import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Droplet, Award, Shield, Leaf, Star, Users, CheckCircle, Sparkles, Heart, TrendingUp, Building2, Handshake, FileText, Send, Zap, Globe, Package, BadgeCheck } from 'lucide-react';
import { supabase, type Product, type Client, type ProductCategory } from './lib/supabase';

function App() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [franchiseForm, setFranchiseForm] = useState({ name: '', email: '', phone: '', location: '', investment_capacity: '', business_experience: '', message: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showFranchise, setShowFranchise] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Trigger counter animation when stats section is visible
      if (statsRef.current && !countersStarted) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setCountersStarted(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [countersStarted]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, blogsRes, clientsRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_featured', true).order('display_order'),
        supabase.from('product_categories').select('*').order('display_order'),
        supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(4),
        supabase.from('clients').select('*').eq('is_featured', true).order('display_order')
      ]);

      // Use mock data if database returns empty
      if (productsRes.data && productsRes.data.length > 0) {
        setProducts(productsRes.data);
      } else {
        // Mock products for demo
        setProducts([
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
        ]);
      }

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setCategories(categoriesRes.data);
      } else {
        // Mock categories
        setCategories([
          { id: 'cat-1', name: 'Mineral Water', slug: 'mineral-water', description: 'Pure mineral water', icon: 'droplet', display_order: 1, created_at: new Date().toISOString() },
          { id: 'cat-2', name: 'Alkaline Water', slug: 'alkaline-water', description: 'High pH water', icon: 'zap', display_order: 2, created_at: new Date().toISOString() },
          { id: 'cat-3', name: 'Vitamin Water', slug: 'vitamin-water', description: 'Fortified water', icon: 'star', display_order: 3, created_at: new Date().toISOString() }
        ]);
      }

      if (blogsRes.data && blogsRes.data.length > 0) {
        // Blog posts would be set here if available
      } else {
        // Blog posts are coming soon - no mock data needed
      }

      if (clientsRes.data && clientsRes.data.length > 0) {
        setClients(clientsRes.data);
      } else {
        // No mock clients
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('contact_inquiries').insert([contactForm]);
      if (!error) {
        alert('Thank you for your message. We will get back to you soon!');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const handleFranchiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('franchise_inquiries').insert([franchiseForm]);
      if (!error) {
        alert('Thank you for your franchise inquiry. Our team will contact you soon!');
        setFranchiseForm({ name: '', email: '', phone: '', location: '', investment_capacity: '', business_experience: '', message: '' });
        setShowFranchise(false);
      }
    } catch (error) {
      console.error('Error submitting franchise form:', error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('newsletter_subscriptions').insert([{ email: newsletterEmail }]);
      if (!error) {
        alert('Successfully subscribed to our newsletter!');
        setNewsletterEmail('');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  const filteredProducts = selectedProductCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedProductCategory);

  console.log('Products:', products);
  console.log('Filtered Products:', filteredProducts);
  console.log('Loading:', loading);

  const benefits = [
    {
      icon: Shield,
      title: 'Lorem Ipsum',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
    },
    {
      icon: Leaf,
      title: 'Consectetur',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
    },
    {
      icon: Heart,
      title: 'Adipiscing Elit',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam'
    },
    {
      icon: Award,
      title: 'Dolor Sit Amet',
      description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure'
    }
  ];

  // WhatsApp chat link
  const whatsappNumber = (import.meta as any).env?.VITE_WHATSAPP_NUMBER as string | undefined;
  const fallbackWhatsappNumber = '918283857170'; // +91 82838 57170
  const cleanedNumber = (whatsappNumber && whatsappNumber.trim().length > 0)
    ? whatsappNumber.replace(/[^\d]/g, '')
    : fallbackWhatsappNumber;
  const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent('Hello! I would like to know more.')}`;

  const faqs = [
    {
      question: 'Lorem ipsum dolor sit amet consectetur adipiscing elit?',
      answer: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      question: 'Duis aute irure dolor in reprehenderit in voluptate velit?',
      answer: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      question: 'What is the shelf life of your water?',
      answer: 'When stored properly in a cool, dry place away from direct sunlight, our water has a shelf life of 24 months from the production date printed on the bottle.'
    },
    {
      question: 'Do you offer franchise opportunities?',
      answer: 'Yes, we offer franchise and distribution partnership opportunities in select markets. Please fill out our franchise inquiry form to learn more about joining our growing network.'
    }
  ];

  const stats = [
    { value: '25+', label: 'Years of Excellence', target: 25 },
    { value: '1B+', label: 'Bottles Delivered', target: 1000000000 },
    { value: '75+', label: 'Countries Served', target: 75 },
    { value: '99%', label: 'Customer Satisfaction', target: 99 }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Same-day delivery available in major cities'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving customers globally'
    },
    {
      icon: Package,
      title: 'Premium Packaging',
      description: 'Eco-friendly and elegant bottle design'
    },
    {
      icon: BadgeCheck,
      title: 'Quality Certified',
      description: 'ISO certified and laboratory tested'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'}`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Droplet className="h-9 w-9 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-blue-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-500 bg-clip-text text-transparent">BrandBleu</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <div className="relative group">
                <a href="#products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                  <span>Products</span>
                  <ChevronDown className="h-4 w-4" />
                </a>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                  <a href="#products" onClick={() => setSelectedProductCategory('all')} className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 border-b border-gray-100">
                    <Droplet className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">All Products</span>
                  </a>
                  {categories.map((category) => (
                    <a 
                      key={category.id}
                      href="#products" 
                      onClick={() => setSelectedProductCategory(category.id)} 
                      className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span>{category.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                  <span>Opportunities</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                  <button onClick={() => setShowFranchise(true)} className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span>Franchise</span>
                  </button>
                  <button onClick={() => setShowDistribution(true)} className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3">
                    <Handshake className="h-5 w-5 text-blue-600" />
                    <span>Distribution</span>
                  </button>
                </div>
              </div>
              <a href="#contact" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium">Contact</a>
            </div>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in">
              <a href="#home" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">Home</a>
              <div>
                <a href="#products" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">Products</a>
                <div className="pl-4 mt-2 space-y-2">
                  <a href="#products" onClick={() => { setSelectedProductCategory('all'); setMobileMenuOpen(false); }} className="block text-sm text-gray-600 hover:text-blue-600 py-1.5">All Products</a>
                  {categories.map((category) => (
                    <a 
                      key={category.id}
                      href="#products" 
                      onClick={() => { setSelectedProductCategory(category.id); setMobileMenuOpen(false); }} 
                      className="block text-sm text-gray-600 hover:text-blue-600 py-1.5"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
              <a href="#about" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">About</a>
              <a href="#blog" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">Blog</a>
              <a href="#faq" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">FAQ</a>
              <button onClick={() => setShowFranchise(true)} className="block text-gray-700 hover:text-blue-600 py-2 font-medium w-full text-left">Franchise</button>
              <button onClick={() => setShowDistribution(true)} className="block text-gray-700 hover:text-blue-600 py-2 font-medium w-full text-left">Distribution</button>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">Contact</a>
            </div>
          )}
        </nav>
      </header>

      <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold text-blue-900 leading-tight">
                Lorem Ipsum
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-600 bg-clip-text text-transparent animate-gradient">Dolor Sit Amet</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#products" className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all hover:scale-105 shadow-lg font-semibold flex items-center space-x-2">
                  <span>Explore Products</span>
                  <TrendingUp className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button onClick={() => setShowFranchise(true)} className="bg-white/90 backdrop-blur-sm text-blue-700 px-8 py-4 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all font-semibold shadow-lg hover:shadow-xl">
                  Franchise Opportunity
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">100%</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">Natural</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">84+</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">Minerals</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">pH 7.8</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">Balanced</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 to-cyan-400/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="BrandBleu Water Bottle"
                  className="relative w-full h-auto hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 mb-10 font-medium tracking-wide uppercase text-sm">Trusted by Industry Leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-center group">
                <span className="text-gray-400 font-bold text-lg hover:text-blue-600 transition-colors cursor-pointer group-hover:scale-110 transition-transform duration-300">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose BrandBleu</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Premium Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-white border-2 border-gray-100 p-8 rounded-2xl hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Premium Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setSelectedProductCategory('all')}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  selectedProductCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedProductCategory(category.id)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                    selectedProductCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">No products found. Products array length: {products.length}</p>
              <p className="text-gray-500 mt-4">Loading state: {loading.toString()}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-pointer perspective-1000"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative overflow-hidden h-72">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Premium
                    </div>
                  </div>
                  <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50 group-hover:from-blue-50 group-hover:to-cyan-50 transition-colors duration-500">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center space-x-1 group-hover:scale-105 transition-transform">
                          <CheckCircle className="h-3 w-3" />
                          <span>{feature}</span>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-full hover:shadow-xl transition-all mt-4 font-semibold group-hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                      <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-24 bg-gradient-to-br from-blue-900 via-cyan-900 to-sky-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-3xl blur-2xl"></div>
                <img
                  src="https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Natural Spring"
                  className="relative rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Heart className="h-4 w-4 text-cyan-300" />
                <span className="text-sm font-semibold text-cyan-100">Our Story</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">From Himalayan Peaks, <span className="text-cyan-300">To Your Glass</span></h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-lg text-blue-100 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <div ref={statsRef} className="grid grid-cols-2 gap-6 pt-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all hover:scale-105 cursor-pointer group">
                    <div className="text-4xl font-bold text-cyan-300 mb-2 group-hover:scale-110 transition-transform inline-block">{stat.value}</div>
                    <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="blog" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="faq" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors bg-white">
                <button
                  className="w-full px-6 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-lg text-left text-gray-900">{faq.question}</span>
                  <ChevronDown className={`h-6 w-6 text-blue-600 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 py-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-xl text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl">
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-gray-300"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-gray-300"
                      placeholder=""
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-gray-300"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={6}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none hover:border-gray-300"
                    placeholder=""
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl hover:shadow-2xl transition-all font-semibold text-lg hover:scale-[1.02] flex items-center justify-center space-x-2 group">
                  <span>Send Message</span>
                  <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors bg-white">
                <button
                  className="w-full px-6 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-lg text-left text-gray-900">{faq.question}</span>
                  <ChevronDown className={`h-6 w-6 text-blue-600 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 py-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-xl text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl">
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-gray-300"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-gray-300"
                      placeholder=""
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-gray-300"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={6}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none hover:border-gray-300"
                    placeholder=""
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl hover:shadow-2xl transition-all font-semibold text-lg hover:scale-[1.02] flex items-center justify-center space-x-2 group">
                  <span>Send Message</span>
                  <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-blue-900 via-cyan-900 to-sky-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Droplet className="h-10 w-10 text-cyan-300" />
                <span className="text-3xl font-bold">BrandBleu</span>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Premium natural water for a healthier lifestyle. Experience purity in every drop.
              </p>
              <div className="flex space-x-3 pt-4">
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110">
                  <Users className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110">
                  <Star className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-cyan-300">Quick Links</h4>
              <ul className="space-y-3 text-blue-100">
                <li><a href="#home" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Home</a></li>
                <li><a href="#products" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Products</a></li>
                <li><a href="#about" className="hover:text-white transition-colors hover:translate-x-1 inline-block">About</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors hover:translate-x-1 inline-block">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-cyan-300">Opportunities</h4>
              <ul className="space-y-3 text-blue-100">
                <li><button onClick={() => setShowFranchise(true)} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Franchise</button></li>
                <li><button onClick={() => setShowDistribution(true)} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Distribution</button></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Sustainability</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-cyan-300">Newsletter</h4>
              <p className="text-blue-100 mb-4 leading-relaxed">Stay updated with our latest products and exclusive offers.</p>
              <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm"
                />
                <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-xl hover:shadow-xl transition-all font-semibold hover:scale-105">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between text-blue-200 text-sm">
            <p>&copy; 2025 BrandBleu. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Crafted with care for your wellness</p>
          </div>
        </div>
      </footer>

      {showFranchise && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFranchise(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-gray-900">Franchise Opportunity</h3>
              <button onClick={() => setShowFranchise(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Join our growing network and bring BrandBleu to your community.</p>
            <form className="space-y-4" onSubmit={handleFranchiseSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name*</label>
                  <input
                    type="text"
                    required
                    value={franchiseForm.name}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    required
                    value={franchiseForm.email}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone*</label>
                  <input
                    type="tel"
                    required
                    value={franchiseForm.phone}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location*</label>
                  <input
                    type="text"
                    required
                    value={franchiseForm.location}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Capacity</label>
                <input
                  type="text"
                  value={franchiseForm.investment_capacity}
                  onChange={(e) => setFranchiseForm({ ...franchiseForm, investment_capacity: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Experience</label>
                <textarea
                  rows={3}
                  value={franchiseForm.business_experience}
                  onChange={(e) => setFranchiseForm({ ...franchiseForm, business_experience: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about your business background..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Message</label>
                <textarea
                  rows={3}
                  value={franchiseForm.message}
                  onChange={(e) => setFranchiseForm({ ...franchiseForm, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                  placeholder="Any additional information..."
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl hover:shadow-2xl transition-all font-semibold flex items-center justify-center space-x-2">
                <span>Submit Application</span>
                <FileText className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Chat with us on WhatsApp"
      >
        <div className="flex items-center space-x-3">
          <div className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all bg-white shadow-lg px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hidden sm:block">
            Chat with us
          </div>
          <div className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" className="w-7 h-7 fill-white">
              <path d="M19.11 17.36c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.2-1.34-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.99 2.65 1.13 2.83.14.18 1.94 2.96 4.7 4.15.66.29 1.18.46 1.58.59.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.18-.52-.32z"/>
              <path d="M26.62 5.38C24.23 2.98 21.22 1.7 18 1.7 9.94 1.7 3.4 8.24 3.4 16.3c0 2.58.67 5.1 1.95 7.33L3 31l7.54-2.31c2.16 1.18 4.61 1.81 7.11 1.81 8.06 0 14.6-6.54 14.6-14.6 0-3.22-1.28-6.23-3.68-8.62zM18.65 27.5c-2.23 0-4.41-.6-6.31-1.74l-.45-.27-4.47 1.37 1.37-4.35-.29-.45c-1.2-1.94-1.83-4.18-1.83-6.45 0-6.8 5.54-12.34 12.34-12.34 3.3 0 6.41 1.28 8.76 3.62 2.34 2.34 3.62 5.46 3.62 8.76 0 6.8-5.54 12.34-12.34 12.34z"/>
            </svg>
          </div>
        </div>
      </a>

      {showDistribution && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDistribution(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-gray-900">Distribution Partnership</h3>
              <button onClick={() => setShowDistribution(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Become a distribution partner and help us expand our reach.</p>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = {
                company_name: (e.target as any).company_name.value,
                contact_person: (e.target as any).contact_person.value,
                email: (e.target as any).email.value,
                phone: (e.target as any).phone.value,
                location: (e.target as any).location.value,
                distribution_type: (e.target as any).distribution_type.value,
                message: (e.target as any).message.value,
              };
              try {
                const { error } = await supabase.from('distribution_inquiries').insert([formData]);
                if (!error) {
                  alert('Thank you for your distribution inquiry. We will contact you soon!');
                  setShowDistribution(false);
                }
              } catch (error) {
                console.error('Error submitting distribution form:', error);
              }
            }}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name*</label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person*</label>
                  <input
                    type="text"
                    name="contact_person"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location*</label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Distribution Type*</label>
                  <select
                    name="distribution_type"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="retail">Retail</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Message</label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about your distribution network..."
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl hover:shadow-2xl transition-all font-semibold flex items-center justify-center space-x-2">
                <span>Submit Inquiry</span>
                <Handshake className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
