import './env'

import { Command, flags } from "@oclif/command";
import { resolve } from "path";

import { existsSync } from "fs";
import {
  getItemsMapById,
  getItemDropsMapByItemId,
  FirebaseItemsCollection,
  FirebaseItemDropsByIdCollection,
} from "./models/Item";
import { ParsedMapData } from "./models/ParsedMapData";
import { initFirebase } from "./firebase/firebase";
import { set } from "typesaurus";


class EtalesDbUpdater extends Command {
  static description =
    "Unpack wc3 map file and update the the provided database with items";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    mapPath: flags.string({ char: "m", description: "path to w3c map" }),
    updatedVersion: flags.string({ char: "u", description: "new map version" }),
    // Should show additional debug informations?
    debug: flags.boolean({ char: "d", default: false }),
  };

  static args = [{ name: "mapPath" }];

  private IS_DEBUG = process.env.debug !== undefined || false;

  async run() {
    const { args, flags } = this.parse(EtalesDbUpdater);

    this.IS_DEBUG = flags.debug;

    const mapPath = resolve(args.mapPath);
    if (!existsSync(mapPath)) {
      this.error(`Provided path to the map of ${args.mapPath} does not exist.`);
    }

    const { read } = await import('./mpq-reader')

  const mpq = await read(mapPath);
    const parsedMapData = new ParsedMapData(mpq);

    const items = getItemsMapById(parsedMapData);
    const itemDropsByItemId = getItemDropsMapByItemId(parsedMapData);

    // Don't save data to firebase if we're in the tests environment
    if (process.env.TESTING !== "1") {
      this.log("Initializing firestore.");
      initFirebase();
      this.log("Writing all the items to the firestore.");
      items.forEach((item) => {
        if (item.id) {
          set(FirebaseItemsCollection, item.id, {...item});
        }
      });
      for (const [id, items] of itemDropsByItemId.entries()) {
        set(FirebaseItemDropsByIdCollection, id, [...items.map(x => ({...x}))]);
      }
    }
  }

}

export = EtalesDbUpdater;
