/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import {  TPost } from './post.interface';
import { Post } from './post.model';
import { ObjectId } from 'mongodb';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../../utils/verifyJWT';
import config from '../../config';
import { ObjectIdLike } from 'bson';

const createPostToDB = async (payload: TPost) => {
  const isUserExist = await User.findById(payload.user);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const post = await Post.create(payload);
  await User.findByIdAndUpdate(
    payload.user,
    { $addToSet: { posts: post._id } },
    { new: true }
  );

  return post;
};
const getUserPostFromDB = async (user: JwtPayload) => {
  // Check if the user exists
  const isUserExist = await User.findById(user._id);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
console.log('User ID:', isUserExist._id);
  // Retrieve posts for the user
  const posts = await Post.find({ user: isUserExist._id })
    .populate('upvotes')
    .populate('downvotes')
    .populate('user');

  return posts;
};
// Advanced Search and Filter
// export const getUserPostFromDB = async (req: Request, res: Response) => {
//   try {
//     const { title, category, dateFrom, dateTo, user } = req.query;

//     // Create a dynamic filter object
//     // eslint-disable-next-line prefer-const
//     let filter: any = {};

//     if (title) {
//       filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
//     }

//     if (category) {
//       filter.category = category; // Assuming category is an exact match
//     }

//     if (dateFrom || dateTo) {
//       filter.createdAt = {};
//       if (dateFrom) {
//         filter.createdAt.$gte = new Date(dateFrom as string); // Greater than or equal to
//       }
//       if (dateTo) {
//         filter.createdAt.$lte = new Date(dateTo as string); // Less than or equal to
//       }
//     }

//     if (user) {
//       filter.user = user; // Search by user ID
//     }

//     // Fetch the posts from the database
//     const posts = await Post.find(filter)
//       .populate('user', 'username') // Populate the 'user' field if needed
//       .populate('upvotes', 'name')
//       .populate('downvotes', 'name');

//     res.status(200).json(posts);
//   // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching posts' });
//   }
// };
const getSingleUserPostsFromDB = async (id: string) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const posts = await Post.find({ user: isUserExist._id })
    .populate('upvotes')
    .populate('downvotes')
    .populate('user');

  return posts;
};

// const getAllPostFromDB = async (
//   token: string | undefined,
//   queryParams: Record<string, unknown>
// ) => {
//   const { searchTerm, sort = '-createdAt', limit = 10, skip = 0 } = queryParams;

//   const pipeline: any[] = [];

//   if (token) {
//     const decoded = verifyToken(
//       token,
//       config.jwt_access_secret as string
//     ) as JwtPayload;

//     const { email } = decoded;
//     const isUserExist = await User.findOne({ email: email });

//     if (
//       isUserExist &&
//       !isUserExist?.isVerified &&
//       !isUserExist?.premiumStatus &&
//       isUserExist?.role === 'USER'
//     ) {
//       pipeline.push({
//         $match: {
//           isPremium: false,
//         },
//       });
//     }
//   } else {
//     pipeline.push({
//       $match: {
//         isPremium: false,
//       },
//     });
//   }

//   // Search by title or description or category
//   if (searchTerm) {
//     const regex = new RegExp(searchTerm as string, 'i'); // case-insensitive search
//     pipeline.push({
//       $match: {
//         $or: [{ title: regex }, { description: regex }, { category: regex }],
//       },
//     });
//   }

//   // Sorting based on the query parameter
//   if (sort === 'upvotes') {
//     pipeline.push({
//       $addFields: {
//         upvoteCount: { $size: '$upvotes' }, // Calculate the number of upvotes
//       },
//     });
//     pipeline.push({
//       $sort: { upvoteCount: -1 }, // Sort by upvote count in descending order
//     });
//   } else if (sort === 'downvotes') {
//     pipeline.push({
//       $addFields: {
//         downvoteCount: { $size: '$downvotes' }, // Calculate the number of upvotes
//       },
//     });
//     pipeline.push({
//       $sort: { downvoteCount: -1 }, // Sort by upvote count in descending order
//     });
//   } else {
//     pipeline.push({
//       $sort: { createdAt: -1 }, // Default sorting by creation date
//     });
//   }

//   pipeline.push({
//     $skip: Number(skip),
//   });

//   pipeline.push({
//     $limit: Number(limit),
//   });

//   const posts = await Post.aggregate(pipeline).exec();
//   const populatedPosts = await Post.populate(posts, [
//     { path: 'user', populate: ['followers', 'following', 'posts'] },
//     { path: 'upvotes' },
//     { path: 'downvotes' },
//   ]);

//   return populatedPosts;
// };

// const getAllPostFromDB = async (
//   token: string | undefined,
//   queryParams: Record<string, unknown>
// ) => {
//   const { searchTerm, sort = '-createdAt', category } = queryParams;
//   const pipeline: any[] = [];

//   // Basic filtering for premium posts based on user role
//   const matchConditions: any = { isPremium: false };

//   // Token-based filtering logic
//   if (token) {
//     const decoded = verifyToken(
//       token,
//       config.jwt_access_secret as string
//     ) as JwtPayload;

//     const { email } = decoded;
//     const isUserExist = await User.findOne({ email });

//     if (
//       isUserExist &&
//       !isUserExist.isVerified &&
//       !isUserExist.premiumStatus &&
//       isUserExist.role === 'USER'
//     ) {
//       matchConditions.isPremium = false; // Ensure non-premium
//     }
//   }

//   // Combine search filters
//   if (category) {
//     matchConditions.category = category; // Add category filter
//   }

//   if (searchTerm) {
//     matchConditions.$or = [
//       { title: { $regex: searchTerm, $options: 'i' } },
//       { description: { $regex: searchTerm, $options: 'i' } },
//     ];
//   }

//   // Add match conditions to the pipeline
//   pipeline.push({ $match: matchConditions });

//   // Sorting logic
//   if (sort === 'upvotes') {
//     pipeline.push({ $addFields: { upvoteCount: { $size: '$upvotes' } } });
//     pipeline.push({ $sort: { upvoteCount: -1 } });
//   } else if (sort === 'downvotes') {
//     pipeline.push({ $addFields: { downvoteCount: { $size: '$downvotes' } } });
//     pipeline.push({ $sort: { downvoteCount: -1 } });
//   } else {
//     // Default sorting by creation date
//     pipeline.push({ $sort: { createdAt: -1 } });
//   }

//   try {
//     // Execute the aggregation pipeline
//     const posts = await Post.aggregate(pipeline).exec();

//     // Populate relevant fields such as user, upvotes, and downvotes
//     const populatedPosts = await Post.populate(posts, [
//       { path: 'user', populate: ['followers', 'following', 'posts'] },
//       { path: 'upvotes' },
//       { path: 'downvotes' },
//     ]);

//     return populatedPosts;
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     throw new Error('Failed to fetch posts');
//   }
// };
// Function to fetch posts based on search and filter
// const getAllPostFromDB = async (
//   token: string | undefined,
//   queryParams: Record<string, unknown>
// ) => {
//   const { searchTerm, sort = '-createdAt', category } = queryParams;
//   const pipeline: any[] = [];

//   // Match conditions for non-premium posts if the user isn't verified/premium
//   const matchConditions: any = { isPremium: false };

//   // Token-based premium access check
//   if (token) {
//     const decoded = verifyToken(
//       token,
//       config.jwt_access_secret as string
//     ) as JwtPayload;
//     const { email } = decoded;
//     const isUserExist = await User.findOne({ email });

//     if (
//       isUserExist &&
//       !isUserExist.isVerified &&
//       !isUserExist.premiumStatus &&
//       isUserExist.role === 'USER'
//     ) {
//       matchConditions.isPremium = false; // Non-premium users cannot see premium posts
//     }
//   }

//   // Add category filtering if provided (with case-insensitive matching)
//   if (category) {
//     matchConditions.category = { $regex: new RegExp(category as string, 'i') };
//   }

//   // Add search functionality (searching in title and description)
//   if (searchTerm) {
//     matchConditions.$or = [
//       { title: { $regex: searchTerm, $options: 'i' } },
//       { description: { $regex: searchTerm, $options: 'i' } },
//     ];
//   }

//   // Add the match conditions to the pipeline
//   pipeline.push({ $match: matchConditions });

//   // Sorting based on query (upvotes/downvotes or default - creation date)
//   if (sort === 'upvotes') {
//     pipeline.push({ $addFields: { upvoteCount: { $size: '$upvotes' } } });
//     pipeline.push({ $sort: { upvoteCount: -1 } });
//   } else if (sort === 'downvotes') {
//     pipeline.push({ $addFields: { downvoteCount: { $size: '$downvotes' } } });
//     pipeline.push({ $sort: { downvoteCount: -1 } });
//   } else {
//     pipeline.push({ $sort: { createdAt: -1 } }); // Default to sorting by creation date
//   }

//   try {
//     // Execute aggregation query
//     const posts = await Post.aggregate(pipeline).exec();

//     // Populate required fields
//     const populatedPosts = await Post.populate(posts, [
//       { path: 'user', select: 'name profilePhoto' }, // Populate user info
//       { path: 'upvotes' }, // You can customize this as needed
//       { path: 'downvotes' },
//     ]);

//     return populatedPosts;
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     throw new Error('Failed to fetch posts');
//   }
// };
const getAllPostFromDB = async (
  token: string | undefined,
  queryParams: Record<string, unknown>
) => {
  const { searchTerm, sort = '-createdAt', category } = queryParams;
  const pipeline: any[] = [];

  // Base match conditions, allowing premium posts by default
  const matchConditions: any = {};

  // Token-based premium access check
  if (token) {
    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    const { email } = decoded;
    const isUserExist = await User.findOne({ email });

    // Check user's premium status and update match conditions
    if (
      isUserExist &&
      !isUserExist.isVerified &&
      !isUserExist.premiumStatus &&
      isUserExist.role === 'USER'
    ) {
      matchConditions.isPremium = false; // Non-premium users cannot see premium posts
    }
  }

  // If the user can see premium posts, we don't filter by isPremium
  // Otherwise, include non-premium posts only
  if (Object.keys(matchConditions).length > 0) {
    matchConditions.isPremium = matchConditions.isPremium || { $ne: false }; // Only include non-premium posts if the user is not premium
  }

  // Add category filtering if provided (with case-insensitive matching)
  if (category) {
    matchConditions.category = { $regex: new RegExp(category as string, 'i') };
  }

  // Add search functionality (searching in title and description)
  if (searchTerm) {
    matchConditions.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Add the match conditions to the pipeline
  pipeline.push({ $match: matchConditions });

  // Sorting based on query (upvotes/downvotes or default - creation date)
  if (sort === 'upvotes') {
    pipeline.push({ $addFields: { upvoteCount: { $size: '$upvotes' } } });
    pipeline.push({ $sort: { upvoteCount: -1 } });
  } else if (sort === 'downvotes') {
    pipeline.push({ $addFields: { downvoteCount: { $size: '$downvotes' } } });
    pipeline.push({ $sort: { downvoteCount: -1 } });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } }); // Default to sorting by creation date
  }

  try {
    // Execute aggregation query
    const posts = await Post.aggregate(pipeline).exec();

    // Populate required fields
    const populatedPosts = await Post.populate(posts, [
      { path: 'user', select: 'name profilePhoto' }, // Populate user info
      { path: 'upvotes' }, // You can customize this as needed
      { path: 'downvotes' },
    ]);

    return populatedPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
};

const getSinglePostFromDB = async (id: string) => {
  const post = await Post.findById(id)
    .populate('upvotes')
    .populate('downvotes')
    .populate({
      path: 'user',
      populate: {
        path: 'followers',
      },
    })
    .populate({
      path: 'user',
      populate: {
        path: 'following',
      },
    })
    .populate({
      path: 'user',
      populate: {
        path: 'posts',
      },
    });

  return post;
};
const updateVote = async (payload: { userId: string | ObjectId | ObjectIdLike | null | undefined; postId: any; voteType: string; }) => {
  const isUserExist = await User.findById(payload.userId);
  const isPostExist = await Post.findById(payload.postId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const isAlreadyUpVoted = isPostExist.upvotes.find((upvote) =>
    upvote.equals(payload.userId)
  );
  const isAlreadyDownVoted = isPostExist.downvotes.find((downvote) =>
    downvote.equals(payload.userId)
  );

  if (payload.voteType === 'upvote') {
    if (isAlreadyUpVoted) {
      // Remove user from upvote array
      return await Post.findByIdAndUpdate(
        payload.postId,
        { $pull: { upvotes: payload.userId } },
        { new: true }
      );
    } else {
      // Remove user from downvote array if exists
      if (isAlreadyDownVoted) {
        await Post.findByIdAndUpdate(
          payload.postId,
          { $pull: { downvotes: payload.userId } },
          { new: true }
        );
      }
      // Add user to upvote array
      return await Post.findByIdAndUpdate(
        payload.postId,
        { $addToSet: { upvotes: payload.userId } },
        { new: true }
      );
    }
  }

  if (payload.voteType === 'downvote') {
    if (isAlreadyDownVoted) {
      // Remove user from downvote array
      return await Post.findByIdAndUpdate(
        payload.postId,
        { $pull: { downvotes: payload.userId } },
        { new: true }
      );
    } else {
      // Remove user from upvote array if exists
      if (isAlreadyUpVoted) {
        await Post.findByIdAndUpdate(
          payload.postId,
          { $pull: { upvotes: payload.userId } },
          { new: true }
        );
      }
      // Add user to downvote array
      return await Post.findByIdAndUpdate(
        payload.postId,
        { $addToSet: { downvotes: payload.userId } },
        { new: true }
      );
    }
  }
};


const bookmarkFavoritePost = async (
  payload: { postId: string },
  user: JwtPayload
) => {
  const isPostExist = await Post.findOne({ _id: payload.postId });
  const isUserExist = await User.findOne({ _id: user?._id });

  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  /* Find already bookmarked this post  */
  const isAlreadyBookmarked = isUserExist?.favorites?.find((favorite) => {
    return favorite.equals(new ObjectId(payload.postId));
  });

  if (isAlreadyBookmarked) {
    // remove the bookmark from favorites array
    const result = await User.findByIdAndUpdate(
      user?._id,
      {
        $pull: { favorites: payload.postId },
      },
      { new: true }
    );

    return {
      result,
      message: 'Removed bookmark post successfully!',
    };
  } else {
    // push the post id to favorites array
    const result = await User.findByIdAndUpdate(
      user?._id,
      {
        $addToSet: { favorites: payload.postId },
      },
      { new: true }
    );
    return {
      result,
      message: 'Added to bookmark successfully!',
    };
  }
};

const deletePostFromDB = async (id: string) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  const result = await Post.findByIdAndDelete(id, { new: true });
  await User.findByIdAndUpdate(
    post.user,
    {
      $pull: { posts: id },
    },
    { new: true }
  );
  return result;
};

const updatePostInToDD = async (id: string, payload: Partial<TPost>) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  console.log(payload);
  const result = await Post.findByIdAndUpdate(id, payload, { new: true });
  console.log(result);

  return result;
};
export const postService = {
  createPostToDB,
  getUserPostFromDB,
  updateVote,
  deletePostFromDB,
  bookmarkFavoritePost,
  getAllPostFromDB,
  getSinglePostFromDB,
  getSingleUserPostsFromDB,
  // getUpvotersForMyPosts,
  updatePostInToDD,
};
