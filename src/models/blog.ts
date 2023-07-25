import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { IBlog } from "../interfaces/blogInterfaces";

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  url : {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => {
        const urlRegex = /^((ftp|http|https):\/\/)?[^ "]+\.[a-z]+$/;
        return urlRegex.test(v);
      },
      message: props => `${props.value} is not a valid URL`
    },
  },
  likes: { type: Number, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

blogSchema.plugin(uniqueValidator);

blogSchema.set("toJSON", {
  transform: (_doc_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = model<IBlog>("Blog", blogSchema);

export default Blog;
