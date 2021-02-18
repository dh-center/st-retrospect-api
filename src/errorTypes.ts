/**
 * Base class for API errors
 */
export class ApiError extends Error {
  /**
   * Http code to send to user
   */
  public httpCode: number;

  /**
   * Text error code
   */
  public code = '';

  /**
   * Creates error instance
   *
   * @param {number} httpCode - http code to send to user
   */
  constructor(httpCode: number) {
    super();
    this.httpCode = httpCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Throws when trying to log in with the wrong username
 */
export class NoUserWithSuchUsernameError extends ApiError {
  /**
   * Creates error instance
   *
   * @param {number} [httpCode=401] - http code to send to user
   */
  constructor(httpCode = 401) {
    super(httpCode);
    this.code = 'NO_USER_WITH_SUCH_USERNAME';
  }
}

/**
 * Throws when trying to log in with the wrong password
 */
export class WrongUserPasswordError extends ApiError {
  /**
   * Creates error instance
   *
   * @param {number} [httpCode=401] - http code to send to user
   */
  constructor(httpCode = 401) {
    super(httpCode);
    this.code = 'WRONG_USER_PASSWORD';
  }
}

/**
 * Throws when trying to register with already registered username
 */
export class UsernameDuplicationError extends ApiError {
  /**
   * Creates error instance
   *
   * @param {number} [httpCode=409] - http code to send to user
   */
  constructor(httpCode = 409) {
    super(httpCode);
    this.code = 'USERNAME_DUPLICATION';
  }
}

/**
 * Throws when client sends auth data in wrong format
 */
export class WrongAuthData extends ApiError {
  /**
   * Creates error instance
   *
   * @param httpCode - http code to send to user
   */
  constructor(httpCode = 400) {
    super(httpCode);
    this.code = 'WRONG_AUTH_DATA';
  }
}

/**
 * Issued when a client tries to perform actions that he can't
 */
export class ForbiddenAction extends ApiError {
  /**
   * Creates error instance
   *
   * @param httpCode - http code to send to user
   */
  constructor(httpCode = 403) {
    super(httpCode);
    this.code = 'FORBIDDEN';
  }
}

/**
 * Throws when client sends invalid access token
 */
export class InvalidAccessToken extends ApiError {
  /**
   * Text error code
   */
  public code = 'INVALID_ACCESS_TOKEN';

  /**
   * Error message (short description)
   */
  public message = 'Invalid access token';

  /**
   * Creates error instance
   *
   * @param httpCode - http code to send to user
   */
  constructor(httpCode = 400) {
    super(httpCode);
  }
}
