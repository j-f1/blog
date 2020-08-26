const author = { name: "Jed Fox", url: "https://jedfox.com" };

module.exports = (posts) => ({
  version: "https://jsonfeed.org/version/1.1",
  title: "Jed Fox’s Blog",
  home_page_url: "https://blog.jedfox.com",
  feed_url: "https://blog.jedfox.com/feed",
  icon: "https://jedfox.com/favicon-192.png",
  author,
  authors: [author],
  language: "en-us",
  items: posts.map((post) => ({
    ...post,
    id: "https://blog.jedfox.com/posts/" + post.slug,
    url: "https://blog.jedfox.com/posts/" + post.slug,
    slug: undefined,
  })),
});
