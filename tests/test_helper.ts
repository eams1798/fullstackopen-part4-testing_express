import { IBlog } from "../src/interfaces/blogInterfaces";
import { IUser } from "../src/interfaces/user";

import bcrypt from "bcrypt";
import Blog from "../src/models/blog";
import User from "../src/models/user";
import mongoose from "mongoose";

const userId1 = new mongoose.Types.ObjectId();
const userId2 = new mongoose.Types.ObjectId();

const blogId1 = new mongoose.Types.ObjectId();
const blogId2 = new mongoose.Types.ObjectId();
const blogId3 = new mongoose.Types.ObjectId();
const blogId4 = new mongoose.Types.ObjectId();
const blogId5 = new mongoose.Types.ObjectId();

const password1 = "deepblusea";
const password2 = "sandydunes";

const encryptPasswords = async (passw: string,) => {
  const encryptedPassword = await bcrypt.hash(passw, 10);

  return encryptedPassword;
};


const initialBlogs: IBlog[] = [
  { id: blogId1.toString(), title: "Exploring the Depths of the Ocean", author: "AquaMarine", url: "http://deepseaexploration.com", likes: 150, user: userId1 },
  { id: blogId2.toString(), title: "The Majesty of Mountain Peaks", author: "AquaMarine", url: "http://mountainmajesty.com", likes: 200, user: userId1 },
  { id: blogId3.toString(), title: "Adventures in the Amazon Rainforest", author: "AquaMarine", url: "http://amazonadventures.com", likes: 250, user: userId1 },
  { id: blogId4.toString(), title: "The Silence of the Sahara Desert", author: "DesertDust", url: "http://saharasilence.com", likes: 300, user: userId2 },
  { id: blogId5.toString(), title: "Unseen Beauty of the Arctic", author: "DesertDust", url: "http://arcticbeauty.com", likes: 350, user: userId2 },
];

let initialUsers: IUser[] = [
  { id: userId1.toString(), username: "AquaMarine", name: "Marina Aqua", passwordHash:"hash1", blogs: [blogId1, blogId2, blogId3] },
  { id: userId2.toString(), username: "DesertDust", name: "Dustin Sands", passwordHash: "hash2", blogs: [blogId4, blogId5] },
];

const nonExistingBlogId = async (): Promise<string> => {
  const blog = new Blog({ title: "willremovethissoon", author: "Not existing", url: "www.e404.com", likes: 0 });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const nonExistingUserId = async (): Promise<string> => {
  const passwd = await bcrypt.hash("unknown", 10);
  const blog = new User({ username: "removeme", name: "Remove Me", passwordHash: passwd });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async (): Promise<IBlog[]> => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const setDatabase = async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const encryptedPasswords = [await encryptPasswords(password1), await encryptPasswords(password2)];
  initialUsers = initialUsers.map((user, index) => ({
    ...user,
    passwordHash: encryptedPasswords[index].toString()
  }));

  // Insert users without setting the blogs property
  const userObjects = initialUsers.map(user => new User(user));
  const savedUsers = await Promise.all(userObjects.map(user => user.save()));

  // Insert blogs without setting the user property
  const blogObjects = initialBlogs.map(blog => new Blog(blog));
  const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()));

  savedUsers[0].blogs = [savedBlogs[0]._id, savedBlogs[1]._id, savedBlogs[2]._id];
  savedUsers[1].blogs = [savedBlogs[3]._id, savedBlogs[4]._id];
  await Promise.all(savedUsers.map(user => user.save()));

  savedBlogs[0].user = savedUsers[0]._id;
  savedBlogs[1].user = savedUsers[0]._id;
  savedBlogs[2].user = savedUsers[0]._id;
  savedBlogs[3].user = savedUsers[1]._id;
  savedBlogs[4].user = savedUsers[1]._id;
  await Promise.all(savedBlogs.map(blog => blog.save()));
};

export default {
  initialBlogs, initialUsers,
  nonExistingBlogId, nonExistingUserId,
  blogsInDb, usersInDb,
  password1, password2,
  encryptPasswords,
  setDatabase
};