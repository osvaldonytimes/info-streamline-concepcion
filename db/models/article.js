import { Schema } from "mongoose";

const articleSchema = new Schema({
  sourceId: String,
  sourceName: String,
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: Date,
  content: String,
});

export default articleSchema;
