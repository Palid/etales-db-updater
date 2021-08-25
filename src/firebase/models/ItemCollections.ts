/* eslint-disable no-console */
import {
  getItemDropsMapByItemId,
  Item,
  ItemDropWithProperIds,
} from "../../models/Item";
import { ParsedMapData } from "models/ParsedMapData";
import { Collection, collection, set, subcollection } from "typesaurus";

// export const FirebaseItemsCollection = collection<Partial<Item>>("items");
// export const FirebaseItemDropsByIdCollection =
//   collection<ItemDropWithProperIds[]>("itemDropByItemId");

function setItemsFromMap<T>(
  collection: Collection<T>,
  data: Map<string, T>
): Array<Promise<void>> {
  const results: Array<Promise<void>> = [];
  for (const [id, entry] of data.entries()) {
    if (id) {
      console.log(`Saving firebase entry for ${collection.path} with ${id}`);
      results.push(set(collection, id, { ...entry }));
    } else {
      // eslint-disable-next-line no-console
      console.log(`Ignoring data object of ${entry}`);
    }
  }
  return results;
}

export async function populateItems(parsedMapData: ParsedMapData) {
  const items = parsedMapData.getMergedValues("items");

  const ItemsCollection = collection<Partial<Item>>("items");

  try {
    console.time(`Creating entries for ${ItemsCollection.path}`);
    await Promise.all(setItemsFromMap(ItemsCollection, items));
    console.timeEnd(`Creating entries for ${ItemsCollection.path}`);
  } catch (error) {
    throw new Error(error);
  }

  const itemDropsByItemId = getItemDropsMapByItemId(parsedMapData);
  for (const id of items.keys()) {
    const drops = itemDropsByItemId.get(id);
    if (drops) {
      const dropsSubCollection = subcollection<
        ItemDropWithProperIds,
        Partial<Item>
      >("drops-by-unit-id", ItemsCollection);
      const dropsMap = new Map(
        drops.map((drop) => [
          drop.unitId,
          {
            unitId: drop.unitId,
            rate: drop.rate,
            itemId: drop.itemId,
          },
        ])
      );
      const col = dropsSubCollection(id);
      try {
        console.time(`Creating entries for ${col.path}`);

        // eslint-disable-next-line no-await-in-loop
        await Promise.all(setItemsFromMap(col, dropsMap));
        console.timeEnd(`Creating entries for ${col.path}`);
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}
