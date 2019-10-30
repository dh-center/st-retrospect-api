const axios = require('axios');
const mime = require('mime-types');
const fs = require('fs')

function writeFile(filename, fileContent) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, fileContent, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = async function (filename, url) {
  if (!url || /.html$/.test(url)) {
    return;
  }

  try {
    const response = await axios({
      url: encodeURI(url),
      method: 'GET',
      responseType: 'arraybuffer' // important
    });

    const extension = mime.extension(response.headers['content-type']);

    if (!extension) {
      // console.log(location._id, location.mainPhotoLink, response.headers['content-type']);
      return;
    }
    if (extension === 'html') {
      // console.log('html', location._id, location.mainPhotoLink);
      return;
    }
    // console.log(Buffer.from(response.data))
    const filenameWithExt = `${filename}.${extension}`;
    console.log(filenameWithExt)
    await writeFile(filenameWithExt, Buffer.from(response.data));
    return filenameWithExt;
  } catch (e) {
    /*
     * console.log(location._id, location.mainPhotoLink);
     * console.log(e)
     */
    throw e;
  }
}
