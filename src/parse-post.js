const remark = require("remark");
const remarkHTML = require("remark-html");
const slug = require("remark-slug");
const highlight = require("remark-highlight.js");
const headings = require("remark-autolink-headings");

const md = remark()
  .use(slug)
  .use(headings, {
    content: { type: "text", value: "#" },
    behavior: "append",
    linkProperties: { ariaHidden: true, tabIndex: -1, class: "heading-link" },
  })
  .use(highlight)
  .use(remarkHTML);

const titleRe = /^# (?<date>\d{4}-\d{2}-\d{2}): (?<title>.+)$/;
const metaRe = /\[([^\]]+)\]\s+/g;

module.exports = async (content) => {
  const lines = content.split("\n");
  if (!lines[0].startsWith("# ") || lines[1] !== "")
    throw new Error("Invalid file " + content.slice(0, 100));

  const {
    groups: { title, date },
  } = titleRe.exec(lines[0]);

  let meta;
  if (lines[2][0] === "[") {
    meta = {};
    for (const [, token] of (lines[2] + " ").matchAll(metaRe)) {
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
    .slice(meta ? 2 : 4)
    .join("\n")
    .slice(0, -1);

  return {
    title,
    date: new Date(date),
    content_html: String(await md.process(body)),
    ...(meta || {}),
  };
};
