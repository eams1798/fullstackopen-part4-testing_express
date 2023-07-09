import { IBlog } from '../src/interfaces/blogInterfaces';
import Blog from '../src/models/blog';

const initialBlogs: IBlog[] = [
    {
      title: "The Art of Storytelling",
      author: "Jane Smith",
      url: "https://www.example.com/storytelling",
      likes: 42,
    },
    {
      title: "Exploring the Cosmos",
      author: "John Doe",
      url: "https://www.example.com/cosmos",
      likes: 76,
    },
    {
      title: "Cooking Adventures",
      author: "Samantha Lee",
      url: "https://www.example.com/cooking",
      likes: 18,
    },
    {
      title: "Journey to the Unknown",
      author: "Max Power",
      url: "https://www.example.com/journey",
      likes: 92,
    },
    {
      title: "The Mindful Artist",
      author: "Luna Moon",
      url: "https://www.example.com/mindful-artist",
      likes: 63,
    },
  ];

const nonExistingId = async (): Promise<string> => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Not existing', url: "www.e404.com", likes: 0 });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async (): Promise<IBlog[]> => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

export default {
  initialBlogs, nonExistingId, blogsInDb
};