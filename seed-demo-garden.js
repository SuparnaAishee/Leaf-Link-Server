/**
 * Seed the advertised demo account + a stocked "My Garden" so the demo
 * credentials on the landing page actually work and have data to show.
 *
 * Demo login (from the client Landing page): demo@leaflink.app / demo1234
 *
 * Run from the server folder:  node seed-demo-garden.js
 * Idempotent: upserts the demo user, then replaces that user's plants.
 */
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const DB_URL =
  process.env.DB_URL || 'mongodb://localhost:27017/leaf-net-platform';
const SALT = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

const DEMO_EMAIL = 'demo@leaflink.app';
const DEMO_PASSWORD = 'demo1234';

const day = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * day);

async function main() {
  await mongoose.connect(DB_URL);
  const db = mongoose.connection.db;
  const users = db.collection('users');

  // ---- 1. Ensure the demo user exists ----
  let demo = await users.findOne({ email: DEMO_EMAIL });
  if (!demo) {
    const hashed = await bcryptjs.hash(DEMO_PASSWORD, SALT);
    const now = new Date();
    const res = await users.insertOne({
      name: 'Demo Gardener',
      role: 'USER',
      email: DEMO_EMAIL,
      password: hashed,
      status: 'ACTIVE',
      mobileNumber: '0180000000',
      profilePhoto:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      bio: 'Just here to test LeafLink 🌱 — balcony grower, tomato enthusiast.',
      isVerified: true,
      premiumStatus: true,
      followers: [],
      following: [],
      posts: [],
      favorites: [],
      createdAt: now,
      updatedAt: now,
    });
    demo = await users.findOne({ _id: res.insertedId });
    console.log(`Created demo user ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    // Reset the password so it always matches the advertised one.
    const hashed = await bcryptjs.hash(DEMO_PASSWORD, SALT);
    await users.updateOne(
      { _id: demo._id },
      { $set: { password: hashed, status: 'ACTIVE' } }
    );
    console.log(`Demo user already existed — reset password to ${DEMO_PASSWORD}`);
  }

  // ---- 2. Stock the demo user's "My Garden" ----
  const img = (id) => `https://images.unsplash.com/${id}?w=600&q=80`;
  const plants = [
    {
      name: 'Sungold Tomato',
      species: 'Solanum lycopersicum',
      photo: img('photo-1592841200221-a6898f307baa'),
      plantedAt: daysAgo(40),
      waterIntervalDays: 2,
      lastWateredAt: daysAgo(3), // overdue → shows in /due
      fertilizeIntervalDays: 14,
      lastFertilizedAt: daysAgo(10),
      notes: 'Cherry tomato in a 10L pot on the south balcony. Staked.',
    },
    {
      name: 'Basil',
      species: 'Ocimum basilicum',
      photo: img('photo-1618375569909-3c8616cf7733'),
      plantedAt: daysAgo(25),
      waterIntervalDays: 1,
      lastWateredAt: daysAgo(2), // overdue
      fertilizeIntervalDays: 21,
      lastFertilizedAt: daysAgo(18),
      notes: 'Pinch the flowers to keep leaves coming.',
    },
    {
      name: 'Snake Plant',
      species: 'Dracaena trifasciata',
      photo: img('photo-1593482892290-f54927ae1bb6'),
      plantedAt: daysAgo(200),
      waterIntervalDays: 14,
      lastWateredAt: daysAgo(4), // not due
      fertilizeIntervalDays: 60,
      lastFertilizedAt: daysAgo(30),
      notes: 'Near impossible to kill. Low light corner of the living room.',
    },
    {
      name: 'Strawberry',
      species: 'Fragaria × ananassa',
      photo: img('photo-1518635017498-87f514b751ba'),
      plantedAt: daysAgo(60),
      waterIntervalDays: 3,
      lastWateredAt: daysAgo(5), // overdue
      fertilizeIntervalDays: 14,
      lastFertilizedAt: daysAgo(7),
      notes: 'Hanging basket. Watch for slugs after rain.',
    },
    {
      name: 'Peace Lily',
      species: 'Spathiphyllum',
      photo: img('photo-1593691509543-c55fb32d8de5'),
      plantedAt: daysAgo(120),
      waterIntervalDays: 5,
      lastWateredAt: daysAgo(1), // not due
      fertilizeIntervalDays: 30,
      lastFertilizedAt: daysAgo(20),
      notes: 'Droops dramatically when thirsty — a handy reminder.',
    },
    {
      name: 'Mint',
      species: 'Mentha spicata',
      photo: img('photo-1628556270448-4d4e4148e1b1'),
      plantedAt: daysAgo(15),
      waterIntervalDays: 2,
      lastWateredAt: daysAgo(3), // overdue
      notes: 'Kept in its own pot so it does not take over.',
    },
  ];

  const removed = await db
    .collection('plants')
    .deleteMany({ user: demo._id });
  const now = new Date();
  const docs = plants.map((p) => ({
    ...p,
    user: demo._id,
    createdAt: now,
    updatedAt: now,
  }));
  const res = await db.collection('plants').insertMany(docs);

  // how many are "due" right now (interval elapsed since last watered)
  const due = docs.filter((p) => {
    const next = p.lastWateredAt.getTime() + p.waterIntervalDays * day;
    return next <= Date.now();
  }).length;

  console.log(
    `Plants: removed ${removed.deletedCount}, inserted ${res.insertedCount} (${due} due for watering).`
  );
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
