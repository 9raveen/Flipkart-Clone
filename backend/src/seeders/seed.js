require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Product } = require('../models');

const DEFAULT_USER_ID = 'default-user-uuid-0000-000000000001';

// All image URLs verified working from cdn.dummyjson.com
const IMG = {
  samsung_s10: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp',
  samsung_s8: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/1.webp',
  iphone13: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp',
  iphoneX: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp',
  oppo: 'https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/1.webp',
  realme: 'https://cdn.dummyjson.com/product-images/smartphones/realme-c35/1.webp',
  airpods: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
  airpods2: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp',
  macbook: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
  laptop2: 'https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp',
  echo: 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp',
  shirt: 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp',
  shoes1: 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp',
  shoes2: 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp',
  shoes3: 'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp',
  bed: 'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp',
  sink: 'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/1.webp',
  mascara: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp',
  eyeshadow: 'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp',
  lipstick: 'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp',
};

const categories = [
  { id: 'cat-electronics-0000-000000000001', name: 'Electronics', slug: 'electronics', image: IMG.echo },
  { id: 'cat-mobiles-000000-000000000002', name: 'Mobiles', slug: 'mobiles', image: IMG.iphone13 },
  { id: 'cat-fashion-000000-000000000003', name: 'Fashion', slug: 'fashion', image: IMG.shoes1 },
  { id: 'cat-appliances-00-000000000004', name: 'Appliances', slug: 'appliances', image: IMG.bed },
  { id: 'cat-furniture-000-000000000005', name: 'Furniture', slug: 'furniture', image: IMG.sink },
  { id: 'cat-books-0000000-000000000006', name: 'Books', slug: 'books', image: IMG.mascara },
  { id: 'cat-sports-000000-000000000007', name: 'Sports', slug: 'sports', image: IMG.shoes3 },
  { id: 'cat-beauty-000000-000000000008', name: 'Beauty', slug: 'beauty', image: IMG.eyeshadow },
];

const products = [
  {
    name: 'Samsung Galaxy S24 Ultra 5G',
    description: 'The ultimate Galaxy experience with AI-powered features, 200MP camera, and titanium design.',
    price: 124999, originalPrice: 134999, discount: 7, stock: 50, brand: 'Samsung',
    rating: 4.5, reviewCount: 2341, isFeatured: true,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: JSON.stringify([IMG.samsung_s10, IMG.samsung_s8]),
    specifications: JSON.stringify({ Display: '6.8" QHD+ Dynamic AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Battery: '5000mAh' }),
  },
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, 48MP main camera with 5x optical zoom.',
    price: 159900, originalPrice: 179900, discount: 11, stock: 30, brand: 'Apple',
    rating: 4.7, reviewCount: 5678, isFeatured: true,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: JSON.stringify([IMG.iphone13, IMG.iphoneX]),
    specifications: JSON.stringify({ Display: '6.7" Super Retina XDR', Processor: 'A17 Pro', RAM: '8GB', Storage: '256GB', Battery: '4422mAh' }),
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC charging.',
    price: 64999, originalPrice: 69999, discount: 7, stock: 80, brand: 'OnePlus',
    rating: 4.4, reviewCount: 1234,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: JSON.stringify([IMG.oppo]),
    specifications: JSON.stringify({ Display: '6.82" LTPO AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Battery: '5400mAh' }),
  },
  {
    name: 'Redmi Note 13 Pro+ 5G',
    description: '200MP camera, 120W HyperCharge, Dimensity 7200 Ultra processor.',
    price: 29999, originalPrice: 34999, discount: 14, stock: 120, brand: 'Redmi',
    rating: 4.3, reviewCount: 3456,
    categoryId: 'cat-mobiles-000000-000000000002',
    images: JSON.stringify([IMG.realme]),
    specifications: JSON.stringify({ Display: '6.67" AMOLED', Processor: 'Dimensity 7200 Ultra', RAM: '8GB', Storage: '256GB', Battery: '5000mAh' }),
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation, 30hr battery, multipoint connection.',
    price: 26990, originalPrice: 34990, discount: 23, stock: 60, brand: 'Sony',
    rating: 4.6, reviewCount: 4567, isFeatured: true,
    categoryId: 'cat-electronics-0000-000000000001',
    images: JSON.stringify([IMG.airpods, IMG.airpods2]),
    specifications: JSON.stringify({ Type: 'Over-ear', Connectivity: 'Bluetooth 5.2', Battery: '30 hours', NoiseCancellation: 'Yes' }),
  },
  {
    name: 'Apple MacBook Air M2',
    description: 'Supercharged by M2 chip, 13.6" Liquid Retina display, 18hr battery.',
    price: 114900, originalPrice: 119900, discount: 4, stock: 25, brand: 'Apple',
    rating: 4.8, reviewCount: 2890, isFeatured: true,
    categoryId: 'cat-electronics-0000-000000000001',
    images: JSON.stringify([IMG.macbook, IMG.laptop2]),
    specifications: JSON.stringify({ Processor: 'Apple M2', RAM: '8GB', Storage: '256GB SSD', Display: '13.6" Liquid Retina', Battery: '18 hours' }),
  },
  {
    name: 'Samsung 55" 4K QLED Smart TV',
    description: 'Quantum Dot technology, 4K UHD, Smart TV with Tizen OS.',
    price: 54990, originalPrice: 79990, discount: 31, stock: 15, brand: 'Samsung',
    rating: 4.4, reviewCount: 1876, isFeatured: true,
    categoryId: 'cat-electronics-0000-000000000001',
    images: JSON.stringify([IMG.echo]),
    specifications: JSON.stringify({ Size: '55 inches', Resolution: '4K UHD', Technology: 'QLED', SmartTV: 'Yes' }),
  },
  {
    name: 'boAt Airdopes 141 TWS Earbuds',
    description: '42H total playback, ENx tech, BEAST mode for gaming.',
    price: 1299, originalPrice: 4990, discount: 74, stock: 200, brand: 'boAt',
    rating: 4.1, reviewCount: 89234,
    categoryId: 'cat-electronics-0000-000000000001',
    images: JSON.stringify([IMG.airpods]),
    specifications: JSON.stringify({ Type: 'TWS', Battery: '42 hours total', Connectivity: 'Bluetooth 5.3', WaterResistance: 'IPX4' }),
  },
  {
    name: "Levi's Men's 511 Slim Fit Jeans",
    description: 'Classic slim fit jeans in stretch denim for all-day comfort.',
    price: 2099, originalPrice: 3999, discount: 48, stock: 150, brand: "Levi's",
    rating: 4.3, reviewCount: 5678,
    categoryId: 'cat-fashion-000000-000000000003',
    images: JSON.stringify([IMG.shirt]),
    specifications: JSON.stringify({ Fit: 'Slim', Material: '99% Cotton, 1% Elastane', Occasion: 'Casual' }),
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    description: 'Max Air unit in the heel for all-day comfort, breathable mesh upper.',
    price: 8995, originalPrice: 12995, discount: 31, stock: 75, brand: 'Nike',
    rating: 4.5, reviewCount: 3421, isFeatured: true,
    categoryId: 'cat-fashion-000000-000000000003',
    images: JSON.stringify([IMG.shoes1, IMG.shoes2]),
    specifications: JSON.stringify({ Type: 'Running', Sole: 'Rubber', Closure: 'Lace-Up', Material: 'Mesh + Synthetic' }),
  },
  {
    name: 'LG 8 Kg 5 Star Inverter Washing Machine',
    description: 'AI Direct Drive, Steam wash, TurboWash 360 technology.',
    price: 42990, originalPrice: 55990, discount: 23, stock: 20, brand: 'LG',
    rating: 4.4, reviewCount: 2341,
    categoryId: 'cat-appliances-00-000000000004',
    images: JSON.stringify([IMG.bed]),
    specifications: JSON.stringify({ Capacity: '8 Kg', Type: 'Front Load', StarRating: '5 Star', SpinSpeed: '1400 RPM' }),
  },
  {
    name: 'Whirlpool 265L 3 Star Frost Free Refrigerator',
    description: 'Intellisense Inverter Technology, 6th Sense ActiveFresh technology.',
    price: 27990, originalPrice: 35990, discount: 22, stock: 18, brand: 'Whirlpool',
    rating: 4.3, reviewCount: 1567,
    categoryId: 'cat-appliances-00-000000000004',
    images: JSON.stringify([IMG.sink]),
    specifications: JSON.stringify({ Capacity: '265 Litres', Type: 'Double Door', StarRating: '3 Star', Compressor: 'Inverter' }),
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones.',
    price: 399, originalPrice: 799, discount: 50, stock: 300, brand: 'Penguin',
    rating: 4.7, reviewCount: 12345,
    categoryId: 'cat-books-0000000-000000000006',
    images: JSON.stringify([IMG.mascara]),
    specifications: JSON.stringify({ Author: 'James Clear', Pages: '320', Language: 'English', Publisher: 'Penguin Random House' }),
  },
  {
    name: 'Yonex Astrox 88D Pro Badminton Racket',
    description: 'Rotational Generator System for powerful smashes, 4U weight.',
    price: 8999, originalPrice: 12000, discount: 25, stock: 40, brand: 'Yonex',
    rating: 4.6, reviewCount: 876,
    categoryId: 'cat-sports-000000-000000000007',
    images: JSON.stringify([IMG.shoes3]),
    specifications: JSON.stringify({ Weight: '4U (80-84g)', Balance: 'Head Heavy', Flex: 'Stiff', Material: 'HM Graphite' }),
  },
  {
    name: 'Lakme Absolute Skin Natural Mousse Foundation',
    description: 'Lightweight mousse formula, SPF 8, 16hr coverage.',
    price: 549, originalPrice: 799, discount: 31, stock: 180, brand: 'Lakme',
    rating: 4.2, reviewCount: 4321,
    categoryId: 'cat-beauty-000000-000000000008',
    images: JSON.stringify([IMG.eyeshadow, IMG.lipstick]),
    specifications: JSON.stringify({ Coverage: 'Medium to Full', Finish: 'Natural', SPF: '8', Volume: '25g' }),
  },
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

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

    await Category.bulkCreate(categories);
    console.log('Categories seeded');

    await Product.bulkCreate(products);
    console.log('Products seeded');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed (non-fatal):', err.message);
    process.exit(0);
  }
}

seed();
