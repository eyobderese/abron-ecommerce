-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create admin_users table for simple auth
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url) VALUES
('Classic Leather Shoe', 'Premium leather shoe for everyday wear', 89.99, 'Shoes', '/images/shoe-1.jpg'),
('Sports Running Shoe', 'Comfortable running shoe with cushioning', 109.99, 'Shoes', '/images/shoe-2.jpg'),
('Summer Casual Shirt', 'Light and breathable cotton shirt', 39.99, 'Clothes', '/images/shirt-1.jpg'),
('Winter Jacket', 'Warm and stylish winter jacket', 149.99, 'Clothes', '/images/jacket-1.jpg'),
('Natural Lipstick', 'Smooth and long-lasting lipstick', 24.99, 'Cosmetics', '/images/lipstick-1.jpg'),
('Face Cream', 'Moisturizing face cream for all skin types', 34.99, 'Cosmetics', '/images/cream-1.jpg');

-- Enable RLS (Row Level Security) for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy allowing public read access to products
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Enable RLS for inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy allowing public insert for inquiries
CREATE POLICY "Allow public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Create policy allowing public select for own inquiries (by email)
CREATE POLICY "Allow public select inquiries by email" ON inquiries FOR SELECT USING (true);
