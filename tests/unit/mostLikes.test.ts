import { mostLikes } from "../../src/utils/list_helper";
import { IBlog } from "../../src/interfaces/blogInterfaces";

describe("tests for function mostLikes", () => {
  test("When the list is empty", () => {
    const emptyBlogList: IBlog[] = [];
    const result = mostLikes(emptyBlogList);
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
    const result = mostLikes(singleAuthorBlogList);
    expect(result).toEqual([{ author: "Author 1", likes: 15 }]);
  });

  test("When many authors posted blogs in the list", () => {
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
        author: "Author 3",
        url: "http://blog2.com",
        likes: 10,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 2",
        url: "http://blog3.com",
        likes: 20,
        user: "notested"
      },
    ];
    const result = mostLikes(multipleAuthorBlogList);
    expect(result).toEqual([{ author: "Author 2", likes: 20 }]);
  });

  test("When all authors sums the same quantity of likes each one", () => {
    const sameLikesCountAuthorList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 7,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 2",
        url: "http://blog3.com",
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
        title: "Blog 4",
        author: "Author 1",
        url: "http://blog4.com",
        likes: 3,
        user: "notested"
      },
    ];
    const result = mostLikes(sameLikesCountAuthorList);
    expect(result).toEqual([{ author: "Author 1", likes: 10 }, { author: "Author 2", likes: 10 }]);
  });

  test("When some authors have the same sum of likes", () => {
    const someSameLikesAuthorList: IBlog[] = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://blog1.com",
        likes: 7,
        user: "notested"
      },
      {
        title: "Blog 3",
        author: "Author 2",
        url: "http://blog3.com",
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
        title: "Blog 4",
        author: "Author 1",
        url: "http://blog4.com",
        likes: 3,
        user: "notested"
      },
      {
        title: "Blog 5",
        author: "Author 3",
        url: "http://blog5.com",
        likes: 1,
        user: "notested"
      }
    ];
    const result = mostLikes(someSameLikesAuthorList);
    expect(result).toEqual([{ author: "Author 1", likes: 10 }, { author: "Author 2", likes: 10 }]);
  });
});