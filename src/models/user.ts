import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { IUser } from "../interfaces/user";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, minlength: 3 },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog"
    }
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (_doc_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

const User = model<IUser>("User", userSchema);

export default User;