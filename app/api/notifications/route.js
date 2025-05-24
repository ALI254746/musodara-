// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Notification from "@/models/notification";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function GET() {
//   await dbConnect();

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const currentUserId = decoded._id;

//     // Foydalanuvchiga kelgan bildirishnomalarni olish
//     const notifications = await Notification.find({ to: currentUserId })
//       .populate("from", "name avatar")
//       .sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       notifications,
//     });
//   } catch (error) {
//     console.error("Notification fetch error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
