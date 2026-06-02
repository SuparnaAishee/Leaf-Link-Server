/**
 * Seed sample garden events for local testing.
 * Run from the server folder:  node seed-events.js
 *
 * Idempotent-ish: it deletes any existing event whose title matches a seed
 * title, then re-inserts, so you can run it repeatedly without duplicates.
 */
const mongoose = require('mongoose');

const DB_URL =
  process.env.DB_URL || 'mongodb://localhost:27017/leaf-net-platform';

const day = 24 * 60 * 60 * 1000;
// Build a date `n` days from now, set to a given hour (local time).
const at = (daysFromNow, hour, minute = 0) => {
  const d = new Date(Date.now() + daysFromNow * day);
  d.setHours(hour, minute, 0, 0);
  return d;
};

async function main() {
  await mongoose.connect(DB_URL);
  const db = mongoose.connection.db;
  const users = await db
    .collection('users')
    .find({}, { projection: { _id: 1, name: 1 } })
    .toArray();

  if (users.length === 0) {
    console.error('No users found — cannot assign hosts. Seed users first.');
    process.exit(1);
  }

  // helper: pick `count` distinct user _ids, always including the host first.
  const pickAttendees = (hostId, count) => {
    const pool = users.filter((u) => u._id.toString() !== hostId.toString());
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return [hostId, ...shuffled.slice(0, count).map((u) => u._id)];
  };

  const u = (i) => users[i % users.length]._id;

  const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

  const seed = [
    // ---- Upcoming ----
    {
      title: 'Spring Seed Swap & Plant Exchange',
      description:
        'Bring your spare seeds, cuttings, and seedlings — leave with something new. Beginners welcome, labels provided.',
      date: at(4, 10, 30),
      location: 'Riverside Community Hall',
      image: img('photo-1466692476868-aef1dfb1e735'),
      host: u(0),
    },
    {
      title: 'Urban Balcony Gardening Workshop',
      description:
        'Make the most of a small space. Container choices, vertical growing, and the best edibles for limited sun.',
      date: at(7, 18, 0),
      location: 'Downtown Maker Studio',
      image: img('photo-1485955900006-10f4d324d411'),
      host: u(3),
    },
    {
      title: 'Heirloom Tomato Tasting Fair',
      description:
        'Sample 30+ heirloom varieties, vote for your favorite, and grab seedlings to grow your own this season.',
      date: at(12, 11, 0),
      location: 'Greenfield Farmers Market',
      image: img('photo-1592841200221-a6898f307baa'),
      host: u(4),
    },
    {
      title: 'Composting 101: Hands-on Workshop',
      description:
        'Turn kitchen scraps into black gold. Cold vs hot composting, balancing greens and browns, and troubleshooting smells.',
      date: at(16, 14, 0),
      location: 'Eastside Allotments',
      image: img('photo-1416879595882-3373a0480b5b'),
      host: u(7),
    },
    {
      title: 'Community Garden Tour & Potluck',
      description:
        'A relaxed walk through six neighbourhood plots, followed by a shared lunch. Bring a dish made with home-grown produce.',
      date: at(21, 12, 30),
      location: 'Maple Street Community Garden',
      image: img('photo-1523348837708-15d4a09cfac2'),
      host: u(9),
    },
    {
      title: 'Succulent Propagation Meetup',
      description:
        'Leaf and offset propagation, soil mixes, and rot prevention. Take home three propagated cuttings.',
      date: at(28, 17, 30),
      location: 'The Glasshouse Cafe',
      image: img('photo-1459411552884-841db9b3cc2a'),
      host: u(11),
    },
    // ---- Past ----
    {
      title: 'Winter Pruning Masterclass',
      description:
        'Fruit tree shaping, when to cut, and tool care. Held in the orchard — boots recommended.',
      date: at(-20, 10, 0),
      location: 'Orchard Lane Farm',
      image: img('photo-1574263867128-a3d5c1b1deae'),
      host: u(1),
    },
    {
      title: 'Native Pollinator Planting Day',
      description:
        'A morning of planting wildflowers and building bee hotels to support local pollinators.',
      date: at(-8, 9, 30),
      location: 'Hillside Nature Reserve',
      image: img('photo-1469259943454-aa100abba749'),
      host: u(13),
    },
  ];

  const titles = seed.map((e) => e.title);
  const removed = await db
    .collection('events')
    .deleteMany({ title: { $in: titles } });

  const now = new Date();
  const docs = seed.map((e, i) => ({
    ...e,
    // upcoming events get more RSVPs than past ones, just for variety
    attendees: pickAttendees(e.host, e.date >= now ? 4 + (i % 4) : 6),
    createdAt: now,
    updatedAt: now,
  }));

  const res = await db.collection('events').insertMany(docs);
  console.log(
    `Removed ${removed.deletedCount} prior seed event(s), inserted ${res.insertedCount}.`
  );
  const upcoming = docs.filter((d) => d.date >= now).length;
  console.log(`  Upcoming: ${upcoming}   Past: ${docs.length - upcoming}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
