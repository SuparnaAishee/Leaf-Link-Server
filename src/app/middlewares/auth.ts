import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { catchAsync } from '../utils/catchAsync';
import { USER_ROLE } from '../modules/User/user.constant';
import { verifyToken } from '../utils/verifyJWT';
import { User } from '../modules/User/user.model';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token correctly

    // Checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded: JwtPayload;

    try {
      decoded = verifyToken(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
    }

    const { role, email } = decoded; // Extract iat for JWT expiration checks

    // Checking if the user exists
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    // Checking if the user is blocked
    if (user.status === 'BLOCKED') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }

    // Uncomment if you want to check for password changes
    /*
    if (user.passwordChangedAt && 
        User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    */

    // Checking user roles
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded; // Attach the decoded user info to the request
    console.log('Token received:', token);
    console.log('Decoded token:', decoded);
    console.log('User found:', user);

    
    next();
  });
};

export default auth;

// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import { catchAsync } from '../utils/catchAsync';
// import { USER_ROLE } from '../modules/User/user.constant';
// import { verifyToken } from '../utils/verifyJWT';
// import { User } from '../modules/User/user.model';

// const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;

//     // checking if the token is missing
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//     }

//     const decoded = verifyToken(
//       token,
//       config.jwt_access_secret as string
//     ) as JwtPayload;

//     const { role, email, iat } = decoded;

//     // checking if the user is exist
//     const user = await User.isUserExistsByEmail(email);
// console.log(user)
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//     }
//     // checking if the user is already deleted

//     const status = user?.status;

//     if (status === 'BLOCKED') {
//       throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
//     }

//     if (
//       user.passwordChangedAt &&
//       User.isJWTIssuedBeforePasswordChanged(
//         user.passwordChangedAt,
//         iat as number
//       )
//     ) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
//     }

//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }

//     req.user = decoded as JwtPayload;
//     next();
//   });
// };

// export default auth;
