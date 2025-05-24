import User from "@/models/User";
import connectDB from "./mongodb";

export async function getUserById(id) {
  await connectDB();
  console.log("DB connected, searching user by ID:", id);

  const user = await User.findById(id).select("-password");
  if (!user) {
    console.log("User not found with ID:", id);
    return null;
  }
  console.log("User found:", user);
  return user;
}
