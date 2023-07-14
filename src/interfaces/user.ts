import { Types } from "mongoose";

export interface IUser {
  username: string,
  name: string,
  passwordHash: string,
  id?: string,
  blogs: Types.ObjectId[] | string[]
}