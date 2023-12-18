// pages/api/images/[id].js

import { NextApiRequest, NextApiResponse } from "next";
import { handleCloudinaryDelete } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

/**
 * The handler function for the API route. Takes in an incoming request and outgoing response.
 *
 * @param {NextApiRequest} req The incoming request object
 * @param {NextApiResponse} res The outgoing response object
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!params.id) {
      throw new Error("No ID provided");
    }

    const result = await handleDeleteRequest(params.id);

    return NextResponse.json({ message: "Success", result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 400 });
  }
}

/**
 * Handles the DELETE request to the API route.
 *
 * @param {string} id Public ID of the image to delete
 */
const handleDeleteRequest = (id: string) => {
  // Delete the uploaded image from Cloudinary
  return handleCloudinaryDelete([id.replace(":", "/")]);
};
