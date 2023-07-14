import { Types } from "mongoose";

export interface IBlog {
  id?: string,
  title: string,
  author: string,
  url: string,
  likes: number,
  user: Types.ObjectId | string
}

export interface IFavBlog {
  title: string,
  author: string,
  likes: number
}

export interface IMostBlogs {
  author: string,
  blogs: number
}

export interface IMostLikes {
  author: string,
  likes: number
}
