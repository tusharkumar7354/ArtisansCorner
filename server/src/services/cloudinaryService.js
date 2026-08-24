// const cloudinary = require("../config/cloudinary");
// const streamifier = require("streamifier");

// const uploadImage = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: "ArtisansCorner"
//       },
//       (error, result) => {
//         if (error) {
//           return reject(error);
//         }

//         resolve({
//           public_id: result.public_id,
//           url: result.secure_url
//         });
//       }
//     );

//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// const deleteImage = async (publicId) => {
//   if (!publicId) {
//     return;
//   }

//   await cloudinary.uploader.destroy(publicId);
// };

// const deleteImages = async (images = []) => {
//   const publicIds = images
//     .map((image) => image?.public_id)
//     .filter(Boolean);

//   if (!publicIds.length) {
//     return;
//   }

//   await Promise.all(
//     publicIds.map((publicId) => deleteImage(publicId))
//   );
// };

// module.exports = {
//   uploadImage,
//   deleteImage,
//   deleteImages
// };


const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ArtisansCorner"
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(
      publicId
    );

    console.log(
      `Cloudinary delete: ${publicId}`,
      result
    );

    return result;
  } catch (error) {
    console.error(
      `Cloudinary delete failed: ${publicId}`,
      error
    );

    throw error;
  }
};

const deleteImages = async (images = []) => {
  const publicIds = images
    .map((image) => image?.public_id)
    .filter(Boolean);

  if (!publicIds.length) {
    console.log("No Cloudinary images to delete.");
    return;
  }

  for (const publicId of publicIds) {
    await deleteImage(publicId);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  deleteImages
};