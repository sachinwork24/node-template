import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserRole } from '../types/auth.types';
import { ApiError } from './error.middleware';
import Customer from '../models/Users/customer.model';
import Admin from '../models/Users/admin.model';
import Driver from '../models/Users/driver.model';
import { ROLE_HIERARCHY } from '../config/roles.config';

import * as dotenv from 'dotenv';
dotenv.config();

//rate limiting
// export const authRateLimiter = rateLimit({
//   windowMs: 10 * 1000, //10 seconds
//   max: 100,
//   message: 'Too many authentication attempts, please try again late',
// });

export class AuthMiddleware {
  private static readonly secretKey = process.env.PICKUP_JWT_SECRET;

  private static async findUserByRole(
    role: string,
    email?: string,
    phoneNumber?: string
  ) {
    switch (role) {
      case UserRole.CLIENT:
        return await Customer.findOne({ phoneNumber });
      case UserRole.ADMIN:
      case UserRole.L_HEAD:
      case UserRole.COORDINATOR:
        return await Admin.findOne({ email });
      case UserRole.AGENT:
        return await Driver.findOne({ phoneNumber });
      default:
        return null;
    }
  }

  static authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!AuthMiddleware.secretKey) {
        throw new ApiError(500, 'JWT Secret Key Not Set');
      }
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new ApiError(401, 'Access Denied. No Token Provided', true);
      }
      const decodedData = jwt.verify(token, AuthMiddleware.secretKey) as {
        role: string;
        email?: string;
        phoneNumber?: string;
      };
      if (
        !decodedData ||
        !decodedData.role ||
        !(decodedData.email || decodedData.phoneNumber)
      ) {
        throw new ApiError(401, 'Invalid Token Format', true);
      }

      const user = await AuthMiddleware.findUserByRole(
        decodedData.role,
        decodedData.email,
        decodedData.phoneNumber
      );
      if (!user || !user.isActive) {
        throw new ApiError(403, 'Access Denied, No Active User', true);
      }

      req.user = user;
      next();
    } catch (err) {
      if (err instanceof ApiError) {
        next(err);
      } else if (err instanceof jwt.JsonWebTokenError) {
        next(new ApiError(401, 'Token Verification Failed', true));
      } else {
        next(new ApiError(500, 'Authentication Error'));
      }
    }
  };

  static authorize = (allowedRole: UserRole[]) => {
    return async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user?.role) {
          throw new ApiError(403, 'User Role Not found');
        }

        const userRole = req.user.role as UserRole;
        const hasPermission = allowedRole.some((role) =>
          ROLE_HIERARCHY[role]?.includes(userRole)
        );

        if (!hasPermission) {
          throw new ApiError(403, 'Insufficient permission for this action');
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  };

  static adminAuth = AuthMiddleware.authorize([
    UserRole.ADMIN,
    UserRole.L_HEAD,
    UserRole.COORDINATOR,
  ]);

  static superAdminAuth = AuthMiddleware.authorize([UserRole.ADMIN]);
}
