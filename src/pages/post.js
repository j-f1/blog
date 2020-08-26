const layout = require("../layout");
const { html, safe } = require("../utils");

module.exports = (post) =>
  layout({
    content: html`
      <a href="/" style="font-family: var(--system-fonts); font-weight: bold;">
        &larr; Home
      </a>
      <h1>${post.title}</h1>
      <article>${safe(post.content_html)}</article>
    `,
  });
