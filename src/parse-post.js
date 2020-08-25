const lineRe = /(?<key>[^:]+): (?<value>.+)/;

module.exports = (content) => {
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

  return { ...meta, body };
};

const keys = {
  date: (str) => new Date(str),
};
