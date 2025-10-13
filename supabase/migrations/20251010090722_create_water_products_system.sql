/*
  # Premium Water Products System

  ## Overview
  This migration creates a comprehensive database schema for a premium packaged drinking water brand,
  supporting multiple product lines, blog content, customer inquiries, and marketing features.

  ## 1. New Tables
  
  ### `product_categories`
  Categories for different types of water products (Mineral, Alkaline, Himalayan, etc.)
  - `id` (uuid, primary key)
  - `name` (text) - Category name
  - `slug` (text) - URL-friendly identifier
  - `description` (text) - Category description
  - `icon` (text) - Icon identifier
  - `display_order` (integer) - Sort order
  - `created_at` (timestamp)

  ### `products`
  Individual water products with detailed specifications
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key)
  - `name` (text) - Product name
  - `slug` (text) - URL-friendly identifier
  - `description` (text) - Product description
  - `long_description` (text) - Detailed product information
  - `image_url` (text) - Product image
  - `features` (jsonb) - Array of product features
  - `benefits` (jsonb) - Array of health benefits
  - `specifications` (jsonb) - Technical specs (pH, minerals, etc.)
  - `is_featured` (boolean) - Featured on homepage
  - `display_order` (integer) - Sort order
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `product_sizes`
  Available bottle sizes for each product
  - `id` (uuid, primary key)
  - `product_id` (uuid, foreign key)
  - `size` (text) - Size label (500ml, 1L, 5L, etc.)
  - `price` (numeric) - Product price
  - `stock_status` (text) - in_stock, low_stock, out_of_stock
  - `created_at` (timestamp)

  ### `blog_posts`
  Articles about water health, lifestyle, and company news
  - `id` (uuid, primary key)
  - `title` (text) - Post title
  - `slug` (text) - URL-friendly identifier
  - `excerpt` (text) - Short preview
  - `content` (text) - Full article content
  - `author` (text) - Author name
  - `featured_image` (text) - Article image URL
  - `published` (boolean) - Publication status
  - `published_at` (timestamp)
  - `views` (integer) - View count
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `blog_tags`
  Tags for categorizing blog posts
  - `id` (uuid, primary key)
  - `name` (text) - Tag name
  - `slug` (text) - URL-friendly identifier
  - `created_at` (timestamp)

  ### `blog_post_tags`
  Junction table linking posts to tags
  - `post_id` (uuid, foreign key)
  - `tag_id` (uuid, foreign key)
  - Primary key on both columns

  ### `contact_inquiries`
  General customer inquiries from contact form
  - `id` (uuid, primary key)
  - `name` (text) - Customer name
  - `email` (text) - Customer email
  - `phone` (text) - Phone number (optional)
  - `subject` (text) - Inquiry subject
  - `message` (text) - Inquiry message
  - `status` (text) - new, in_progress, resolved
  - `created_at` (timestamp)

  ### `franchise_inquiries`
  Franchise opportunity inquiries
  - `id` (uuid, primary key)
  - `name` (text) - Applicant name
  - `email` (text) - Applicant email
  - `phone` (text) - Phone number
  - `location` (text) - Desired location
  - `investment_capacity` (text) - Investment range
  - `business_experience` (text) - Previous experience
  - `message` (text) - Additional information
  - `status` (text) - new, contacted, approved, rejected
  - `created_at` (timestamp)

  ### `distribution_inquiries`
  Distribution partnership inquiries
  - `id` (uuid, primary key)
  - `company_name` (text) - Company name
  - `contact_person` (text) - Contact person name
  - `email` (text) - Company email
  - `phone` (text) - Phone number
  - `location` (text) - Operating location
  - `distribution_type` (text) - Wholesale, retail, etc.
  - `message` (text) - Additional information
  - `status` (text) - new, contacted, approved, rejected
  - `created_at` (timestamp)

  ### `newsletter_subscriptions`
  Newsletter subscriber list
  - `id` (uuid, primary key)
  - `email` (text, unique) - Subscriber email
  - `subscribed` (boolean) - Active subscription status
  - `subscribed_at` (timestamp)
  - `unsubscribed_at` (timestamp, nullable)

  ### `clients`
  Corporate clients/partners for showcase
  - `id` (uuid, primary key)
  - `name` (text) - Client name
  - `logo_url` (text) - Logo image URL
  - `website` (text) - Client website
  - `display_order` (integer) - Sort order
  - `is_featured` (boolean) - Show on homepage
  - `created_at` (timestamp)

  ## 2. Security
  - Enable RLS on all tables
  - Public read access for product catalogs, blog posts, and clients
  - Restrict write operations to authenticated users only
  - Open access for inquiry submissions (rate-limited via application)

  ## 3. Notes
  - All text fields use appropriate defaults to prevent null issues
  - Timestamps default to current time
  - Foreign keys enforce referential integrity
  - JSONB used for flexible, structured data storage
  - Indexes added for common query patterns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product categories"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON product_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES product_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  long_description text DEFAULT '',
  image_url text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  benefits jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product Sizes
CREATE TABLE IF NOT EXISTS product_sizes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  price numeric(10, 2) DEFAULT 0,
  stock_status text DEFAULT 'in_stock',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product sizes"
  ON product_sizes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage product sizes"
  ON product_sizes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  author text DEFAULT 'Admin',
  featured_image text DEFAULT '',
  published boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog Tags
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blog tags"
  ON blog_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON blog_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog Post Tags Junction
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post tags"
  ON blog_post_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage post tags"
  ON blog_post_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact Inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact inquiries"
  ON contact_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view and manage inquiries"
  ON contact_inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Franchise Inquiries
CREATE TABLE IF NOT EXISTS franchise_inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  investment_capacity text DEFAULT '',
  business_experience text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE franchise_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit franchise inquiries"
  ON franchise_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view and manage franchise inquiries"
  ON franchise_inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Distribution Inquiries
CREATE TABLE IF NOT EXISTS distribution_inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  distribution_type text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE distribution_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit distribution inquiries"
  ON distribution_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view and manage distribution inquiries"
  ON distribution_inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  subscribed boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their subscription"
  ON newsletter_subscriptions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all subscriptions"
  ON newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (true);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  logo_url text DEFAULT '',
  website text DEFAULT '',
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view featured clients"
  ON clients FOR SELECT
  TO anon, authenticated
  USING (is_featured = true);

CREATE POLICY "Authenticated users can manage clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product ON product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_franchise_inquiries_status ON franchise_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_distribution_inquiries_status ON distribution_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_clients_featured ON clients(is_featured, display_order);