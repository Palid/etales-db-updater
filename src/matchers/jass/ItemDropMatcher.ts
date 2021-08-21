import { Line } from "../Line";
import { Matcher } from "./Matcher";

// As of save informations, the data table for items is below
// We need to use only items from the udg_itmpool anyways, as it contains all the map's items.
//    set typesize[1]=421 //Artifact
//     set typesize[2]=351 //PERMANENT
//     set typesize[3]=301 //Miscelaneous
//     set typesize[4]=41 //Campaign
//     set typesize[5]=41 //charged
//     set typesize[6]=26 //Purchasable

/**
 * Drop rates table:
 * MEDIO_DROP - 20%
 * TERCIO_DROP - 15%
 * CUARTO_DROP - 10%
 * QUINTO_DROP - 7%
 * DECIMO_DROP - 3%
 * CINCO_DROP - 1%
 * UNO_DROP - 0.5%
 * MINIMO_DROP - 0.1%
 */
export interface ItemDrop {
  itemId: string;
  rate: number;
}
export type ItemDrops = [
  ItemDrop,
  ItemDrop,
  ItemDrop,
  ItemDrop,
  ItemDrop,
  ItemDrop,
  ItemDrop,
  ItemDrop
];
export type ItemDropData = {
  unitId: string;
  drops: ItemDrops;
};

const dropRe = /call SetUnitDrop ?\((\d+ *, *)+\d+\)/g;
export const ItemDropMatcher: Matcher<RegExpMatchArray, ItemDropData> = {
  name: "itemDrop",
  getId: (line: Line<ItemDropData>) => line.data!.unitId.toString(),
  match: (line) => line.match(dropRe),
  factory: (matches) => {
    const [line] = matches;
    const allMatches = Array.from(line.matchAll(/(\d+)/g));
    const ids = allMatches.map(([id]) => id);
    const [unitId, twenty, fifteen, ten, seven, three, one, half, tenth] = ids;
    const values: ItemDropData = {
      unitId: unitId,
      drops: [
        {
          itemId: twenty,
          rate: 0.2,
        },
        {
          itemId: fifteen,
          rate: 0.15,
        },
        {
          itemId: ten,
          rate: 0.1,
        },
        {
          itemId: seven,
          rate: 0.07,
        },
        {
          itemId: three,
          rate: 0.03,
        },
        {
          itemId: one,
          rate: 0.01,
        },
        {
          itemId: half,
          rate: 0.005,
        },
        {
          itemId: tenth,
          rate: 0.001,
        },
      ],
    };
    return values;
  },
};
