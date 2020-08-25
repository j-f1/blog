const { dedent, safe } = require("./utils");

module.exports = ({ title, content }) => dedent`
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="viewport" content="width=device-width" />
      <link rel="stylesheet" href="https://jedfox.com/styles.css" />
      <link rel="icon" type="image/png" sizes="192x192" href="https://jedfox.com/favicon-192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="https://jedfox.com/favicon-32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="https://jedfox.com/favicon-96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="https://jedfox.com/favicon-16.png" />
    </head>
    <body>
      <main>
        ${safe(content)}
      </main>
    </body>
  </html>
`;
