import { favoriteBlogs } from "../../src/utils/list_helper";
import { IBlog } from "../../src/interfaces/blogInterfaces";

describe("tests for function favoriteBlogs", () => {
  test("When the list is empty", () => {
    const emptyBlogList: IBlog[] = [];
    const result = favoriteBlogs(emptyBlogList);
    expect(result).toEqual([]);
  });

  test("When the list has only one blog", () => {
    const singleBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
    ];
    const result = favoriteBlogs(singleBlogList);
    expect(result.every(({ likes }) => likes === singleBlogList[0].likes)).toBeTruthy();
  });

  test("When there are multiple blogs in the list", () => {
    const multipleBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
      {
        title: "Blog 2",
        author: "Author 2",
        url: "http://blog2.com",
        likes: 10,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
        likes: 15,
        user: "notested"
      },
    ];
    const result = favoriteBlogs(multipleBlogList);
    expect(result.every(({ likes }) => likes === multipleBlogList[2].likes)).toBeTruthy();
  });

  test("When all blogs are the favorite", () => {
    const sameLikesBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
      {
        title: "Blog 2",
        author: "Author 2",
        url: "http://blog2.com",
        likes: 5,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
        likes: 5,
        user: "notested"
      },
    ];
    const result = favoriteBlogs(sameLikesBlogList);
    expect(result.every(({ likes }) => likes === sameLikesBlogList[0].likes)).toBeTruthy();
  });

  test("When some blogs have the same quantity of likes", () => {
    const multipleFavoriteBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
      {
        title: "Blog 2",
        author: "Author 2",
        url: "http://blog2.com",
        likes: 10,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
        likes: 10,
        user: "notested"
      },
    ];
    const result = favoriteBlogs(multipleFavoriteBlogList);
    expect(result.every(({ likes }) => likes === multipleFavoriteBlogList[1].likes)).toBeTruthy();
  });
});
