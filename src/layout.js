const { html, safe } = require("./utils");

module.exports = (title, content) => {
  return html`
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <title>${title ? title + " | " : ""}Jed Fox’s Blog</title>
        <meta name="viewport" content="width=device-width" />
        <link
          rel="stylesheet"
          href="/atom-one-light.css"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="stylesheet"
          href="/atom-one-dark.css"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="stylesheet" href="https://jedfox.com/styles.css" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="alternate" type="application/json" href="/feed.json" />
        <link rel="alternate" type="application/feed+json" href="/feed.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="https://jedfox.com/favicon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://jedfox.com/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="https://jedfox.com/favicon-96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://jedfox.com/favicon-16.png"
        />
      </head>
      <body>
        <main>
          ${safe(content)}
          <footer>
            &copy;
            2020${new Date().getFullYear() > 2020
              ? "&ndash;" + new Date().getFullYear()
              : ""}
            Jed Fox. All rights reserved. Written in HTML and CSS using a
            hand-coded static site generator,
            <a href="https://remark.js.org">remark</a>, and
            <a href="https://highlightjs.org">highlight.js</a>. View
            <a href="https://github.com/j-f1/blog">the source</a> on GitHub.
          </footer>
        </main>
      </body>
    </html>
  `.toString();
};
