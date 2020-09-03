const safe = Symbol("safe");

exports.isoDate = (date) => date.toISOString().split("T")[0];

exports.safe = (str) => ({ [safe]: str, toString: () => str });

exports.html = (strings, ...interpolations) => {
  let result = strings[0];
  for (let i = 0; i < interpolations.length; i++) {
    const raw = interpolations[i];
    result += Array.isArray(raw) ? raw.map(unwrap).join("") : unwrap(raw);
    result += strings[i + 1];
  }
  return exports.safe(result);
};

const unwrap = (raw) => {
  if (raw == null) throw new Error("Invalid null or undefined value");
  return raw[safe] ?? encode(raw);
};

const encode = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

exports.feedExplainer = exports.html`
    Want to see future posts as soon as they’re published? Subscribe to
    <a href="/feed.json">the JSON feed</a>! (<a href="https://aboutfeeds.com"
      >what’s a feed?</a
    >
    • <a href="https://jsonfeed.org/version/1.1">what’s a JSON Feed?</a>)
  `;
