const fs = require("fs");
const path = require("path");

const dir = path.join(path.dirname(__dirname), "public");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const writeFile = (name, content) =>
  fs.writeFileSync(path.join(dir, name), content);

writeFile(
  "index.html",
  require("../src/layout")({
    title: "Hello, world!",
    content: "<p>content</p>",
  })
);
