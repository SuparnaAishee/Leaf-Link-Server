// /* eslint-disable no-useless-escape */
// import bcryptjs from 'bcryptjs';
// import { Schema, model } from 'mongoose';
// import config from '../../config';
// import { USER_ROLE, USER_STATUS } from './user.constant';
// import { IUserModel, TUser } from './user.interface';

// // Define the user schema
// const userSchema = new Schema<TUser, IUserModel>(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: Object.keys(USER_ROLE),
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       match: [
//         /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
//         'Please fill a valid email address',
//       ],
//     },
//     password: {
//       type: String,
//       required: true,
//       select: 0,
//     },
//     status: {
//       type: String,
//       enum: Object.keys(USER_STATUS),
//       default: USER_STATUS.ACTIVE,
//     },
//     passwordChangedAt: {
//       type: Date,
//     },
//     mobileNumber: {
//       type: String,
//       required: true,
//     },
//     profilePhoto: {
//       type: String,
//       default: null,
//     },
//     bio: {
//       type: String,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     premiumStatus: {
//       type: Boolean,
//       default: false,
//     },
//     // Initialize followers and following as empty arrays
//     followers: {
//       type: [Schema.Types.ObjectId],
//       ref: 'User',
//       default: [], // Ensure it's initialized as an empty array
//     },
//     following: {
//       type: [Schema.Types.ObjectId],
//       ref: 'User',
//       default: [], // Ensure it's initialized as an empty array
//     },
//     posts: {
//       type: [Schema.Types.ObjectId],
//       ref: 'Post',
//     },
//     favorites: {
//       type: [Schema.Types.ObjectId],
//       ref: 'Post',
//     },
//   },
//   {
//     timestamps: true,
//     virtuals: true,
//   }
// );

// // Pre-save hook to hash password
// userSchema.pre('save', async function (next) {
//   const user = this; // Document reference
//   if (!user.isModified('password')) return next(); // Only hash if password is modified

//   // Hash the password and save it to the database
//   user.password = await bcryptjs.hash(
//     user.password,
//     Number(config.bcrypt_salt_rounds)
//   );

//   next();
// });

// // Post-save hook to remove password from the document
// userSchema.post('save', function (doc, next) {
//   doc.password = ''; // Clear password after saving
//   next();
// });

// // Static method to check if user exists by email
// userSchema.statics.isUserExistsByEmail = async function (email: string) {
//   return await User.findOne({ email }).select('+password');
// };

// // Static method to compare passwords
// userSchema.statics.isPasswordMatched = async function (
//   plainTextPassword,
//   hashedPassword
// ) {
//   return await bcryptjs.compare(plainTextPassword, hashedPassword);
// };

// // Method to follow another user
// userSchema.methods.follow = async function (userIdToFollow) {
//   const isAlreadyFollowing = this.following.includes(userIdToFollow);

//   if (!isAlreadyFollowing) {
//     this.following.push(userIdToFollow);
//     await this.save();

//     // Also add this user to the followers of the user being followed
//     const userToFollow = await User.findById(userIdToFollow);
//     if (userToFollow) {
//       userToFollow.followers.push(this._id);
//       await userToFollow.save();
//     }

//     return { message: 'Successfully followed the user.' };
//   } else {
//     return { message: 'You are already following this user.' };
//   }
// };

// // Method to unfollow a user
// userSchema.methods.unfollow = async function (userIdToUnfollow) {
//   const isFollowing = this.following.includes(userIdToUnfollow);

//   if (isFollowing) {
//     this.following.pull(userIdToUnfollow);
//     await this.save();

//     // Also remove this user from the followers of the user being unfollowed
//     const userToUnfollow = await User.findById(userIdToUnfollow);
//     if (userToUnfollow) {
//       userToUnfollow.followers = userToUnfollow.followers || []; // Ensure followers is initialized
//       userToUnfollow.followers.pull(this._id);
//       await userToUnfollow.save();
//     }

//     return { message: 'Successfully unfollowed the user.' };
//   } else {
//     return { message: 'You are not following this user.' };
//   }
// };

// // Create and export the User model
// export const User = model<TUser, IUserModel>('User', userSchema);

// /* eslint-disable no-useless-escape */
// import bcryptjs from 'bcryptjs';
// import { Schema, model } from 'mongoose';
// import config from '../../config';
// import { USER_ROLE, USER_STATUS } from './user.constant';
// import { IUserModel, TUser } from './user.interface';

// const userSchema = new Schema<TUser, IUserModel>(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: Object.keys(USER_ROLE),
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       //validate email
//       match: [
//         /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
//         'Please fill a valid email address',
//       ],
//     },
//     password: {
//       type: String,
//       required: true,
//       select: 0,
//     },
//     status: {
//       type: String,
//       enum: Object.keys(USER_STATUS),
//       default: USER_STATUS.ACTIVE,
//     },
//     passwordChangedAt: {
//       type: Date,
//     },
//     mobileNumber: {
//       type: String,
//       required: true,
//     },
//     profilePhoto: {
//       type: String,
//       default: null,
//     },
//     bio: {
//       type: String,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     premiumStatus: {
//       type: Boolean,
//       default: false,
//     },
//     followers: {
//       type: [Schema.Types.ObjectId],
//       ref: 'User',
//     },
//     following: {
//       type: [Schema.Types.ObjectId],
//       ref: 'User',
//     },
//     posts: {
//       type: [Schema.Types.ObjectId],
//       ref: 'Post',
//     },
//     favorites: {
//       type: [Schema.Types.ObjectId],
//       ref: 'Post',
//     },
//   },
//   {
//     timestamps: true,
//     virtuals: true,
//   }
// );

// userSchema.pre('save', async function (next) {
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const user = this; // doc
//   // hashing password and save into DB

//   user.password = await bcryptjs.hash(
//     user.password,
//     Number(config.bcrypt_salt_rounds)
//   );

//   next();
// });

// // set '' after saving password
// userSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

// userSchema.statics.isUserExistsByEmail = async function (email: string) {
//   return await User.findOne({ email }).select('+password');
// };

// userSchema.statics.isPasswordMatched = async function (
//   plainTextPassword,
//   hashedPassword
// ) {
//   return await bcryptjs.compare(plainTextPassword, hashedPassword);
// };

// userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
//   passwordChangedTimestamp: number,
//   jwtIssuedTimestamp: number
// ) {
//   const passwordChangedTime =
//     new Date(passwordChangedTimestamp).getTime() / 1000;
//   return passwordChangedTime > jwtIssuedTimestamp;
// };

// export const User = model<TUser, IUserModel>('User', userSchema);
/* eslint-disable no-useless-escape */
import bcryptjs from 'bcryptjs';
import  { Schema, model } from 'mongoose';
import config from '../../config';
import { USER_ROLE, USER_STATUS } from './user.constant';
import { IUserModel, TUser } from './user.interface';

const userSchema = new Schema<TUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      required: true,
    },
    email: {
      type: String,
      required: true,
      //validate email
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    status: {
      type: String,
      enum: Object.keys(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    passwordChangedAt: {
      type: Date,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    premiumStatus: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    posts: {
      type: [Schema.Types.ObjectId],
      ref: 'Post',
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: 'Post',
    },

  },
  {
    timestamps: true,
    virtuals: true,
  }
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  user.password = await bcryptjs.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, IUserModel>('User', userSchema);
