import { ApiError } from '../errorTypes';
import { Request, Response, NextFunction } from 'express';

/**
 * Check error type and send it to the user with right http code and other information
 *
 * @param {Error} error - occurred error
 * @param {Request} req - express request object
 * @param {Response} res - express response object
 * @param {Function} next - next express middleware
 */
export default function (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  if (error instanceof ApiError) {
    return res.status(error.httpCode).json(
      {
        errors: [
          {
            extensions: {
              code: error.code,
            },
          },
        ],
      });
  } else {
    // console.log('Unexpected server error: ', error);
    return res.status(500).json(
      {
        errors: [
          {
            message: 'Unexpected server error: ' + error.toString(),
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          },
        ],
      });
  }
}
