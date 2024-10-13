 import { JwtPayload } from 'jsonwebtoken';
// import { QueryBuilder } from '../../builder/QueryBuilder';
// import { UserSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

// const getAllUsersFromDB = async (
//   query: Record<string, unknown>,
//   user: JwtPayload
// ) => {
//   const users = new QueryBuilder(User.find({ _id: { $ne: user?._id } }), query)
//     .fields()
//     .paginate()
//     .sort()
//     .filter()
//     .search(UserSearchableFields);

//   const result = await users.modelQuery;

//   return result;
// };
// const getAllUsersFromDB = async (
//   query: Record<string, unknown>,
//   user: JwtPayload // Ensure this has _id
// ) => {
//   if (!user?._id) {
//     throw new Error("User ID is undefined");
//   }

//   const users = new QueryBuilder(User.find({ _id: { $ne: user._id } }), query)
//     .fields()
//     .paginate()
//     .sort()
//     .filter()
//     .search(UserSearchableFields);

//   const result = await users.modelQuery;
//   return result;
// };
export const getAllUsersFromDB = async (
  query: Record<string, unknown>, // Holds search term and pagination details
  user: JwtPayload // Current user, used to exclude the user themselves from results
) => {
  const { searchTerm, page = 1, limit = 10 } = query; // Destructure query object for searchTerm, pagination

  // Initialize search filter to exclude the current user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
  let searchFilter: any = {
    _id: { $ne: user?._id }, // Exclude the current user
  };

  // Apply search term if provided
  if (searchTerm && searchTerm !== '') {
    searchFilter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex search for name
      { email: { $regex: searchTerm, $options: 'i' } }, // Search in email field
      { phone: { $regex: searchTerm, $options: 'i' } }, // Search in phone field
      { role: { $regex: searchTerm, $options: 'i' } }, // Search in role field
      { status: { $regex: searchTerm, $options: 'i' } }, // Search in status field
    ];
  }

  // Implement pagination
  const skip = (Number(page) - 1) * Number(limit);
  const perPage = Number(limit);

  try {
    // If searchTerm is not provided, return all users except the current user
    const users = await User.find(
      searchTerm ? searchFilter : { _id: { $ne: user?._id } }
    )
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 }); // Default sort by creation date (newest first)

    // Optionally, you can return the total count of users if needed for pagination
    const totalCount = await User.countDocuments(
      searchTerm ? searchFilter : { _id: { $ne: user?._id } }
    );

    return {
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
};


const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);

  return user;
};
const updateUser = async (
  id: string,
  data: Partial<{ role: 'USER' | 'ADMIN'; status: 'ACTIVE' | 'BLOCKED' }>
) => {
  const profile = await User.findById(id);

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user does not exits!');
  }

  return await User.findByIdAndUpdate(id, data, { new: true });
};
export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUser
};