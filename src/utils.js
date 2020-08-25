const safe = Symbol("safe");

exports.safe = (str) => ({ [safe]: str });

exports.dedent = (strings, ...interpolations) =>
  interpolate(strings, interpolations)
    .split("\n")
    .slice(1, -1)
    .map((l) => l.slice(2))
    .join("\n");

function interpolate(strings, interpolations) {
  let result = strings[0];
  for (let i = 0; i < interpolations.length; i++) {
    const value = interpolations[i];
    result += value[safe] ?? value;
    result += strings[i + 1];
  }
  return result;
}
