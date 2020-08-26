console.log(`Building at ${new Date().toLocaleTimeString()} ...`);

const fs = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");

const parsePost = require("../src/parse-post");

const root = path.dirname(__dirname);
const outputDir = path.join(root, "public");
const postsDir = path.join(root, "posts");
const staticDir = path.join(root, "static");

function readdir(dir, cb) {
  return fs
    .readdir(dir)
    .then((files) =>
      Promise.all(files.map((name) => cb(path.join(dir, name), name)))
    );
}

async function recursivelyRemove(dir) {
  await readdir(dir, (file) =>
    fs
      .stat(file)
      .then((s) =>
        s.isDirectory() ? recursivelyRemove(file) : fs.unlink(file)
      )
  );
  await fs.rmdir(dir);
}

async function writeFile(name, content) {
  const absPath = path.join(outputDir, name);
  if (!existsSync(path.dirname(absPath))) {
    await fs.mkdir(path.dirname(absPath), { recursive: true });
  }
  await fs.writeFile(absPath, content);
}

async function resetOutput() {
  if (existsSync(outputDir)) await recursivelyRemove(outputDir);
  await fs.mkdir(outputDir);
}

async function copyStatic() {
  await readdir(staticDir, (src, name) =>
    fs.copyFile(src, path.join(outputDir, name))
  );
}

function fetchPosts() {
  return readdir(postsDir, (file, name) => ({
    ...parsePost(fs.readFileSync(file, "utf8")),
    slug: path.basename(name, ".md"),
  }));
}

(async () => {
  const [posts] = await Promise.all([fetchPosts(), resetOutput()]);
  await Promise.all([
    copyStatic(),
    writeFile("index.html", require("../src/pages/home")(posts)),
    ...posts.map((post) =>
      writeFile(
        "posts/" + post.slug + ".html",
        require("../src/pages/post")(post)
      )
    ),
  ]);
})();
