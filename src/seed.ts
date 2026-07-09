/* eslint-disable no-console */
/**
 * Seed script for local development.
 *
 * Populates the database with sample LeafLink gardening content:
 * users, posts across every category, comments, follows and upvotes.
 *
 * Run additively (keeps your own account, your comments, etc.):
 *   npx ts-node src/seed.ts
 *
 * Run as a full reset (wipes all users/posts/comments first):
 *   SEED_RESET=1 npx ts-node src/seed.ts
 *
 * All sample users share the password "password123"
 * (admin@gmail.com uses "admin123").
 */
import mongoose from 'mongoose';
import config from './app/config';
import { User } from './app/modules/User/user.model';
import { Post } from './app/modules/Post/post.model';
import { Comment } from './app/modules/Comment/comment.model';

const AVATARS = {
  demo:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  sarah:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  mike:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  emma:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  raj: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  lily:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  admin:
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop',
  asha:
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
  jordan:
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  yara:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  ben:
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
  sophie:
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&h=200&fit=crop',
  diego:
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
  nina:
    'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=200&h=200&fit=crop',
  owen:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&sat=-30',
};

type SeedUser = {
  key: keyof typeof AVATARS;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  bio: string;
  profilePhoto: string;
  isVerified?: boolean;
  premiumStatus?: boolean;
};

const usersSeed: SeedUser[] = [
  {
    key: 'sarah',
    name: 'Sarah Green',
    email: 'sarah@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Urban gardener growing herbs on my balcony 🌿',
    profilePhoto: AVATARS.sarah,
    isVerified: true,
    premiumStatus: true,
  },
  {
    key: 'mike',
    name: 'Mike Thompson',
    email: 'mike@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Backyard vegetable farmer. Tomatoes are life 🍅',
    profilePhoto: AVATARS.mike,
  },
  {
    key: 'emma',
    name: 'Emma Rose',
    email: 'emma@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Flower enthusiast & florist 🌸',
    profilePhoto: AVATARS.emma,
    isVerified: true,
  },
  {
    key: 'raj',
    name: 'Raj Patel',
    email: 'raj@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Composting nerd and organic gardening advocate ♻️',
    profilePhoto: AVATARS.raj,
  },
  {
    key: 'lily',
    name: 'Lily Chen',
    email: 'lily@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Indoor plant collector. 47 plants and counting 🪴',
    profilePhoto: AVATARS.lily,
    isVerified: true,
  },
  {
    key: 'admin',
    name: 'LeafLink Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'ADMIN',
    bio: 'Keeping the garden tidy.',
    profilePhoto: AVATARS.admin,
  },
  {
    key: 'demo',
    name: 'Demo User',
    email: 'demo@leaflink.app',
    password: 'demo1234',
    role: 'USER',
    bio: 'Exploring the LeafLink community 🌱',
    profilePhoto: AVATARS.mike,
    isVerified: true,
  },
  {
    key: 'asha',
    name: 'Asha Iyer',
    email: 'asha@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Bonsai practitioner since 2011. Patience over everything 🌳',
    profilePhoto: AVATARS.asha,
    isVerified: true,
  },
  {
    key: 'jordan',
    name: 'Jordan Lee',
    email: 'jordan@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Permaculture designer. Edges, not borders.',
    profilePhoto: AVATARS.jordan,
  },
  {
    key: 'yara',
    name: 'Yara Khan',
    email: 'yara@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Succulent and cactus collector. Sun lover ☀️',
    profilePhoto: AVATARS.yara,
  },
  {
    key: 'ben',
    name: 'Ben Carter',
    email: 'ben@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Hydroponics tinkerer. Lettuce in 30 days flat.',
    profilePhoto: AVATARS.ben,
    isVerified: true,
  },
  {
    key: 'sophie',
    name: 'Sophie Müller',
    email: 'sophie@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Microgreens on the kitchen counter. Tiny nutrition.',
    profilePhoto: AVATARS.sophie,
  },
  {
    key: 'diego',
    name: 'Diego Alvarez',
    email: 'diego@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Citrus and tropical fruit obsessed. Zone 9b.',
    profilePhoto: AVATARS.diego,
  },
  {
    key: 'nina',
    name: 'Nina Petrova',
    email: 'nina@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'Pollinator garden + wildflower meadows 🐝',
    profilePhoto: AVATARS.nina,
    isVerified: true,
  },
  {
    key: 'owen',
    name: 'Owen Walsh',
    email: 'owen@leaflink.com',
    password: 'password123',
    role: 'USER',
    bio: 'English cottage garden. Cut flowers all summer.',
    profilePhoto: AVATARS.owen,
  },
];

type SeedPost = {
  author: keyof typeof AVATARS;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
};

const postsSeed: SeedPost[] = [
  {
    author: 'sarah',
    title: 'How to keep basil thriving indoors',
    category: 'Herbs',
    description:
      'Basil loves warmth and at least 6 hours of light. Pinch off the top leaves regularly to encourage bushier growth and never let it flower if you want more leaves!',
    imageUrl:
      'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800&fit=crop',
  },
  {
    author: 'mike',
    title: 'My first tomato harvest of the season 🍅',
    category: 'Vegetables',
    description:
      'After 9 weeks of care, the first beefsteak tomatoes are ripe. Key learning: consistent watering prevents blossom-end rot. Mulch heavily!',
    imageUrl:
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&fit=crop',
  },
  {
    author: 'emma',
    title: 'Spring tulips are finally blooming',
    category: 'Flowers',
    description:
      'Planted these bulbs back in October and the wait was worth it. Tip: plant bulbs at 3x their height deep, pointy side up.',
    imageUrl:
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&fit=crop',
  },
  {
    author: 'raj',
    title: 'Building a simple compost bin from pallets',
    category: 'Organic',
    description:
      'Turned 4 old pallets into a 3-bay compost system this weekend. Greens + browns in a 1:3 ratio, turn weekly, and you get black gold in 3 months.',
    imageUrl:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&fit=crop',
  },
  {
    author: 'lily',
    title: 'My monstera finally split its leaves!',
    category: 'Indoor',
    description:
      'Patience pays off. Bright indirect light, a moss pole, and watering only when the top 2 inches are dry did the trick.',
    imageUrl:
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&fit=crop',
  },
  {
    author: 'sarah',
    title: 'DIY raised garden bed for under $50',
    category: 'Outdoor',
    description:
      'Built a 4x8 cedar raised bed in an afternoon. Raised beds warm up faster in spring and give you full control over the soil.',
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&fit=crop',
  },
  {
    author: 'mike',
    title: 'Companion planting: carrots love tomatoes',
    category: 'Vegetables',
    description:
      'Interplanting carrots with tomatoes saves space and the carrots loosen the soil. Just keep an eye on spacing so nothing gets crowded.',
    imageUrl:
      'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&fit=crop',
  },
  {
    author: 'raj',
    title: 'Why mulching is the best thing for your garden',
    category: 'Organic',
    description:
      'A 2-3 inch layer of mulch suppresses weeds, retains moisture, and feeds the soil as it breaks down. Wood chips are my go-to.',
    imageUrl:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&fit=crop',
  },
  {
    author: 'lily',
    title: 'Propagating pothos in water — step by step',
    category: 'Indoor',
    description:
      'Cut below a node, drop in water, change weekly. Roots appear in 2-3 weeks. Free plants forever 🌱',
    imageUrl:
      'https://images.unsplash.com/photo-1602923668104-8f9e03e77e62?w=800&fit=crop',
  },
  {
    author: 'emma',
    title: 'Attracting pollinators with lavender',
    category: 'Flowers',
    description:
      'Lavender is drought tolerant, smells amazing, and the bees absolutely love it. Plant in full sun with well-draining soil.',
    imageUrl:
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&fit=crop',
  },
  {
    author: 'asha',
    title: 'Wiring a juniper bonsai for the first time',
    category: 'Outdoor',
    description:
      'Use anodized aluminum wire ~1/3 the branch thickness. Wrap at 45°, never leave wire on more than 6-8 weeks or it scars the bark forever.',
    imageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&fit=crop',
  },
  {
    author: 'jordan',
    title: 'Why I planted comfrey along every fruit tree',
    category: 'Organic',
    description:
      'Comfrey mines deep nutrients and you chop-and-drop it 3x a season as a free mulch + fertilizer. Best dynamic accumulator I know.',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&fit=crop',
  },
  {
    author: 'yara',
    title: 'Echeveria sunburn — what I learned the hard way',
    category: 'Indoor',
    description:
      'Even sun-loving succulents need to be hardened off slowly. Move from indoors to bright shade for 2 weeks, then morning sun only.',
    imageUrl:
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&fit=crop',
  },
  {
    author: 'ben',
    title: 'Kratky-method lettuce in mason jars',
    category: 'Vegetables',
    description:
      'No pumps, no electricity. A net cup, a hydroton pebble layer, and a jar of nutrient solution. Three weeks to a salad.',
    imageUrl:
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&fit=crop',
  },
  {
    author: 'sophie',
    title: 'Microgreens give you fresh greens in 10 days',
    category: 'Herbs',
    description:
      'Soak seeds 8h, sow dense on damp soil, weight them down for 2 days, then expose to light. Sunflower and pea shoots are the easiest start.',
    imageUrl:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&fit=crop',
  },
  {
    author: 'diego',
    title: 'Overwintering Meyer lemons indoors',
    category: 'Indoor',
    description:
      "I bring my Meyer in once nights drop below 50°F. South window, humidifier nearby, and I cut watering in half. Don't fertilize until March.",
    imageUrl:
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&fit=crop',
  },
  {
    author: 'nina',
    title: "Wildflower meadow strip — year one results",
    category: 'Flowers',
    description:
      'Converted 200 sq ft of lawn into a pollinator strip with a regional native seed mix. By June I counted 14 bee species visiting.',
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&fit=crop',
  },
  {
    author: 'owen',
    title: 'Cut-and-come-again zinnias for endless bouquets',
    category: 'Flowers',
    description:
      "Pinch the central stem when zinnias are 8-10\" tall. Sounds painful but it triggers branching and you'll get 4x the cut stems all summer.",
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&fit=crop&sat=-50',
  },
  {
    author: 'asha',
    title: 'Repotting season — root pruning a 12-year ficus',
    category: 'Outdoor',
    description:
      'Trim no more than 1/3 of the root mass. Pack fresh akadama, water until it runs clear, then shade for 2 weeks. Patience is the only shortcut.',
    imageUrl:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&fit=crop&sat=20',
  },
  {
    author: 'jordan',
    title: 'Three-sisters bed: corn, beans, squash',
    category: 'Vegetables',
    description:
      'Corn gives the beans a trellis, beans fix nitrogen for the corn, squash leaves shade out weeds. The OG companion planting trio.',
    imageUrl:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&fit=crop',
  },
  {
    author: 'demo',
    title: 'Starting my first raised bed — wish me luck!',
    category: 'Outdoor',
    description:
      'Built my first raised bed this weekend, inspired by everyone here. Going with tomatoes, basil and a couple of pepper plants. Any tips for a total beginner?',
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&fit=crop&sat=10',
  },
  {
    author: 'demo',
    title: 'My balcony herb corner is finally taking shape 🌿',
    category: 'Herbs',
    description:
      'Mint, basil and chives on a small balcony rack. Southeast facing so it only gets morning sun, but they all seem happy so far.',
    imageUrl:
      'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800&fit=crop&sat=-10',
  },
];

// Comments keyed by post index -> [ [authorKey, text], ... ]
const commentsSeed: Record<number, [keyof typeof AVATARS, string][]> = {
  0: [
    ['mike', 'Great tip! My basil always flowers too early.'],
    ['lily', 'Mine is on a south-facing window and loving it.'],
    ['sophie', 'Pinching really is the secret — agreed.'],
    ['demo', 'Trying this on my balcony basil right now, thank you!'],
  ],
  1: [
    ['sarah', 'Those look incredible 😍'],
    ['raj', 'Mulching really is underrated for tomatoes.'],
    ['emma', 'Congrats on the harvest!'],
    ['ben', 'How are your evening temps? Mine drop too fast.'],
    ['demo', 'So inspiring — hoping for something similar this summer!'],
  ],
  2: [
    ['lily', 'Tulips are the best part of spring.'],
    ['owen', 'I plant a fresh batch each October too — never get tired of them.'],
  ],
  3: [
    ['mike', 'Been meaning to build one of these. Thanks for the ratio!'],
    ['sarah', 'Pallet projects are the best.'],
    ['jordan', 'Pallet wood + comfrey leaves = top tier hot compost 🔥'],
  ],
  4: [
    ['emma', 'The leaf fenestration is so satisfying.'],
    ['yara', 'Mine took 2 years to split. Worth the wait.'],
  ],
  5: [
    ['raj', '$50 is a steal. Cedar lasts for years too.'],
    ['nina', 'I edged mine with wildflower mix — pollinators love it.'],
  ],
  8: [['sarah', 'Propagation is addictive, you have been warned 😂']],
  // New user posts (indexes shift — these correspond to the appended posts).
  10: [
    ['emma', 'Wiring is the part I keep putting off. Thanks for the timeline.'],
    ['jordan', 'Aluminum is so much friendlier than copper for beginners.'],
  ],
  11: [
    ['raj', 'Comfrey is my secret weapon too.'],
    ['nina', 'Bocking 14 is non-spreading if you want to skip the takeover risk.'],
  ],
  12: [['sarah', 'Tell me about it — burned a whole tray last spring 😅']],
  13: [
    ['ben', 'Kratky changed my apartment gardening game.'],
    ['sophie', 'Anyone else tried this with arugula? Curious.'],
  ],
  14: [['lily', 'Microgreens are an amazing winter project.']],
  15: [['owen', 'Meyer lemons indoors smell incredible in February.']],
  16: [
    ['emma', '14 bee species is huge. What was the seed mix?'],
    ['jordan', 'Strips like this around the property edges = stacking functions.'],
  ],
  17: [
    ['sarah', 'I need to remember to pinch — I always forget the first time.'],
  ],
  20: [
    ['sarah', 'Welcome to raised beds! Cedar or pine?'],
    ['mike', "Tomatoes + basil is a classic combo, you'll love it."],
    ['raj', "Mulch it well once it warms up and you'll thank yourself later."],
  ],
  21: [
    ['lily', 'Balcony herb gardens are so satisfying — looks great!'],
    ['sophie', 'Chives are so low maintenance, good choice.'],
  ],
};

// Follow relationships: follower -> following
const followsSeed: [keyof typeof AVATARS, keyof typeof AVATARS][] = [
  // Original web
  ['mike', 'sarah'],
  ['emma', 'sarah'],
  ['raj', 'sarah'],
  ['lily', 'sarah'],
  ['sarah', 'emma'],
  ['mike', 'emma'],
  ['raj', 'lily'],
  ['sarah', 'lily'],
  // New users following established gardeners
  ['asha', 'sarah'],
  ['jordan', 'raj'],
  ['yara', 'lily'],
  ['ben', 'mike'],
  ['sophie', 'sarah'],
  ['diego', 'emma'],
  ['nina', 'emma'],
  ['owen', 'emma'],
  // Established users following the new ones
  ['sarah', 'nina'],
  ['emma', 'owen'],
  ['lily', 'yara'],
  ['mike', 'ben'],
  ['raj', 'jordan'],
  // Mutual interest among new users
  ['asha', 'jordan'],
  ['jordan', 'nina'],
  ['sophie', 'ben'],
  ['yara', 'diego'],
  ['nina', 'owen'],
  // Demo account — give it a lived-in social graph
  ['demo', 'sarah'],
  ['demo', 'mike'],
  ['demo', 'lily'],
  ['sarah', 'demo'],
  ['mike', 'demo'],
  ['raj', 'demo'],
];

async function seed() {
  const reset = process.env.SEED_RESET === '1';

  await mongoose.connect(config.db_url as string);
  console.log('🛢  Connected to', config.db_url);

  if (reset) {
    console.log('🧹 SEED_RESET=1 → wiping users, posts and comments...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
    ]);
  } else {
    console.log('➕ Additive mode — your own users/posts/comments stay put. Set SEED_RESET=1 to wipe.');
  }

  // 1) Users — only create when absent so re-runs are idempotent (and so the
  //    pre-save hook re-hashes passwords on the first run only).
  const userIdByKey: Record<string, mongoose.Types.ObjectId> = {};
  let usersCreated = 0;
  for (const u of usersSeed) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      userIdByKey[u.key] = existing._id as unknown as mongoose.Types.ObjectId;
      continue;
    }
    const created = await User.create({
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role,
      mobileNumber: '01700000000',
      profilePhoto: u.profilePhoto,
      bio: u.bio,
      isVerified: u.isVerified ?? false,
      premiumStatus: u.premiumStatus ?? false,
    });
    userIdByKey[u.key] = created._id as unknown as mongoose.Types.ObjectId;
    usersCreated++;
  }
  console.log(
    `👤 Users — ${usersCreated} new, ${usersSeed.length - usersCreated} already present`,
  );

  // 2) Posts — keyed by (user, title) for idempotency.
  const postIds: mongoose.Types.ObjectId[] = [];
  let postsCreated = 0;
  for (let i = 0; i < postsSeed.length; i++) {
    const p = postsSeed[i];
    const authorId = userIdByKey[p.author];
    if (!authorId) continue;

    const existingPost = await Post.findOne({
      user: authorId,
      title: p.title,
    });
    if (existingPost) {
      postIds.push(existingPost._id as unknown as mongoose.Types.ObjectId);
      continue;
    }

    // Give each post a believable set of upvotes from other users.
    const upvoters = Object.entries(userIdByKey)
      .filter(([key]) => key !== p.author)
      .map(([, id]) => id)
      .slice(0, (i % 4) + 1);

    const post = await Post.create({
      title: p.title,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl,
      user: authorId,
      isPremium: false,
      upvotes: upvoters,
      downvotes: [],
      comments: [],
    });
    postIds.push(post._id as unknown as mongoose.Types.ObjectId);
    postsCreated++;

    await User.findByIdAndUpdate(authorId, {
      $addToSet: { posts: post._id },
    });
  }
  console.log(
    `📝 Posts — ${postsCreated} new, ${postsSeed.length - postsCreated} already present`,
  );

  // 3) Comments (keyed by user+post+text for idempotency).
  let commentsCreated = 0;
  for (const [postIdxStr, entries] of Object.entries(commentsSeed)) {
    const postId = postIds[Number(postIdxStr)];
    if (!postId) continue;
    const postDoc = await Post.findById(postId);
    if (!postDoc) continue;
    for (const [authorKey, text] of entries) {
      const authorId = userIdByKey[authorKey];
      if (!authorId) continue;
      const existingComment = await Comment.findOne({
        post: postId,
        user: authorId,
        comment: text,
      });
      if (existingComment) continue;

      const comment = await Comment.create({
        comment: text,
        post: postId,
        user: authorId,
        postUser: postDoc.user,
      });
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { comments: comment._id },
      });
      commentsCreated++;
    }
  }
  console.log(`💬 Comments — ${commentsCreated} new`);

  // 4) Follows ($addToSet is already idempotent on both sides)
  for (const [followerKey, followingKey] of followsSeed) {
    const followerId = userIdByKey[followerKey];
    const followingId = userIdByKey[followingKey];
    if (!followerId || !followingId) continue;
    await User.findByIdAndUpdate(followerId, {
      $addToSet: { following: followingId },
    });
    await User.findByIdAndUpdate(followingId, {
      $addToSet: { followers: followerId },
    });
  }
  console.log(`🤝 Follows — ${followsSeed.length} relationships ensured`);

  console.log('\n✅ Seed complete!');
  console.log('   Login with any of:');
  usersSeed.forEach((u) =>
    console.log(
      `   - ${u.email}  /  ${u.password}${u.role === 'ADMIN' ? '  (admin)' : ''}`,
    ),
  );

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
