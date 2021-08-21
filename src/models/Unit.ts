import { ItemDropData } from "matchers/jass/ItemDropMatcher";
import { ObjectsObject } from "war3map";

type UnitFactoryArguments = {
  itemDrop: Map<string, ItemDropData>;
  itemObjects: ObjectsObject;
  unitObjects: ObjectsObject;
  strings: Map<number, string>;
};

// export function UnitFactory({
//   itemDrop,
//   itemObjects,
//   unitObjects,
//   strings,
// }: UnitFactoryArguments) {}
