import { parse } from "json2csv";

function cleanStringFromColors(str: string) {
  const colorsRe = /(\|c.{8})([^|]*)(\|r)/g;
  const newlinesRe = /\|n/g;
  return str.replace(colorsRe, "$2").replace(newlinesRe, "");
}

function strMapToObj(strMap: Map<string, any>) {
  const results = [];
  for (const [, v] of strMap) {
    const cleanedObject: Record<string, any> = {};
    for (const [objKey, objValue] of Object.entries(v)) {
      if (typeof objValue === "string") {
        cleanedObject[objKey] = cleanStringFromColors(objValue);
      }
    }
    results.push(cleanedObject);
  }
  return results;
}

export function toCsv(gameData: Map<string, unknown>): string {
  const fields = [
    "name",
    "tooltip",
    "description",
    "ubertooltip",
    "icon",
    "price",
    "level",
  ];

  const objMap = strMapToObj(gameData);
  const parsed = parse(objMap, {
    fields,
  });
  return parsed;
}
