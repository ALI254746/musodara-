//api/logout//route.js
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/login", process.env.a));

  response.headers.set(
    "Set-Cookie",
    `token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
  );

  return response;
}
