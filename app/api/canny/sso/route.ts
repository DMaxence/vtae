import jwt from "jsonwebtoken";

import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const PrivateKey = process.env.CANNY_PRIVATE_KEY;

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Not authenticated", {
      status: 401,
    });
  }

  var userData = {
    avatarURL: session.user.image, // optional, but preferred
    email: session.user?.email,
    id: session.user.id,
    name: session.user.name,
  };

  return NextResponse.json({
    ssoToken: jwt.sign(userData, PrivateKey as string, { algorithm: "HS256" }),
  });
}
