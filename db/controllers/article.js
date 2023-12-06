import User from "../models/user";
import { normalizeId, dbConnect } from "./util";

export async function getAll(userId) {
  await dbConnect();
  const user = await User.findById(userId).lean();
  if (!user) return null;
  return user.savedArticles.map((article) => normalizeId(article));
}

export async function add(userId, article) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedArticles: article } },
    { new: true }
  );
  if (!user) return null;
  return normalizeId(user);
}

export async function remove(userId, publishedAt) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedArticles: { publishedAt: publishedAt } } },
    { new: true }
  );
  if (!user) return null;
  return true;
}
