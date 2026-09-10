const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const SAMPLE_PRODUCTS = [
  {
    name: 'Benadryl Cough Syrup 100ml',
    description:
      'Diphenhydramine-based formula for dry and wet cough relief. Suitable for adults and children above 6 years. Each 5 ml contains Diphenhydramine HCl 12.5 mg. Non-drowsy formula. Take as directed by physician.',
    price: 95,
    costPrice: 60,
    category: 'cough-syrups',
    stock: 120,
    sku: 'CS-BEN-100',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Azithromycin 500mg Tablets',
    description:
      'Broad-spectrum antibiotic used for respiratory tract, skin, and ear infections. Pack of 3 tablets. Prescription required. Complete the full course as advised by your doctor.',
    price: 85,
    costPrice: 48,
    category: 'antibiotics',
    stock: 200,
    sku: 'AB-AZI-500',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Amoxicillin 250mg Capsules',
    description:
      'Penicillin-class antibiotic effective against bacterial infections. Pack of 10 capsules. Must be taken under medical supervision. Store in a cool, dry place below 25°C.',
    price: 65,
    costPrice: 38,
    category: 'antibiotics',
    stock: 150,
    sku: 'AB-AMX-250',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Pantoprazole 40mg Tablets',
    description:
      'Proton pump inhibitor for acid reflux, GERD, and peptic ulcers. Strip of 15 tablets. Take 30 minutes before meals. Consult a doctor if symptoms persist beyond 2 weeks.',
    price: 72,
    costPrice: 42,
    category: 'gi-care',
    stock: 180,
    sku: 'GI-PAN-40',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'ORS Oral Rehydration Salts',
    description:
      'WHO-formulated electrolyte powder for rapid rehydration during diarrhea and vomiting. Box of 10 sachets. Mix one sachet in 200 ml of clean water and drink slowly.',
    price: 45,
    costPrice: 22,
    category: 'gi-care',
    stock: 300,
    sku: 'GI-ORS-10',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Vitamin D3 + K2 Tablets',
    description:
      'Combined Vitamin D3 (2000 IU) and K2 (75 mcg) for optimal calcium absorption and bone health. Pack of 60 tablets. Take one tablet daily after a meal. Suitable for adults.',
    price: 349,
    costPrice: 180,
    category: 'vitamins-minerals',
    stock: 90,
    sku: 'VM-D3K2-60',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Calcium + Magnesium + Zinc',
    description:
      'Essential mineral complex supporting bone density, muscle function, and immune health. Pack of 60 tablets. Each tablet: Ca 500 mg, Mg 250 mg, Zn 10 mg. Take one daily with a meal.',
    price: 299,
    costPrice: 155,
    category: 'vitamins-minerals',
    stock: 75,
    sku: 'VM-CMZ-60',
    image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Glucosamine + Chondroitin 500mg',
    description:
      'Joint care supplement combining Glucosamine Sulphate and Chondroitin for cartilage repair and reduced joint pain. Pack of 60 capsules. Best results in 4–8 weeks of regular use.',
    price: 499,
    costPrice: 270,
    category: 'joints-mobility',
    stock: 60,
    sku: 'JM-GC-60',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    name: 'Diclofenac Sodium Gel 30g',
    description:
      'Topical NSAID gel for muscle pain, joint pain, and sports injuries. Apply a thin layer 2–3 times daily to the affected area. For external use only. Keep away from eyes.',
    price: 125,
    costPrice: 70,
    category: 'joints-mobility',
    stock: 100,
    sku: 'JM-DCF-30G',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
];

/**
 * Inserts demo admin, customer, products, and sample orders if missing.
 */
async function seedDatabase() {
  const adminEmail = 'infocherishya@gmail.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'CheriShya@0307',
      role: 'admin',
    });
    console.log('Seed: created admin', adminEmail, '/ CheriShya@0307');
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
  } else {
    // Backfill image URLs for existing products that don't have images
    for (const sample of SAMPLE_PRODUCTS) {
      await Product.updateMany(
        {
          $and: [
            {
              $or: [{ sku: sample.sku }, { name: sample.name }],
            },
            {
              $or: [
                { image: { $exists: false } },
                { image: null },
                { image: '' },
                { image: '/placeholder-product.svg' },
              ],
            },
          ],
        },
        { $set: { image: sample.image } }
      );
    }
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
