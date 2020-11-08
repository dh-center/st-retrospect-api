import { UserDBScheme } from '../resolvers/users';
import jwt from 'jsonwebtoken';

/**
 * Generates token for user to access API
 *
 * @param user - user to generate token for
 */
export function getUserToken(user: UserDBScheme): string {
  return jwt.sign({
    id: user._id,
    isAdmin: user.isAdmin,
  }, process.env.JWT_SECRET_STRING || 'secret_string');
}
