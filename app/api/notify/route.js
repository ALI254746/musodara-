// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";

// export async function POST(req) {
//   await dbConnect();

//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     return NextResponse.json({ error: "Token topilmadi" }, { status: 401 });
//   }

//   let currentUser;
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     currentUser = await User.findById(decoded.id);
//   } catch {
//     return NextResponse.json({ error: "Token noto‘g‘ri" }, { status: 401 });
//   }

//   if (!currentUser) {
//     return NextResponse.json(
//       { error: "Foydalanuvchi topilmadi" },
//       { status: 404 }
//     );
//   }

//   const body = await req.json();
//   const { toUserId, type, message } = body;

//   if (!toUserId || !type || !message) {
//     return NextResponse.json(
//       { error: "Malumotlar to‘liq emas" },
//       { status: 400 }
//     );
//   }

//   const toUser = await User.findById(toUserId);

//   if (!toUser) {
//     return NextResponse.json(
//       { error: "Qabul qiluvchi topilmadi" },
//       { status: 404 }
//     );
//   }

//   toUser.notifications.push({
//     type,
//     message,
//     from: currentUser._id,
//     createdAt: new Date(),
//     read: false,
//   });

//   await toUser.save();

//   return NextResponse.json({ success: true });
// }
