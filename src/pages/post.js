const layout = require("../layout");
const { html, safe } = require("../utils");

module.exports = (post) =>
  layout({
    content: html`
      <p>
        <a href="/" class="home-link"> &larr; Home </a>
      </p>
      <h1 class="post-title">${post.title}</h1>
      <p class="post-date">${post.date.toDateString()}</p>
      <article>${safe(post.content_html)}</article>
    `,
  });
