const axios = require('axios');
const mime = require('mime-types');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

let requestsCount = 0;
async function saveImage(filename, url) {
  if (!url || /.html$/.test(url)) {
    return;
  }

  const response = await axios({
    url: encodeURI(url),
    method: 'GET',
    responseType: 'arraybuffer' // important
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
  // await writeFile(filenameWithExt;

  await s3.putObject({
    Bucket: 'st-retrospect-images',
    Body: Buffer.from(response.data),
    Key: 'locations/' + filenameWithExt
  }).promise();

  return 'locations/' + filenameWithExt;
}


/**
 * Asynchronous forEach function
 * @param {Array} array - array to iterate
 * @param {function} callback - callback for processing array items
 * @return {Promise<void>}
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
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
          const filename = await saveImage(`location-${i}-main`, location.mainPhotoLink);

          await db.collection('locations').updateOne(
            {_id: location._id},
            {
              $set: {
                mainPhotoLink: generateImageLink(filename)
              }
            }
          )
        } catch (e) {
          console.log('main', location._id, location.mainPhotoLink)
          // console.log('SAVE ERROR for location with id ', location._id);
          // console.log(location.mainPhotoLink);
          // console.log(e);
        }
      }

      if (location.photoLinks) {
        const newLinks = [];

         if (!location.photoLinks.split) {
           return;
         }

        await Promise.all(location.photoLinks.split('\n').map(async (link, index) => {
          if (!link.startsWith(process.env.IMAGE_HOSTING_ENDPOINT)) {
            try {
              const filename = await saveImage(`location-${i}-${index}`, link);
              newLinks.push(generateImageLink(filename));
            } catch (e) {
              console.log(location._id, location.photoLinks[index])
              // console.log('SAVE ERROR for location with id ', location._id);
              // console.log(link);
            }
          } else {
            newLinks.push(link);
          }

        }));

        await db.collection('locations').updateOne(
          {_id: location._id},
          {
            $set: {
              photoLinks: newLinks
            }
          }
        )
      }
      // console.log(`Finish processing ${i} location with id ${location._id}`);
    });
  },

  async down(db) {
    const locations = await db.collection('locations').find({}).toArray();
    await asyncForEach(locations,async location => {
      await db.collection('locations').updateOne(
        {_id: location._id},
        {
          $set: {
            photoLinks: location.photoLinks.join('\n')
          }
        }
      );
    })
  }
};

