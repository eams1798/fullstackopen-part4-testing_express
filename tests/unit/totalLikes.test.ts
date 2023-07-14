import { totalLikes } from "../../src/utils/list_helper";
import { IBlog } from "../../src/interfaces/blogInterfaces";

describe("tests for function totalLikes", () => {
  test("when the list is empty", () => {
    const emptyBlogList: IBlog[] = [];
    const result = totalLikes(emptyBlogList);
    expect(result).toBe(0);
  });

  test("when the list has only one element", () => {
    const singleBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
    ];
    const result = totalLikes(singleBlogList);
    expect(result).toBe(5);
  });

  test("when there are multiple blogs in the list", () => {
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
    const result = totalLikes(multipleBlogList);
    expect(result).toBe(30);
  });

  test("when some blogs have zero likes", () => {
    const zeroLikesBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 0,
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
        likes: 0,
        user: "notested"
      },
    ];
    const result = totalLikes(zeroLikesBlogList);
    expect(result).toBe(10);
  });
});
