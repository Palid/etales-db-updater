import { Line } from "./Line";
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
// const dropRates = [0.2, 0.15, 0.1, 0.07, 0.03, 0.01, 0.005, 0.001];

export type ItemDropData = {
  unitId: number;
  twenty: number;
  fifteen: number;
  ten: number;
  seven: number;
  three: number;
  one: number;
  half: number;
  tenth: number;
};

const dropRe = /call SetUnitDrop ?\((\d+ *, *)+\d+\)/g;
export const ItemDropMatcher: Matcher<RegExpMatchArray, ItemDropData> = {
  name: "itemDrop",
  cacheKey: "itemDrop",
  getId: (line: Line<ItemDropData>) => line.data!.unitId.toString(),
  match: (line) => line.match(dropRe),
  factory: (matches) => {
    const [line] = matches;
    const allMatches = Array.from(line.matchAll(/(\d+)/g));
    const ids = allMatches.map(([id]) => id);
    const [unitId, twenty, fifteen, ten, seven, three, one, half, tenth] = ids;
    const values = {
      unitId,
      twenty,
      fifteen,
      ten,
      seven,
      three,
      one,
      half,
      tenth,
    } as any;
    const keys = Object.keys(values);
    for (const key of keys) {
      values[key] = parseInt(values[key], 10);
    }
    return values;
  },
};
