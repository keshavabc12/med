const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const SAMPLE_PRODUCTS = [
  {
    name: 'Paracetamol 500mg',
    description: 'Pain relief and fever reduction — 20 tablets.',
    price: 3.5,
    category: 'medicine',
    stock: 200,
    sku: 'MED-PARA-500',
  },
  {
    name: 'Vitamin D3 1000 IU',
    description: 'Daily immune support — 60 softgels.',
    price: 12.99,
    category: 'vitamins',
    stock: 80,
    sku: 'VIT-D3-1000',
  },
  {
    name: 'Digital Thermometer',
    description: 'Fast oral/underarm reading with LCD.',
    price: 18.5,
    category: 'devices',
    stock: 5,
    sku: 'DEV-THERM-01',
  },
  {
    name: 'Hand Sanitizer 500ml',
    description: '70% alcohol gel — kills germs.',
    price: 6.25,
    category: 'personal-care',
    stock: 150,
    sku: 'PC-SAN-500',
  },
  {
    name: 'Blood Pressure Monitor',
    description: 'Upper arm automatic cuff.',
    price: 45.0,
    category: 'healthcare',
    stock: 12,
    sku: 'HC-BPM-UA',
  },
  {
    name: 'Omega-3 Fish Oil',
    description: 'EPA/DHA heart health — 90 capsules.',
    price: 22.0,
    category: 'vitamins',
    stock: 8,
    sku: 'VIT-O3-90',
  },
];

/**
 * Inserts demo admin, customer, products, and sample orders if missing.
 */
async function seedDatabase() {
  const adminEmail = 'admin@pharma.local';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Pharma Admin',
      email: adminEmail,
      password: 'Admin123!',
      role: 'admin',
    });
    console.log('Seed: created admin', adminEmail, '/ Admin123!');
  }

  const demoEmail = 'customer@demo.com';
  let customer = await User.findOne({ email: demoEmail });
  if (!customer) {
    customer = await User.create({
      name: 'Demo Customer',
      email: demoEmail,
      password: 'User123!',
      role: 'user',
      address: '123 Health Street',
    });
    console.log('Seed: created demo customer', demoEmail, '/ User123!');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(SAMPLE_PRODUCTS);
    console.log('Seed: inserted products', SAMPLE_PRODUCTS.length);
  }

  const orderCount = await Order.countDocuments();
  if (orderCount === 0 && customer) {
    const products = await Product.find().limit(3).lean();
    if (products.length >= 2) {
      const now = Date.now();
      const demoOrders = [
        {
          user: customer._id,
          items: [
            {
              product: products[0]._id,
              name: products[0].name,
              quantity: 2,
              price: products[0].price,
              image: products[0].image || '',
            },
          ],
          total: products[0].price * 2,
          status: 'delivered',
          paymentMethod: 'online',
          paymentStatus: 'paid',
          shippingAddress: '123 Health Street',
          createdAt: new Date(now - 2 * 86400000),
        },
        {
          user: customer._id,
          items: [
            {
              product: products[1]._id,
              name: products[1].name,
              quantity: 1,
              price: products[1].price,
              image: products[1].image || '',
            },
          ],
          total: products[1].price,
          status: 'shipped',
          paymentMethod: 'cod',
          paymentStatus: 'unpaid',
          shippingAddress: '123 Health Street',
          createdAt: new Date(now - 86400000),
        },
      ];
      await Order.insertMany(demoOrders);
      console.log('Seed: inserted demo orders');
    }
  }
}

module.exports = { seedDatabase };
