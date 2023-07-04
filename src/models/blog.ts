import { Schema, model } from "mongoose";
import { IBlog } from "../interfaces/blogInterfaces";

const blogSchema = new Schema<IBlog>({
  title: {type: String, required :true},
  author: {type: String, required :true},
  url : {type: String, required :true},
  likes: {type: Number, required :true}
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v } })

export default model('Blog', blogSchema);