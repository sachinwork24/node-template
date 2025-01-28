import { Request } from 'express';
// import { ICustomer } from './models/Users/customer.model';
// import { IAdmin } from './models/Users/admin.model';
// import { IDriver } from './models/Users/driver.model';

export enum UserRole {
  ADMIN = 'superAdmin',
  L_HEAD = 'locationHead',
  COORDINATOR = 'coordinator',
  AGENT = 'agent',
  CLIENT = 'client',
}
//TODO change this to suit the app usage
// export interface IRequestQuery {
//   tab: 'all' | 'current' | 'upcoming' | 'completed' | 'cancelled' | 'returned';
//   page?: string;
//   limit?: string;
//   startDate?: String;
//   endDate?: String;
// }
// export interface AuthenticatedRequest<
//   P = any,
//   ResBody = any,
//   ReqBody = any,
//   ReqQuery = IRequestQuery,
//   Locals extends Record<string, any> = Record<string, any>,
// > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
//   adminPermissions?: string[];
//   user?: ICustomer | IAdmin | IDriver;
// }
