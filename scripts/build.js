console.log(`Building at ${new Date().toLocaleTimeString()} ...`);

const fs = require("fs");
const path = require("path");

const parsePost = require("../src/parse-post");

const root = path.dirname(__dirname);
const outputDir = path.join(root, "public");
const postsDir = path.join(root, "posts");
const staticDir = path.join(root, "static");

function recursivelyRemove(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) {
      recursivelyRemove(file);
    } else {
      fs.unlinkSync(file);
    }
  }
  fs.rmdirSync(dir);
}

if (fs.existsSync(outputDir)) recursivelyRemove(outputDir);
fs.mkdirSync(outputDir);

for (const name of fs.readdirSync(staticDir)) {
  fs.copyFileSync(path.join(staticDir, name), path.join(outputDir, name));
}

const writeFile = (name, content) => {
  const absPath = path.join(outputDir, name);
  if (!fs.existsSync(path.dirname(absPath)))
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content);
};
const posts = fs.readdirSync(postsDir).map((name) => ({
  slug: name.slice(0, -3),
  ...parsePost(fs.readFileSync(path.join(postsDir, name), "utf8")),
}));

writeFile("index.html", require("../src/pages/home")(posts));

for (const post of posts) {
  writeFile("posts/" + post.slug + ".html", require("../src/pages/post")(post));
}
