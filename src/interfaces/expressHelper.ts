import { Request as ExpressRequest } from "express";
import { Document, Types } from "mongoose";

export interface UserDocument extends Document {
  username: string,
  name: string,
  passwordHash: string,
  id?: string,
  blogs: Types.ObjectId[]
}

export interface Request extends ExpressRequest {
  token?: string,
  user?: UserDocument
}