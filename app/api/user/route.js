import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"; // <-- MUHIM
import { getUserById } from "@/lib/userid";
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET - token orqali foydalanuvchini olish
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("tokeen", token);
  if (!token) {
    return NextResponse.json({ error: "Token topilmadi" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    console.log("id", decoded.id);
    const user = await getUserById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Token noto‘g‘ri" }, { status: 401 });
  }
}
// PATCH - foydalanuvchini yangilash (bio va avatar)
export async function PATCH(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Token topilmadi" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const formData = await req.formData();

    const bio = formData.get("bio");
    const avatarFile = formData.get("avatar");

    let avatarPath = null;

    if (avatarFile && avatarFile.name) {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const ext = path.extname(avatarFile.name);
      const filename = uuidv4() + ext;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      avatarPath = `/uploads/${filename}`;
    }

    await connectDB();

    const updateFields = {};
    if (bio) updateFields.bio = bio;
    if (avatarPath) updateFields.avatar = avatarPath;
    console.log("bio=", bio);
    console.log("rasim", avatarPath);
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
    console.log("update", updatedUser);
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("PATCH xato:", error);
    return NextResponse.json({ error: "Ichki server xatosi" }, { status: 500 });
  }
}
