const layout = require("../layout");
const { html, safe, isoDate, feedExplainer } = require("../utils");

module.exports = (post) =>
  layout(
    post.title,
    html`
      <p>
        <a href="/" class="home-link"> &larr; Home </a>
      </p>
      <h1 class="post-title">${post.title}</h1>
      <p class="post-date">
        <time datetime="${isoDate(post.date)}">
          ${post.date.toDateString()}
        </time>
      </p>
      <article>${safe(post.content_html)}</article>
      <br />
      <p style="font-style: italic">
        Questions or comments? You can DM me on
        <a href="https://twitter.com/jed_fox1">Twitter</a>,
        <a href="https://keybase.io/j_f/chat">Keybase</a>, or Discord
        <span style="font-style: normal">
          (<code style="font-size: 0.8em">Jed Fox#3082</code>)</span
        >. You can also send an email to
        <a
          href="mailto:jed.twopointzero@gmail.com?subject=${encodeURIComponent(
            `Comment on “${post.title}”`
          )}"
          >jed.twopointzero@gmail.com</a
        >, optionally using my <a href="/public.pgp">public key</a>.
      </p>
      <p style="font-style: italic">${feedExplainer}</p>
    `
  );
