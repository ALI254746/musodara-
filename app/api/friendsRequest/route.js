// app/api/friendsRequest/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();

  // Tokenni cookie dan olish
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token topilmadi" }, { status: 401 });
  }

  let currentUser;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    currentUser = await User.findById(decoded.id);
  } catch {
    return NextResponse.json({ error: "Token noto‘g‘ri" }, { status: 401 });
  }

  if (!currentUser) {
    return NextResponse.json(
      { error: "Foydalanuvchi topilmadi" },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { friendId } = body;

  if (!friendId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const fromId = currentUser._id.toString();
  const toUser = await User.findById(friendId);

  if (!toUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const alreadyRequested =
    toUser.friendRequests?.some((req) => req.from.toString() === fromId) ??
    false;
  toUser.friendRequests = toUser.friendRequests || [];
  toUser.notifications = toUser.notifications || [];
  const alreadyFriends =
    toUser.friends?.some((id) => id.toString() === fromId) ?? false;

  if (alreadyRequested || alreadyFriends) {
    return NextResponse.json(
      { error: "Already requested or friends" },
      { status: 400 }
    );
  }

  toUser.friendRequests.push({ from: fromId });
  toUser.notifications.push({
    type: "friend_request",
    message: `${currentUser.name} sizga do‘stlik so‘rovi yubordi`,
    from: fromId,
  });

  await toUser.save();

  return NextResponse.json({ success: true });
}
