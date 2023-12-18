// pages/api/images/index.js

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { takeWebsiteScreenshot } from "@/lib/actions";
import { handleGetCloudinaryUploads } from "@/lib/cloudinary";
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

    return NextResponse.json({ message: "Success", result }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 400 });
  }
}

const handleGetRequest = async () => {
  const uploads = await handleGetCloudinaryUploads();

  return uploads;
};
