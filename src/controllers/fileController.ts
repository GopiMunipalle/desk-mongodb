import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";


const uploadImages = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  return Promise.all(
    files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const stream_to_cloud_pipe = cloudinary.uploader.upload_stream(
          { folder: "desk-mongo" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(new Error("Upload result is undefined"));
              }
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream_to_cloud_pipe);
      });
    })
  );
};

export default uploadImages;