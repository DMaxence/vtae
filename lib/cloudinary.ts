// lib/cloudinary.js

// Import the v2 api and rename it to cloudinary
import { v2 as cloudinary, TransformationOptions } from "cloudinary";

// Initialize the sdk with cloud_name, api_key and api_secret
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER_NAME = "vtae/";

/**
 * Gets a resource from cloudinary using its public id
 *
 * @param {string} publicId The public id of the image
 */
export const handleGetCloudinaryResource = (publicId: string) => {
  return cloudinary.api.resource(publicId, {
    resource_type: "image",
    type: "upload",
  });
};

/**
 * Get cloudinary uploads
 * @returns {Promise}
 */
export const handleGetCloudinaryUploads = () => {
  return cloudinary.api.resources({
    type: "upload",
    prefix: CLOUDINARY_FOLDER_NAME,
    resource_type: "image",
  });
};

/**
 * Uploads an image to cloudinary and returns the upload result
 *
 * @param {{path: string; transformation?:TransformationOptions;publicId?: string; folder?: boolean; }} resource
 */
export const handleCloudinaryUpload = (resource: {
  path: string;
  name?: string;
  transformation?: TransformationOptions;
  publicId?: string;
  folder?: string;
}) => {
  return cloudinary.uploader.upload(resource.path, {
    use_filename: true,
    overwrite: true,
    unique_filename: false,
    invalidate: true,
    filename_override: resource.name,
    // Folder to store image in
    folder: resource?.folder
      ? `${CLOUDINARY_FOLDER_NAME}/${resource.folder}`
      : CLOUDINARY_FOLDER_NAME,
    // Public id of image.
    public_id: resource.publicId,
    // Type of resource
    resource_type: "auto",
    // Transformation to apply to the video
    transformation: resource.transformation,
  });
};

/**
 * Deletes resources from cloudinary. Takes in an array of public ids
 * @param {string[]} ids
 */
export const handleCloudinaryDelete = (ids: string[]) => {
  return cloudinary.api.delete_resources(ids, {
    resource_type: "image",
  });
};
