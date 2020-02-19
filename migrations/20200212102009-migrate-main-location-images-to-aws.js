const axios = require('axios');
const mime = require('mime-types');
const AWS = require('aws-sdk');
const asyncForEach = require('./utils/asyncForEach');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

let requestsCount = 0;
let uploadedImagesCount = 0;
let failedImagesCount = 0;

async function saveImage(filename, url) {
  if (!url || /.html$/.test(url)) {
    return;
  }

  const response = await axios({
    url: encodeURI(url),
    method: 'GET',
    responseType: 'arraybuffer'
  });
  requestsCount++;

  // console.log(requestsCount, response.status);

  const extension = mime.extension(response.headers['content-type']);

  if (!extension) {
    throw new Error('No extension in response content-type header');
  }

  if (extension === 'html') {
    throw new Error('HTML is not image');
  }

  const filenameWithExt = `${filename}.${extension}`;

  await s3.putObject({
    Bucket: 'st-retrospect-images',
    Body: Buffer.from(response.data),
    Key: 'locations/' + filenameWithExt
  }).promise();

  return 'locations/' + filenameWithExt;
}

function generateImageLink(key) {
  const requestForImage = {
    bucket: 'st-retrospect-images',
    key: key
  };

  return process.env.IMAGE_HOSTING_ENDPOINT + Buffer.from(JSON.stringify(requestForImage)).toString('base64');
}

module.exports = {
  async up(db) {
    let i = 0;

    const locations = await db.collection('locations').find({}).toArray();

    await asyncForEach(locations, async location => {
      i++;
      // console.log(`Start processing ${i} location with id ${location._id}`);

      if (location.mainPhotoLink && !location.mainPhotoLink.startsWith(process.env.IMAGE_HOSTING_ENDPOINT)) {
        try {
          const filename = await saveImage(
            `location-${i}-main${(new Date()).getTime().toString()}`,
            location.mainPhotoLink
          );

          await db.collection('locations').updateOne(
            {_id: location._id},
            {
              $set: {
                mainPhotoLink: generateImageLink(filename)
              }
            }
          );
          uploadedImagesCount++;
          console.log(`SUCCESS, ${location._id}, ${location.mainPhotoLink}`);
        } catch (e) {
          console.log(`FAIL, ${location._id}, ${location.mainPhotoLink}`);
          // console.log('SAVE ERROR for location with id ', location._id);
          // console.log(location.mainPhotoLink);
          // console.log(e);
          failedImagesCount++;
        }
      }

      // console.log(`Finish processing ${i} location with id ${location._id}`);
    });

    console.log(`Finish processing. ${uploadedImagesCount} images uploaded and ${failedImagesCount} failed`)
  },

  async down(db) {
    console.log('Nothing to do');
  }
};

