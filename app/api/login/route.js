import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectMongo();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Is password match?", isMatch);
  if (!isMatch)
    return NextResponse.json({ message: "Wrong password" }, { status: 401 });

  const token = signToken(user); // ✅ bu to‘g‘ri// ✅ bu ham bo‘ladi

  // Yangi response yarataylik
  const response = NextResponse.json({
    message: "Login successful",
    user: { email: user.email, _id: user._id, name: user.name },
  });

  // Tokenni cookie sifatida set qilamiz
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
