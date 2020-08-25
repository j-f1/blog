const layout = require("../layout");
const { html } = require("../utils");

module.exports = (posts) =>
  layout({
    content: html`
      <h1>Jed Fox’s Blog</h1>

      <ul class="posts">
        ${posts.map(renderPost)}
      </ul>
    `,
  });

function renderPost(post) {
  return html`<li>
    <a href="/posts/${post.slug}">${post.title}</a>
    <span class="date">${post.date.toDateString()}</span>
  </li>`;
}
