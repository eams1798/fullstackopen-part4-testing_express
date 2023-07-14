import { IBlog, IFavBlog, IMostBlogs, IMostLikes } from "../interfaces/blogInterfaces";

const dummy = ( blogs: IBlog [] ): number => {
  return 1;
};

const totalLikes = ( blogs: IBlog[] ): number => {
  const reducer = ( sum: number, blog: IBlog ): number => {
    return sum + blog.likes;
  };
  return blogs.length === 0 ?
    0: blogs.reduce(reducer, 0);
};

const favoriteBlogs = ( blogs: IBlog[] ): IFavBlog[] => {
  const reducer = ( maxN: number, blog: IBlog ): number => {
    return Math.max( maxN, blog.likes );
  };
  const maxLikes = blogs.reduce( reducer, 0 );

  const favBlogs: IFavBlog[] = blogs
    .filter((blog) => blog.likes === maxLikes)
    .map(({ title, author, likes }) => ({ title, author, likes }));

  return favBlogs;
};

const mostBlogs = ( blogs: IBlog [] ): IMostBlogs[] => {
  const blogsByAuthor: IMostBlogs[] = [];

  blogs.forEach( blog => {
    if ( blogsByAuthor.some(({ author }) => author === blog.author )) {
      const authorIndex = blogsByAuthor.findIndex (({ author }) => author === blog.author );
      blogsByAuthor[ authorIndex ].blogs++;
    } else {
      blogsByAuthor.push({
        author : blog.author,
        blogs : 1
      }) ;
    }
  }) ; // end of For Each

  const reducer = ( maxN: number, author : IMostBlogs ): number => {
    return Math.max( maxN , author.blogs );
  };
  const nMaxBlogs = blogsByAuthor.reduce( reducer, 0 );

  return blogsByAuthor.filter (( author ) => ( author.blogs === nMaxBlogs )) ;
} ;

const mostLikes = ( blogs : IBlog[] ): IMostLikes[] => {
  const likesByAuthor: IMostLikes[] = [];

  blogs.forEach(blog => {
    if ( likesByAuthor.some(({ author }) => author === blog.author )) {
      const authorIndex = likesByAuthor.findIndex(({ author }) => author === blog.author );
      likesByAuthor[ authorIndex ].likes += blog.likes;
    } else {
      likesByAuthor.push ({
        author: blog.author,
        likes: blog.likes
      });
    }
  }); // end of For Each

  const reducer = ( maxN: number , author: IMostLikes ): number => {
    return Math.max ( maxN, author.likes );
  };
  const nMaxLikes = likesByAuthor.reduce( reducer, 0 );

  return likesByAuthor.filter( author => author.likes === nMaxLikes );
};

export {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes
};