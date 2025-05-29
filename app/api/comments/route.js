//api/comment/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/comment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Ariza from "@/models/Ariza";
import User from "@/models/User"; // <-- ❗ import qilinmagan edi
export async function GET(req) {
  await dbConnect();

  // Cookie-dan tokenni olish
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let userData;
  try {
    userData = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  const postId = req.nextUrl.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId kerak" }, { status: 400 });
  }

  try {
    // Izohlarni olish va har bir izoh yozuvchining avatar, name maydonlarini join qilish
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("userId", "name avatar"); // userId ni populate qilib, name va avatar olamiz

    // Javobni yuborish
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
export async function POST(req) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let userData;
  try {
    userData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  const body = await req.json();

  const { postId, text } = body;

  if (!postId || !text) {
    return NextResponse.json(
      { error: "postId va text kerak" },
      { status: 400 }
    );
  }
  console.log("postid=", postId);
  console.log("text", text);
  try {
    const comment = await Comment.create({
      userId: userData.id || null,
      postId,
      text,
    });

    // Ariza egasiga notification yuborish
    const ariza = await Ariza.findById(postId);
    if (ariza && ariza.user.toString() !== userData.id) {
      await User.findByIdAndUpdate(ariza.user, {
        $push: {
          notifications: {
            type: "comment",
            message: `${userData.name} sizning arizangizga shuday deb izox qoldirdi:${text}`,
            from: userData.id,
            postId,
            createdAt: new Date(),
            read: false,
          },
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Xatolik:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 400 });
  }
}
