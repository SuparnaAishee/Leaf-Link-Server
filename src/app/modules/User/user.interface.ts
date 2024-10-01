/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE, USER_STATUS } from './user.constant';

export type TUser = {
  _id?: string;
  name: string;
  role: keyof typeof USER_ROLE;
  email: string;
  password: string;
  status: keyof typeof USER_STATUS;
  passwordChangedAt?: Date;
  mobileNumber?: string;
  profilePhoto?: string;
  bio?: string; 
  isVerified: boolean; 
  premiumStatus: boolean; 
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[]; 
  posts?: Types.ObjectId[];
  favorites?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
