const chalk = require("chalk");
const start = Date.now();
process.stdout.write(
  `Building at ${chalk.bold(new Date().toLocaleTimeString())}... `
);

const fs = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");

const parsePost = require("../src/parse-post");

const root = path.dirname(__dirname);
const outputDir = path.join(root, "public");
const postsDir = path.join(root, "posts");
const staticDir = path.join(root, "static");

function readdir(dir, ext, cb) {
  if (!cb) {
    cb = ext;
    ext = null;
  }
  return fs
    .readdir(dir)
    .then((files) =>
      Promise.all(
        files
          .filter((name) => !ext || name.endsWith(ext))
          .map((name) => cb(path.join(dir, name), name))
      )
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
  const hljsPath = path.join(root, "node_modules", "highlight.js", "styles");
  await Promise.all([
    readdir(staticDir, (src, name) =>
      fs.copyFile(src, path.join(outputDir, name))
    ),
    fs.copyFile(
      path.join(hljsPath, "atom-one-light.css"),
      path.join(outputDir, "atom-one-light.css")
    ),
    fs.copyFile(
      path.join(hljsPath, "atom-one-dark.css"),
      path.join(outputDir, "atom-one-dark.css")
    ),
  ]);
}

function fetchPosts() {
  return readdir(postsDir, ".md", async (file, name) => ({
    ...(await parsePost(await fs.readFile(file, "utf8"))),
    slug: path.basename(name, ".md"),
  }));
}

(async () => {
  const [posts] = await Promise.all([fetchPosts(), resetOutput()]);
  const publicPosts = posts.filter((p) => !p.unlisted);
  await Promise.all([
    copyStatic(),
    writeFile("feed.json", JSON.stringify(require("../src/feed")(publicPosts))),
    writeFile("index.html", require("../src/pages/home")(publicPosts)),
    ...posts.map((post) =>
      writeFile(
        "posts/" + post.slug + ".html",
        require("../src/pages/post")(post)
      )
    ),
  ]);
})().then(
  () => console.log(chalk.green`Done in {bold ${Date.now() - start}ms}`),
  (err) => {
    process.stdout.write(chalk.red`Failed in {bold ${Date.now() - start}ms}\n`);
    console.error(
      chalk`${err.name}: {bold.whiteBright.bgRedBright  ${err.message} }`
    );
    console.error(
      chalk.gray(err.stack.replace(`${err.name}: ${err.message}` + "\n", "")) +
        "\n"
    );
  }
);
