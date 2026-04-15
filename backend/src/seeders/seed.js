require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Product } = require('../models');

const DEFAULT_USER_ID = 'default-user-uuid-0000-000000000001';

const categories = [
  { id: 'cat-electronics-0000-000000000001', name: 'Electronics', slug: 'electronics', image: 'https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png' },
  { id: 'cat-mobiles-000000-000000000002', name: 'Mobiles', slug: 'mobiles', image: 'https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png' },
  { id: 'cat-fashion-000000-000000000003', name: 'Fashion', slug: 'fashion', image: 'https://rukminim2.flixcart.com/flap/80/80/image/c12afc017e6f24cb.png' },
  { id: 'cat-appliances-00-000000000004', name: 'Appliances', slug: 'appliances', image: 'https://rukminim2.flixcart.com/flap/80/80/image/0ff199d1bd27eb98.png' },
  { id: 'cat-furniture-000-000000000005', name: 'Furniture', slug: 'furniture', image: 'https://rukminim2.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg' },
  { id: 'cat-books-0000000-000000000006', name: 'Books', slug: 'books', image: 'https://rukminim2.flixcart.com/flap/80/80/image/71050627a56b4693.png' },
  { id: 'cat-sports-000000-000000000007', name: 'Sports', slug: 'sports', image: 'https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png' },
  { id: 'cat-beauty-000000-000000000008', name: 'Beauty', slug: 'beauty', image: 'https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png' },
];

const products = [
  // Mobiles
  {
    name: 'Samsung Galaxy S24 Ultra 5G',
    description: 'The ultimate Galaxy experience with AI-powered features, 200MP camera, and titanium design.',
    price: 124999, originalPrice: 134999, discount: 7, stock: 50, brand: 'Samsung',
    rating: 4.5, reviewCount: 2341, isFeatured: true,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    ],
    specifications: { Display: '6.8" QHD+ Dynamic AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Battery: '5000mAh', Camera: '200MP + 12MP + 10MP + 10MP' },
  },
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, 48MP main camera with 5x optical zoom.',
    price: 159900, originalPrice: 179900, discount: 11, stock: 30, brand: 'Apple',
    rating: 4.7, reviewCount: 5678, isFeatured: true,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    ],
    specifications: { Display: '6.7" Super Retina XDR', Processor: 'A17 Pro', RAM: '8GB', Storage: '256GB', Battery: '4422mAh', Camera: '48MP + 12MP + 12MP' },
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC charging.',
    price: 64999, originalPrice: 69999, discount: 7, stock: 80, brand: 'OnePlus',
    rating: 4.4, reviewCount: 1234,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'],
    specifications: { Display: '6.82" LTPO AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Battery: '5400mAh' },
  },
  {
    name: 'Redmi Note 13 Pro+ 5G',
    description: '200MP camera, 120W HyperCharge, Dimensity 7200 Ultra processor.',
    price: 29999, originalPrice: 34999, discount: 14, stock: 120, brand: 'Redmi',
    rating: 4.3, reviewCount: 3456,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: ['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'],
    specifications: { Display: '6.67" AMOLED', Processor: 'Dimensity 7200 Ultra', RAM: '8GB', Storage: '256GB', Battery: '5000mAh' },
  },
  // Electronics
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation, 30hr battery, multipoint connection.',
    price: 26990, originalPrice: 34990, discount: 23, stock: 60, brand: 'Sony',
    rating: 4.6, reviewCount: 4567, isFeatured: true,
    categoryId: 'cat-electronics-0000-000000000001',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    ],
    specifications: { Type: 'Over-ear', Connectivity: 'Bluetooth 5.2', Battery: '30 hours', NoiseCancellation: 'Yes', Weight: '250g' },
  },
  {
    name: 'Apple MacBook Air M2',
    description: 'Supercharged by M2 chip, 13.6" Liquid Retina display, 18hr battery.',
    price: 114900, originalPrice: 119900, discount: 4, stock: 25, brand: 'Apple',
    rating: 4.8, reviewCount: 2890, isFeatured: true,
    categoryId: 'cat-electronics-0000-000000000001',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611186871525-9c4f9b855c3e?w=400&h=400&fit=crop',
    ],
    specifications: { Processor: 'Apple M2', RAM: '8GB', Storage: '256GB SSD', Display: '13.6" Liquid Retina', Battery: '18 hours' },
  },
  {
    name: 'Samsung 55" 4K QLED Smart TV',
    description: 'Quantum Dot technology, 4K UHD, Smart TV with Tizen OS.',
    price: 54990, originalPrice: 79990, discount: 31, stock: 15, brand: 'Samsung',
    rating: 4.4, reviewCount: 1876, isFeatured: true,
    categoryId: 'cat-electronics-0000-000000000001',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop'],
    specifications: { Size: '55 inches', Resolution: '4K UHD', Technology: 'QLED', SmartTV: 'Yes', HDR: 'HDR10+' },
  },
  {
    name: 'boAt Airdopes 141 TWS Earbuds',
    description: '42H total playback, ENx tech, BEAST mode for gaming.',
    price: 1299, originalPrice: 4990, discount: 74, stock: 200, brand: 'boAt',
    rating: 4.1, reviewCount: 89234,
    categoryId: 'cat-electronics-0000-000000000001',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop'],
    specifications: { Type: 'TWS', Battery: '42 hours total', Connectivity: 'Bluetooth 5.3', WaterResistance: 'IPX4' },
  },
  // Fashion
  {
    name: "Levi's Men's 511 Slim Fit Jeans",
    description: 'Classic slim fit jeans in stretch denim for all-day comfort.',
    price: 2099, originalPrice: 3999, discount: 48, stock: 150, brand: "Levi's",
    rating: 4.3, reviewCount: 5678,
    categoryId: 'cat-fashion-000000-000000000003',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'],
    specifications: { Fit: 'Slim', Material: '99% Cotton, 1% Elastane', Occasion: 'Casual', Care: 'Machine Wash' },
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    description: 'Max Air unit in the heel for all-day comfort, breathable mesh upper.',
    price: 8995, originalPrice: 12995, discount: 31, stock: 75, brand: 'Nike',
    rating: 4.5, reviewCount: 3421, isFeatured: true,
    categoryId: 'cat-fashion-000000-000000000003',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
    specifications: { Type: 'Running', Sole: 'Rubber', Closure: 'Lace-Up', Material: 'Mesh + Synthetic' },
  },
  // Appliances
  {
    name: 'LG 8 Kg 5 Star Inverter Washing Machine',
    description: 'AI Direct Drive, Steam wash, TurboWash 360 technology.',
    price: 42990, originalPrice: 55990, discount: 23, stock: 20, brand: 'LG',
    rating: 4.4, reviewCount: 2341,
    categoryId: 'cat-appliances-00-000000000004',
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop'],
    specifications: { Capacity: '8 Kg', Type: 'Front Load', StarRating: '5 Star', SpinSpeed: '1400 RPM' },
  },
  {
    name: 'Whirlpool 265L 3 Star Frost Free Refrigerator',
    description: 'Intellisense Inverter Technology, 6th Sense ActiveFresh technology.',
    price: 27990, originalPrice: 35990, discount: 22, stock: 18, brand: 'Whirlpool',
    rating: 4.3, reviewCount: 1567,
    categoryId: 'cat-appliances-00-000000000004',
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop'],
    specifications: { Capacity: '265 Litres', Type: 'Double Door', StarRating: '3 Star', Compressor: 'Inverter' },
  },
  // Books
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones.',
    price: 399, originalPrice: 799, discount: 50, stock: 300, brand: 'Penguin',
    rating: 4.7, reviewCount: 12345,
    categoryId: 'cat-books-0000000-000000000006',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop'],
    specifications: { Author: 'James Clear', Pages: '320', Language: 'English', Publisher: 'Penguin Random House' },
  },
  // Sports
  {
    name: 'Yonex Astrox 88D Pro Badminton Racket',
    description: 'Rotational Generator System for powerful smashes, 4U weight.',
    price: 8999, originalPrice: 12000, discount: 25, stock: 40, brand: 'Yonex',
    rating: 4.6, reviewCount: 876,
    categoryId: 'cat-sports-000000-000000000007',
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop'],
    specifications: { Weight: '4U (80-84g)', Balance: 'Head Heavy', Flex: 'Stiff', Material: 'HM Graphite' },
  },
  // Beauty
  {
    name: 'Lakme Absolute Skin Natural Mousse Foundation',
    description: 'Lightweight mousse formula, SPF 8, 16hr coverage.',
    price: 549, originalPrice: 799, discount: 31, stock: 180, brand: 'Lakme',
    rating: 4.2, reviewCount: 4321,
    categoryId: 'cat-beauty-000000-000000000008',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'],
    specifications: { Coverage: 'Medium to Full', Finish: 'Natural', SPF: '8', Volume: '25g' },
  },
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create default user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      id: DEFAULT_USER_ID,
      name: 'Default User',
      email: 'user@flipkart.com',
      password: hashedPassword,
      phone: '9876543210',
      isDefault: true,
    });
    console.log('Default user created');

    // Create categories
    await Category.bulkCreate(categories);
    console.log('Categories seeded');

    // Create products
    await Product.bulkCreate(products);
    console.log('Products seeded');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
