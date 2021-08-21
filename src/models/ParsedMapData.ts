import { Line } from "../matchers/Line";
import type { MPQMapData } from "mpq-reader";
import {
  CreepTypeMatcher,
  GameObjectData,
  ItemMatcher,
} from "../matchers/jass/GameObjectMatcher";
import {
  ItemDropData,
  ItemDropMatcher,
} from "../matchers/jass/ItemDropMatcher";
import { Matchers } from "../matchers/jass/Matcher";
import { getStringsById, matchStringsLines } from "../matchers/StringMatcher";
import { ObjectsObject } from "war3map";
import { IDS_MAPPING } from "./War3Types";

export class ParsedMapData {
  itemDropData: Map<string, Line<ItemDropData>>;
  items: Map<string, Line<GameObjectData>>;
  creepTypes: Map<string, Line<GameObjectData>>;
  strings: Map<number, string>;
  mpq: {
    items: ObjectsObject;
    units: ObjectsObject;
  };

  constructor(mpq: MPQMapData) {
    const { itemDrop, item, creepType } = this.parseJass(mpq.jass);

    this.itemDropData = itemDrop;
    this.items = item;
    this.creepTypes = creepType;

    this.strings = this.parseStrings(mpq.strings);
    this.mpq = {
      items: mpq.items,
      units: mpq.units,
    };
  }

  private parseJass(jass: string) {
    const lines = jass.split("\n");
    const matchers = new Matchers<RegExpMatchArray>([
      // HeroMatcher,
      // UnitMatcher,
      ItemMatcher,
      ItemDropMatcher,
      CreepTypeMatcher,
    ]);

    const matched = matchers.match(lines);
    const itemDrop = matched.get("itemDrop")! as any as Map<
      string,
      Line<ItemDropData>
    >;
    const item = matched.get("item")! as any as Map<
      string,
      Line<GameObjectData>
    >;
    const creepType = matched.get("creepType")! as any as Map<
      string,
      Line<GameObjectData>
    >;
    return {
      itemDrop,
      item,
      creepType,
    };
  }

  private parseStrings(strings: string) {
    const lines = matchStringsLines(strings);
    const stringsById = getStringsById(lines);
    return stringsById;
  }

  public getMergedValues<T extends unknown>(
    key: "items" | "units"
  ): Map<string, T> {
    const data = new Map<string, T>();
    for (const value of this.mpq[key].customObjects) {
      const id = value.newID;
      const newItem: any = {
        id,
      };
      const modifications = new Map<string, string | number>();
      for (const modification of value.modifications) {
        const mapped = IDS_MAPPING[modification.id];
        if (mapped) {
          const { name, mapper } = mapped;
          modifications.set(name, mapper(modification.value, this.strings));
        }
      }

      for (const [k, v] of modifications.entries()) {
        const key = k as keyof T;
        switch (key) {
          case "icon":
            newItem[key] = (v as string).replace(
              /ReplaceableTextures\\\\CommandButtons\\\\.*/,
              ""
            );
            break;
          default:
            newItem[key] = v;
            break;
        }
      }
      data.set(id, newItem);
    }

    return data;
  }
}
