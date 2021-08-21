import { groupBy } from "lodash/fp";
import { Line } from "./Line";

export type ParsedWC3String = {
  id: number;
  value: string;
  comment?: string;
};

type CommentType = "Items" | "Abilities" | "Units" | "Doodads";
type StringType = "ability" | "item" | "unit" | "doodad" | "unknown";

type ParsedComment = {
  type: CommentType;
  id: string;
  name: string;
  where: string;
};

export type WC3StringObject = {
  type: StringType;
  id: string;
  name: string;
  where: string;
};

export type WC3StringDataObject = {
  stringId: number;
  text: string;
  comment: string;
  object: WC3StringObject | undefined;
};

export type WC3StringGroupedCollection = Record<
  "Hotkey" | "Name" | "Tip" | "Description" | "Ubertip" | "EditorSuffix",
  Line<WC3String>[]
>;

export class WC3String {
  static ObjectTypeMapper = {
    Items: "item",
    Abilities: "ability",
    Units: "unit",
    Doodads: "doodad",
  };

  stringId: number;
  text: string;
  comment = "";
  object: WC3StringObject | undefined;

  constructor(parsedString: ParsedWC3String) {
    const { id, value, comment } = parsedString;
    this.text = value?.replace("\r", "");
    this.stringId = id;
    if (comment) {
      const parsedComment = this.parseComment(comment);
      if (parsedComment) {
        const { type, id, name, where } = parsedComment;
        const mappedType = (WC3String.ObjectTypeMapper[type] ||
          "unknown") as StringType;
        this.object = {
          type: mappedType,
          id,
          name,
          where,
        };
      }
    }
  }

  private parseComment(comment: string): ParsedComment | undefined {
    const re =
      /\/\/ (?<type>Items|Abilities|Units|Doodads): (?<id>[a-zA-Z0-9]+) \((?<name>.*)\), (?<where>.*)/;
    const match = comment.match(re);
    if (match?.groups) {
      const { type, id, name, where } = match.groups;
      return {
        type: type as CommentType,
        id,
        name,
        where,
      };
    }
    return undefined;
  }
}

function parseId(stringWithId: string): number {
  return parseInt(stringWithId.replace("STRING ", ""), 10);
}

export function matchSingleString(wc3String: string): ParsedWC3String {
  const lines = wc3String.split("\n");
  // Has comment
  if (lines.length === 5) {
    const [withId, comment, , value] = lines;
    return {
      id: parseId(withId),
      comment: comment,
      value,
    };
  }
  const [withId, , value] = lines;
  return {
    id: parseId(withId),
    value,
  };
}

export function matchStringsLines(strings: string): Line<WC3String>[] {
  // Normalize line endings
  const splitStrings = strings.replaceAll("\r\n", "\n").split("\n\n");

  return splitStrings
    .map((line) =>
      new Line<WC3String>(line, "war3map.wts").setData(
        new WC3String(matchSingleString(line))
      )
    )
    .filter((x) => x) as Line<WC3String>[];
}

function getValue(lines: Line<WC3String>[] = []) {
  if (lines.length > 0) {
    return lines[0].data?.text;
  }
  return undefined;
}

function getDefaultName(lines: Line<WC3String>[] = []) {
  if (lines.length > 0) {
    return lines[0].data?.object?.name;
  }
  return undefined;
}

type ItemObject = {
  name: string;
  description: string;
  ubertip: string;
};

export function formatItems(items: Line<WC3String>[]) {
  const grouped = groupBy((i: Line<WC3String>) => i?.data?.object?.id)(items);
  const group = groupBy((line: Line<WC3String>) =>
    line.data?.object?.where.replace(/ (\(.*\))/, "").toLowerCase()
  );
  const keys = Object.keys(grouped);
  const map = new Map<string, Partial<ItemObject>>();
  for (const key of keys) {
    const items = grouped[key];
    const labelGrouped = group(items);
    const { name, description, ubertip } = labelGrouped;
    map.set(key, {
      name:
        getValue(name) ||
        getDefaultName(description) ||
        getDefaultName(ubertip),
      description: getValue(description) || getValue(ubertip),
    });
  }
  return map;
}

export function getStringsById(strings: Line<WC3String>[]) {
  const map = new Map<number, string>();
  for (const line of strings) {
    if (line.data) {
      map.set(line.data.stringId, line.data.text);
    }
  }
  return map;
}
