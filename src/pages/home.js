const layout = require("../layout");
const { html, isoDate, feedExplainer } = require("../utils");

module.exports = (posts) =>
  layout(
    null,
    html`
      <h1>Jed Fox’s Blog</h1>

      <p style="font-family: var(--system)">
        Looking for my website? It’s over at
        <a href="https://jedfox.com">jedfox.com</a>.
      </p>
      <p style="font-family: var(--system)">${feedExplainer}</p>

      <ul class="posts">
        ${posts.map(renderPost)}
      </ul>
    `
  );

function renderPost(post) {
  return html`<li>
    <a class="post-title" href="/posts/${post.slug}">${post.title}</a>
    <time datetime="${isoDate(post.date)}" class="post-date"
      >${post.date.toDateString()}</time
    >
  </li>`;
}
