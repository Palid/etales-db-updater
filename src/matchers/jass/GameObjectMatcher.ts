import { capitalize } from "lodash";
import { Line } from "../Line";
import { Matcher } from "./Matcher";

export type GameObjectData = {
  name: string;
  id: string;
  objectId: string;
  level?: number;
};

const replacer = /lvl|level|lev/gi;
const splitBy = /([a-zA-Z0-9| ]+)  ?([\d]+)/i;

export function splitNameFromLevel(
  nameWithLevel: string
): [string, number | undefined] {
  const cleanedNamed = nameWithLevel.replaceAll(replacer, "");
  const results = cleanedNamed.trim().split(splitBy);
  if (results.length === 1) {
    return [results[0].trim(), undefined];
  }
  // First one is invalid here
  const [, name, level] = results;
  return [name.trim(), level ? parseInt(level.trim(), 10) : undefined];
}

/**
 * Keys for GameObjectData:
 *  name: string;
 *  id: number;
 *  objectId: string;
 *  level?: number;
 */

export function gameObjectFactory(matches: RegExpMatchArray): GameObjectData {
  const [, id, objectId, nameWithLevel] = matches;
  const [name, level] = splitNameFromLevel(nameWithLevel);
  const objectName = name
    .split(" ")
    .map((x) => capitalize(x))
    .join(" ");
  return {
    name: objectName,
    id: id,
    objectId: objectId.replaceAll("'", ""),
    level,
  };
}

function getId(line: Line<GameObjectData>): string {
  return line.data!.id!.toString();
}

/**
 * If CreepType doesn't have a level it means that it's a Hero unit, a playable hero
 * so it can be counted differently.
 * TODO: Probably take care of that later?
 */
const unitRe = /set udg_CreepType\[(.*)\]='?([\da-zA-Z]+)'? * \/\/(.*)/;

// Quest monster regex
// TODO: handle this in the future
// const unitMonsterRe = /set s__monster\[(.*)\]='?([\da-zA-Z]+)'? * \/\/(.*)/;

export const UnitMatcher: Matcher<RegExpMatchArray, GameObjectData> = {
  name: "unit",
  match: (x) => x.match(unitRe),
  factory: gameObjectFactory,
  getId,
};

const heroRe = /set udg_HeroPool\[(.*)\]='?([\da-zA-Z]+)'? * \/\/(.*)/;

export const HeroMatcher: Matcher<RegExpMatchArray, GameObjectData> = {
  name: "hero",
  match: (x) => x.match(heroRe),
  factory: gameObjectFactory,
  getId,
};

const itemRe = /set udg_itmpool\[(.*)\]='?([\da-zA-Z]+)'? * \/\/(.*)/;
export const ItemMatcher: Matcher<RegExpMatchArray, GameObjectData> = {
  name: "item",
  match: (x) => x.match(itemRe),
  factory: gameObjectFactory,
  getId,
};

const creepTypeRe = /set udg_CreepType\[(.*)\]='?([\da-zA-Z]+)'? * \/\/(.*)/;
export const CreepTypeMatcher: Matcher<RegExpMatchArray, GameObjectData> = {
  name: "creepType",
  match: (x) => x.match(creepTypeRe),
  factory: gameObjectFactory,
  getId,
};
