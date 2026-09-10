const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'durhxlcnt',
  api_key: process.env.CLOUDINARY_API_KEY || '465439466783197',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'nimT_zfMX6WfPGwxliN6-dofJPo',
});

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer The file buffer to upload
 * @param {Object} options Cloudinary upload options (e.g. folder, resource_type)
 * @returns {Promise<Object>} The Cloudinary upload result
 */
const uploadBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    stream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadBuffer,
};
