/* eslint-disable no-console */
/**
 * Seed script for local development.
 *
 * Populates the database with sample LeafLink gardening content:
 * users, posts across every category, comments, follows and upvotes.
 *
 * Run with:  npx ts-node src/seed.ts
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
];

// Comments keyed by post index -> [ [authorKey, text], ... ]
const commentsSeed: Record<number, [keyof typeof AVATARS, string][]> = {
  0: [
    ['mike', 'Great tip! My basil always flowers too early.'],
    ['lily', 'Mine is on a south-facing window and loving it.'],
  ],
  1: [
    ['sarah', 'Those look incredible 😍'],
    ['raj', 'Mulching really is underrated for tomatoes.'],
    ['emma', 'Congrats on the harvest!'],
  ],
  2: [['lily', 'Tulips are the best part of spring.']],
  3: [
    ['mike', 'Been meaning to build one of these. Thanks for the ratio!'],
    ['sarah', 'Pallet projects are the best.'],
  ],
  4: [['emma', 'The leaf fenestration is so satisfying.']],
  5: [['raj', '$50 is a steal. Cedar lasts for years too.']],
  8: [['sarah', 'Propagation is addictive, you have been warned 😂']],
};

// Follow relationships: follower -> following
const followsSeed: [keyof typeof AVATARS, keyof typeof AVATARS][] = [
  ['mike', 'sarah'],
  ['emma', 'sarah'],
  ['raj', 'sarah'],
  ['lily', 'sarah'],
  ['sarah', 'emma'],
  ['mike', 'emma'],
  ['raj', 'lily'],
  ['sarah', 'lily'],
];

async function seed() {
  await mongoose.connect(config.db_url as string);
  console.log('🛢  Connected to', config.db_url);

  console.log('🧹 Clearing existing users, posts and comments...');
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  // 1) Users (saved individually so the pre-save hook hashes passwords)
  const userIdByKey: Record<string, mongoose.Types.ObjectId> = {};
  for (const u of usersSeed) {
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
    userIdByKey[u.key] = created._id as mongoose.Types.ObjectId;
  }
  console.log(`👤 Created ${usersSeed.length} users`);

  // 2) Posts
  const postIds: mongoose.Types.ObjectId[] = [];
  for (let i = 0; i < postsSeed.length; i++) {
    const p = postsSeed[i];
    const authorId = userIdByKey[p.author];

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
    postIds.push(post._id as mongoose.Types.ObjectId);

    await User.findByIdAndUpdate(authorId, {
      $addToSet: { posts: post._id },
    });
  }
  console.log(`📝 Created ${postsSeed.length} posts`);

  // 3) Comments (and sync them onto their post)
  let commentCount = 0;
  for (const [postIdxStr, entries] of Object.entries(commentsSeed)) {
    const postId = postIds[Number(postIdxStr)];
    const postDoc = await Post.findById(postId);
    if (!postDoc) continue;
    for (const [authorKey, text] of entries) {
      const comment = await Comment.create({
        comment: text,
        post: postId,
        user: userIdByKey[authorKey],
        postUser: postDoc.user,
      });
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { comments: comment._id },
      });
      commentCount++;
    }
  }
  console.log(`💬 Created ${commentCount} comments`);

  // 4) Follows (bidirectional)
  for (const [followerKey, followingKey] of followsSeed) {
    const followerId = userIdByKey[followerKey];
    const followingId = userIdByKey[followingKey];
    await User.findByIdAndUpdate(followerId, {
      $addToSet: { following: followingId },
    });
    await User.findByIdAndUpdate(followingId, {
      $addToSet: { followers: followerId },
    });
  }
  console.log(`🤝 Created ${followsSeed.length} follow relationships`);

  console.log('\n✅ Seed complete!');
  console.log('   Login with any of:');
  usersSeed.forEach((u) =>
    console.log(`   - ${u.email}  /  ${u.password}${u.role === 'ADMIN' ? '  (admin)' : ''}`)
  );

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
