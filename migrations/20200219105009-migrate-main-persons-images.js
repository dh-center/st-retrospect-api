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
    Key: 'persons/' + filenameWithExt
  }).promise();

  return 'persons/' + filenameWithExt;
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

    const persons = await db.collection('persons').find({}).toArray();

    await asyncForEach(persons, async person => {
      i++;
      // console.log(`Start processing ${i} person with id ${person._id}`);

      if (person.mainPhotoLink && !person.mainPhotoLink.startsWith(process.env.IMAGE_HOSTING_ENDPOINT)) {
        try {
          const filename = await saveImage(
            `person-${i}-main${(new Date()).getTime().toString()}`,
            person.mainPhotoLink
          );

          await db.collection('persons').updateOne(
            {_id: person._id},
            {
              $set: {
                mainPhotoLink: generateImageLink(filename)
              }
            }
          );
          uploadedImagesCount++;
          console.log(`SUCCESS, ${person._id}, ${person.mainPhotoLink}`);
        } catch (e) {
          console.log(`FAIL, ${person._id}, ${person.mainPhotoLink}`);
          // console.log('SAVE ERROR for person with id ', person._id);
          // console.log(person.mainPhotoLink);
          // console.log(e);
          failedImagesCount++;
        }
      }

      // console.log(`Finish processing ${i} person with id ${person._id}`);
    });

    console.log(`Finish processing. ${uploadedImagesCount} images uploaded and ${failedImagesCount} failed`)
  },

  async down(db) {
    console.log('Nothing to do');
  }
};

