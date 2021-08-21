import { groupBy } from "lodash/fp";

import { ParsedMapData } from "./ParsedMapData";
import { ItemDropData } from "../matchers/jass/ItemDropMatcher";
import { Line } from "../matchers/Line";

export interface DropBy {
  unitId: string;
  rate: number;
}

export interface Item extends Record<string, any> {
  id: string;
  name: string;
  tooltip: string;
  // same as ubertooltip
  description: string;
  // same as description
  ubertooltip: string;
  price: number;
  icon: string;
  level: number;
  dropsBy: DropBy[];
}

type JassifiedItemDrop = {
  jassUnitId: string;
  jassItemId: string;
  rate: number;
};

const groupFormattedItems = groupBy((x: JassifiedItemDrop) => x.jassItemId);

export interface ItemDropWithProperIds extends DropBy {
  itemId: string;
}

function mapItemDrops(itemDropData: Map<string, Line<ItemDropData>>) {
  const drops: JassifiedItemDrop[] = [];
  for (const line of itemDropData.values()) {
    const { data } = line;
    if (!data?.drops) break;
    for (const drop of data.drops) {
      drops.push({
        jassUnitId: data.unitId,
        rate: drop.rate,
        jassItemId: drop.itemId,
      });
    }
  }
  return drops;
}

export function getItemDropsMapByItemId(
  parsedMapData: ParsedMapData
): Map<string, ItemDropWithProperIds[]> {
  const drops = mapItemDrops(parsedMapData.itemDropData);
  // eslint-disable-next-line no-warning-comments
  // TODO: Hardcode 1000 for fragment and 1100 for gem, random versions of gems and gem fragments
  const grouped = groupFormattedItems(drops);
  const dropsByItemId = new Map<string, ItemDropWithProperIds[]>();
  for (const [id, item] of parsedMapData.items) {
    const i = grouped[id];
    const realId = item.data?.objectId;
    if (realId && i) {
      const elements: Array<ItemDropWithProperIds | undefined> = i.map((x) => {
        const unitId = parsedMapData.creepTypes.get(x.jassUnitId)?.data
          ?.objectId;
        const itemId = item.data?.objectId;
        if (unitId && itemId) {
          return {
            unitId: unitId,
            itemId: itemId,
            rate: x.rate,
          };
        }
        return undefined;
      });
      dropsByItemId.set(
        realId,
        elements.filter((x) => x) as Array<ItemDropWithProperIds>
      );
    }
  }
  return dropsByItemId;
}
