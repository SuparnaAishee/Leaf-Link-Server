import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { User } from '../User/user.model';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { notificationService } from '../Notification/notification.service';

const followUser = async (
  user: JwtPayload,
  payload: { followingId: string }
) => {
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

  // Prevent self-follow
  if (user._id === payload.followingId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself.');
  }

  const isAlreadyFollowed = followingUser.followers?.some((follower) => {
    return follower.equals(user._id);
  });

  if (isAlreadyFollowed) {
    // Unfollow: Remove from both users (bidirectional)
    await User.findByIdAndUpdate(
      payload.followingId,
      { $pull: { followers: user._id } },
      { new: true }
    );

    const result = await User.findByIdAndUpdate(
      user._id,
      { $pull: { following: payload.followingId } },
      { new: true }
    );

    return {
      result,
      message: 'Successfully unfollowed the user',
    };
  } else {
    // Follow: Add to both users (bidirectional)
    await User.findByIdAndUpdate(
      payload.followingId,
      { $addToSet: { followers: user._id } },
      { new: true }
    );

    const result = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { following: payload.followingId } },
      { new: true }
    );

    void notificationService.createNotification({
      recipient: new mongoose.Types.ObjectId(payload.followingId),
      actor: new mongoose.Types.ObjectId(user._id),
      type: 'follow',
    });

    return {
      result,
      message: 'Successfully followed the user',
    };
  }
};

export const followService = {
  followUser,
};
