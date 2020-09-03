const remark = require("remark");
const remarkHTML = require("remark-html");
const slug = require("remark-slug");
const highlight = require("remark-highlight.js");
const headings = require("remark-autolink-headings");
const flatMap = require("unist-util-flatmap");
const remove = require("unist-util-remove");

const md = remark()
  // Ulysses-style paragraphs
  .use(function () {
    return (tree) => {
      flatMap(tree, (node, originalIndex, parent) => {
        if (node.type !== "paragraph") return [node];
        const paragraphs = [{ type: "paragraph", children: [] }]; // reversed
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (child.type !== "text" || !child.value.includes("\n")) {
            paragraphs[0].children.push(child);
            continue;
          }
          const [first, ...rest] = child.value.split("\n");
          paragraphs[0].children.push({ type: "text", value: first });
          for (const value of rest) {
            paragraphs.unshift({
              type: "paragraph",
              children: value ? [{ type: "text", value }] : [],
            });
          }
        }
        return paragraphs;
      });
    };
  })
  // Strip comments
  .use(function () {
    return (tree) => {
      remove(
        tree,
        (node) => node.type === "html" && node.value.startsWith("<!--")
      );
    };
  })
  .use(slug)
  .use(headings, {
    content: { type: "text", value: "#" },
    behavior: "append",
    linkProperties: { ariaHidden: true, tabIndex: -1, class: "heading-link" },
  })
  .use(highlight)
  .use(remarkHTML);

const titleRe = /^# (?<date>\d{4}-\d{2}-\d{2}): (?<title>.+)$/;
const metaRe = /\{([^\]]+)\}\s+/g;

module.exports = async (content) => {
  const lines = content.split("\n");
  if (!lines[0].startsWith("# "))
    throw new Error("Invalid file " + content.slice(0, 100));

  const {
    groups: { title, date },
  } = titleRe.exec(lines[0]);

  let meta;
  if (lines[1][0] === "{") {
    meta = {};
    for (const [, token] of (lines[1] + " ").matchAll(metaRe)) {
      if (token === "unlisted") {
        meta.unlisted = true;
      } else {
        throw new Error(
          `Invalid token ${token} in file ` + content.slice(0, 100)
        );
      }
    }
  }

  const body = lines
    .slice(meta ? 2 : 1)
    .join("\n")
    .slice(0, -1);

  return {
    title,
    date: new Date(date),
    content_html: String(await md.process(body)),
    ...(meta || {}),
  };
};
