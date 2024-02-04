import { withAuth } from "@/lib/auth";
import { getProject } from "@/lib/builder/project";
import { handleCloudinaryUpload } from "@/lib/cloudinary";
import { revalidateSite } from "@/lib/utils";
import { Media, Site } from "@prisma/client";

import prisma from "@/lib/prisma";

import { NextRequest } from "next/server";

export const POST = withAuth(async ({ req, params }) => {
  const body: (Media & { image: string })[] = await req.json();
  const { projectId } = params;
  
  const images = body.filter((m) => m.type === "IMAGE" && m.image);
  console.log("images", images);
  const uploadResponse = await Promise.all(
    images.map((media) =>
      handleCloudinaryUpload({
        path: media.image,
        folder: "projects",
      }),
    ),
  );

  const videos = body.filter((m) => m.type === "VIDEO" && m.image);
  console.log("uploadResponse", uploadResponse);

  try {
    const response = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        medias: {
          create: [
            ...uploadResponse.map((media) => ({
              type: "IMAGE",
              url: media.secure_url,
            })),
            ...videos.map((video) => ({
              type: "VIDEO",
              url: video.image,
            })),
          ],
        },
      },
      include: {
        site: {
          select: { subdomain: true, customDomain: true },
        },
      },
    });

    await revalidateSite(response.site as Site);
    console.log("uploadResponse", response);

    return Response.json(response);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
