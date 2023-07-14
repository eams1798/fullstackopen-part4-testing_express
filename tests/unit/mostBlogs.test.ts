import { mostBlogs } from "../../src/utils/list_helper";
import { IBlog } from "../../src/interfaces/blogInterfaces";

import { describe, test, expect } from "@jest/globals";

describe("tests for function mostBlogs", () => {
  test("When the list is empty", () => {
    const emptyBlogList: IBlog[] = [];
    const result = mostBlogs(emptyBlogList);
    expect(result).toEqual([]);
  });

  test("When only one author posted blogs in the list", () => {
    const singleAuthorBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
      {
        title: "Blog 2",
        author: "Author 1",
        url: "http://blog2.com",
        likes: 10,
        user: "notested"
      },
    ];
    const result = mostBlogs(singleAuthorBlogList);
    expect(result).toEqual([{ author: "Author 1", blogs: 2 }]);
  });

  test("When many authors posted their blogs in the list", () => {
    const multipleAuthorBlogList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
      {
        title: "Blog 2",
        author: "Author 1",
        url: "http://blog2.com",
        likes: 10,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 2",
        url: "http://blog3.com",
        likes: 15,
        user: "notested"
      },
    ];
    const result = mostBlogs(multipleAuthorBlogList);
    expect(result).toEqual([{ author: "Author 1", blogs: 2 }]);
  });

  test("When all authors have the same quantity of blogs", () => {
    const sameBlogsCountAuthorList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 5,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 1",
        url: "http://blog3.com",
        likes: 7,
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
        title: "Blog 4",
        author: "Author 2",
        url: "http://blog4.com",
        likes: 12,
        user: "notested"
      },
    ];

    const result = mostBlogs(sameBlogsCountAuthorList);
    expect(result).toEqual([{ author: "Author 1", blogs: 2 }, { author: "Author 2", blogs: 2 }]);
  });

});
