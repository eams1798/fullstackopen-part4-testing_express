import { Schema, model } from "mongoose";
import { IBlog } from "../interfaces/blogInterfaces";
import uniqueValidator from "mongoose-unique-validator";

const blogSchema = new Schema<IBlog>({
  id: {type: String, unique: true},
  title: {type: String, required: true, unique: true},
  author: {type: String, required: true},
  url : {type: String, required: true, unique: true},
  likes: {type: Number, required: true}
});

blogSchema.plugin(uniqueValidator);

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v } })

const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;