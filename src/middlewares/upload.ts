import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { Router, Request, Response } from 'express';

const router = Router();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

/**
 * Allow only JPEG and PNG images
 *
 * @param {Request} req - Express request for processing
 * @param {object} file - file info to upload
 * @param {Function} cb - callback function
 */
// eslint-disable-next-line no-undef
function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'));
  }
}

/**
 * Get Multer middleware for image uploading in certain directory
 *
 * @param {string} folder - folder in S3 bucket to store in
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUploadMiddleware(folder: string): multer.Multer {
  return multer({
    fileFilter,
    storage: multerS3({
      s3,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      bucket: 'st-retrospect-images',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const key = folder + '/' + uuid() + path.extname(file.originalname);

        cb(null, key);
      },
    }),
  });
}

/**
 * Returns array of uploaded images
 *
 * @param {Request} req - Express request for processing
 * @param {Response} res - file info to upload
 */
function filesProcessMiddleware(req: Request, res: Response): void {
  const requestForImage = {
    bucket: 'st-retrospect-images',
    // eslint-disable-next-line no-undef
    key: (req.file as Express.MulterS3.File).key,
  };

  res.json({
    success: 1,
    file: {
      url: process.env.IMAGE_HOSTING_ENDPOINT + Buffer.from(JSON.stringify(requestForImage)).toString('base64'),
    },
  });
}

/**
 * Upload user images
 */
router.post('/upload/user', getUploadMiddleware('users').single('image'), filesProcessMiddleware);

/**
 * Upload persons images
 */
router.post('/upload/person', getUploadMiddleware('persons').single('image'), filesProcessMiddleware);

/**
 * Upload locations images
 */
router.post('/upload/location', getUploadMiddleware('locations').single('image'), filesProcessMiddleware);

/**
 * Upload images for routes
 */
router.post('/upload/route', getUploadMiddleware('routes').single('image'), filesProcessMiddleware);

/**
 * Upload images for quest data
 */
router.post('/upload/quest/data', getUploadMiddleware('quests/data').single('image'), filesProcessMiddleware);

export default router;
