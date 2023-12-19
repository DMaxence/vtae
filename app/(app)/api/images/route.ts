// pages/api/images/index.js

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { takeWebsiteScreenshot } from "@/lib/actions";
import { handleGetCloudinaryUploads } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getBlurDataURL } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    const result = await handleGetRequest();

    return NextResponse.json({ message: "Success", result }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 400 });
  }
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  console.log(body);
  try {
    const result = await takeWebsiteScreenshot(body);
    const blurhash = await getBlurDataURL(result.url);
    const response = await prisma.site.update({
      where: {
        id: body.siteId,
      },
      data: {
        image: result.secure_url,
        imageBlurhash: blurhash,
      },
    });

    return NextResponse.json(
      { message: "Success", result, response },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 400 });
  }
}

const handleGetRequest = async () => {
  const uploads = await handleGetCloudinaryUploads();

  return uploads;
};
