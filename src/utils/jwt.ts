import { UserDBScheme } from '../resolvers/users';
import jwt from 'jsonwebtoken';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface UserTokenPayload {
  userId: string;
  permissions: string[]
}

/**
 *
 */
class JwtHelper {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  /**
   * Validates params from environment settings
   */
  constructor() {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error(
        'Both JWT_ACCESS_TOKEN_SECRET and JWT_REFRESH_TOKEN_SECRET are required. Please check it .env file'
      );
    }

    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
  }


  /**
   * Generates token for user to access API
   *
   * @param user - user to generate token for
   */
  public generateUserTokens(user: UserDBScheme): TokenPair {
    return {
      accessToken:
        jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          this.accessTokenSecret,
          {
            expiresIn: '5m',
          }
        ),
      refreshToken:
        jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          this.refreshTokenSecret,
          {
            expiresIn: '30d',
          }),
    };
  }

  /**
   * Verifies refresh token and returns its payload
   *
   * @param refreshToken - refresh token to verify
   */
  public verifyRefreshToken(refreshToken: string): UserTokenPayload {
    const data = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || 'secret_string_1');

    if (typeof data === 'string') {
      throw new Error('Refresh token payload can\'t be string');
    }

    return data as UserTokenPayload;
  }
}


const jwtHelper = new JwtHelper();

export default jwtHelper;
