const remark = require("remark");
const remarkHTML = require("remark-html");
const slug = require("remark-slug");

const md = remark().use(slug).use(remarkHTML);

const lineRe = /(?<key>[^:]+): (?<value>.+)/;

/** @param {string} content */
module.exports = async (content) => {
  const lines = content.split("\n");
  if (lines[0] !== "---") throw new Error("Invalid file " + content);

  const meta = {};
  let i = 1;
  while (lines[i] !== "---") {
    const [, key, value] = lineRe.exec(lines[i]);
    meta[key] = keys[key]?.(value) ?? value;
    i++;
  }

  const body = lines
    .slice(i + 2)
    .join("\n")
    .slice(0, -1);

  return { ...meta, content_html: String(await md.process(body)) };
};

const keys = {
  date: (str) => new Date(str),
};
