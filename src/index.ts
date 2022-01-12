import "./env";

import { Command, flags } from "@oclif/command";
import { resolve } from "path";

import { existsSync, writeFileSync } from "fs";
// import { initFirebase } from "./firebase/firebase";
// import { populateItems } from "./firebase/models/ItemCollections";

class EtalesDbUpdater extends Command {
  static description =
    "Unpack wc3 map file and update the the provided database with items";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    updatedVersion: flags.string({ char: "u", description: "new map version" }),
    // Should show additional debug informations?
    debug: flags.boolean({ char: "d", default: false }),
    csv: flags.boolean({ char: "c", default: false }),
  };

  static args = [{ name: "mapPath" }];

  private IS_DEBUG = process.env.debug !== undefined || false;

  async run(): Promise<void> {
    const { args, flags } = this.parse(EtalesDbUpdater);

    this.IS_DEBUG = flags.debug;

    const mapPath = resolve(args.mapPath);
    if (!existsSync(mapPath)) {
      this.error(`Provided path to the map of ${args.mapPath} does not exist.`);
    }

    const { read } = await import("./mpq-reader");
    const mpq = await read(mapPath);

    const { ParsedMapData } = await import("./models/ParsedMapData");
    const parsedMapData = new ParsedMapData(mpq);

    // Don't save data to firebase if we're in the tests environment
    if (process.env.TESTING === undefined) {
      this.log("Initializing firestore.");
      // initFirebase();
      // const units = parsedMapData.getMergedValues("units");
      // console.log(units);

      // await populateItems(parsedMapData);
    }
    if (flags.csv) {
      const { toCsv } = await import("./to-csv");
      const items = parsedMapData.getMergedValues("items");
      const parsed = toCsv(items);
      writeFileSync(resolve(__dirname, "../unpacked/items.csv"), parsed);
    }
  }
}

export = EtalesDbUpdater;
