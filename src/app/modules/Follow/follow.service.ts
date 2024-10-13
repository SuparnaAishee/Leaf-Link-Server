// import { User } from '../User/user.model';
// import { JwtPayload } from 'jsonwebtoken';
// import AppError from '../../errors/AppError';
// import httpStatus from 'http-status';

// const followUser = async (
//   user: JwtPayload,
//   payload: { followingId: string }
// ) => {
//   if (!user?._id) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'User ID is required.');
//   }

//   const followerUser = await User.findById(user._id);
//   if (!followerUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Follower user is not found!');
//   }

//   const followingUser = await User.findById(payload.followingId);
//   if (!followingUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Following user is not found!');
//   }

//   const isAlreadyFollowed = followingUser.followers?.some((follower) =>
//     follower.equals(user._id)
//   );

//   if (isAlreadyFollowed) {
//     // Unfollow the user
//     followingUser.followers.pull(user._id);
//     followerUser.following.pull(followingUser._id);
//     await followingUser.save();
//     await followerUser.save();

//     return {
//       message: 'Successfully unfollowed the user',
//       result: followingUser,
//     };
//   } else {
//     // Follow the user
//     followingUser.followers.push(user._id);
//     followerUser.following.push(followingUser._id);
//     await followingUser.save();
//     await followerUser.save();

//     return {
//       message: 'Successfully followed the user',
//       result: followingUser,
//     };
//   }
// };

// export const followService = {
//   followUser,
// };

import httpStatus from 'http-status';

import { User } from '../User/user.model';

import {  JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
const followUser = async (
  user: JwtPayload,
  payload: { followingId: string }
) => {

  console.log('User from JWT:', user);
  console.log('Payload:', payload);

  if (!user?._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User ID is required.');
  }

  const followerUser = await User.findById(user._id);
  if (!followerUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Follower user is not found!');
  }

  const followingUser = await User.findById(payload.followingId);
  if (!followingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Following user is not found!');
  }

  const isAlreadyFollowed = followingUser.followers?.some((follower) => {
    return follower.equals(user._id);
  });

  if (isAlreadyFollowed) {
    const result = await User.findByIdAndUpdate(
      payload.followingId,
      {
        $pull: { followers: user._id },
      },
      { new: true }
    );

    return {
      result,
      message: 'Successfully unfollowed the user',
    };
  } else {
    const result = await User.findByIdAndUpdate(
      payload.followingId,
      {
        $addToSet: { followers: user._id },
      },
      { new: true }
    );

    return {
      result,
      message: 'Successfully followed the user',
    };
  }
};

export const followService = {
  followUser,
};
