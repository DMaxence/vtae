import { withAuth } from "@/lib/auth";
import { handleCloudinaryUpload } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { revalidateSite } from "@/lib/utils";
import { Media } from "@prisma/client";

export const POST = withAuth(async ({ req, params }) => {
  const body = await req.json();
  const {
    medias,
    mediasToRemove,
  }: { medias: (Media & { image: string })[]; mediasToRemove: string[] } = body;
  const { siteId } = params;

  const images = medias.filter((m) => m.type === "IMAGE" && m.image);
  const uploadResponse = await Promise.all(
    images.map((media) =>
      handleCloudinaryUpload({
        path: media.image,
        folder: "projects",
      }),
    ),
  );

  try {
    const response = await prisma.site.update({
      where: {
        id: siteId,
      },
      data: {
        iconsList: {
          create: [
            ...uploadResponse.map((media) => ({
              type: "IMAGE",
              url: media.secure_url,
            })),
          ],
          disconnect: mediasToRemove.map((id) => ({ id })),
        },
      },
    });

    await revalidateSite(response);
    console.log("uploadResponse", response);

    return Response.json(response);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
