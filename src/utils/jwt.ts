import { UserDBScheme } from '../resolvers/users';
import jwt from 'jsonwebtoken';

/**
 * Auth token pair
 */
interface TokenPair {
  /**
   * Access token for accessing to resources
   */
  accessToken: string;

  /**
   * Refresh token for updating token pair
   */
  refreshToken: string;
}

/**
 * Access token payload
 */
export interface AccessTokenPayload {
  /**
   * Id of the user to whom the token is issued
   */
  userId: string;

  /**
   * User permissions
   */
  permissions: string[]
}

/**
 * Data about occurred error while verifying access token
 */
export interface AccessTokenError {
  /**
   * Name of the occurred error
   */
  errorName: string;
}

/**
 * Refresh token payload
 */
export interface RefreshTokenPayload {
  /**
   * Id of the user to whom the token is issued
   */
  userId: string;
}


/**
 *
 */
class JwtHelper {
  /**
   * Secret for signing access tokens
   */
  private readonly accessTokenSecret: string;

  /**
   * Secret for signing refresh tokens
   */
  private readonly refreshTokenSecret: string;

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
    const accessTokenPayload: AccessTokenPayload = {
      permissions: user.permissions || [],
      userId: user._id.toString(),
    };

    const refreshTokenData: RefreshTokenPayload = {
      userId: user._id.toString(),
    };

    return {
      accessToken:
        jwt.sign(
          accessTokenPayload,
          this.accessTokenSecret,
          {
            expiresIn: '10m',
          }
        ),
      refreshToken:
        jwt.sign(
          refreshTokenData,
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
  public verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
    const data = jwt.verify(refreshToken, this.refreshTokenSecret);

    if (typeof data === 'string') {
      throw new Error('Refresh token payload can\'t be string');
    }

    return data as RefreshTokenPayload;
  }

  /**
   * Verifies access token and returns its data
   *
   * @param accessToken - token to parse and verify
   */
  public verifyAccessToken(accessToken: string): AccessTokenPayload {
    const data = jwt.verify(accessToken, this.accessTokenSecret);

    if (typeof data === 'string') {
      throw new Error('Access token payload can\'t be string');
    }

    return data as AccessTokenPayload;
  }

  /**
   * Parses authorization header and returns user data from it
   *
   * @param authorizationHeader - header to parse
   */
  public getDataFromHeader(authorizationHeader: string | null | undefined): AccessTokenPayload | AccessTokenError | null {
    if (authorizationHeader) {
      if (/^Bearer [a-z0-9-_+/=]+\.[a-z0-9-_+/=]+\.[a-z0-9-_+/=]+$/i.test(authorizationHeader)) {
        const jsonToken = authorizationHeader.slice(7);

        try {
          return this.verifyAccessToken(jsonToken);
        } catch(e) {
          return {
            errorName: e.name,
          };
        }
      }
    }

    return null;
  }
}


const jwtHelper = new JwtHelper();

export default jwtHelper;
