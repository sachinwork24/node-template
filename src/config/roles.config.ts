import { UserRole } from '../types/auth.types';

export const ROLE_HIERARCHY = {
  [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.L_HEAD, UserRole.COORDINATOR],
  [UserRole.L_HEAD]: [UserRole.L_HEAD, UserRole.COORDINATOR],
  [UserRole.COORDINATOR]: [UserRole.COORDINATOR],
  [UserRole.CLIENT]: [UserRole.CLIENT],
  [UserRole.AGENT]: [UserRole.AGENT],
};
