import { ObjectsObject } from "war3map";
import { dirname, basename } from "path";

import { TextDecoder } from "util";

const { FS, MPQ } = require("@wowserhq/stormjs");

export const files = {
  strings: "war3map.wts",
  jass: "war3map.j",
  items: "war3map.w3t",
  units: "war3map.w3u",
};

export class MPQMapData {
  strings: string;
  jass: string;
  items: ObjectsObject;
  units: ObjectsObject;

  constructor(results: Map<string, Uint8Array>) {
    const { strings, jass, items, units } = this.decode(results);
    this.strings = strings;
    this.jass = jass;
    this.items = items;
    this.units = units;
  }

  private decode(results: Map<string, Uint8Array>) {
    const decoder = new TextDecoder("utf-8");
    const items = Buffer.from(results.get("items") ?? new Uint8Array());
    const war3Items = new ObjectsObject(false);
    war3Items.read(items);
    const units = Buffer.from(results.get("units") ?? new Uint8Array());
    const war3Units = new ObjectsObject(false);
    war3Units.read(units);
    return {
      strings: decoder.decode(results.get("strings")),
      jass: decoder.decode(results.get("jass")),
      items: war3Items,
      units: war3Units,
    };
  }
}

type WC3MapKey = "items" | "units" | "strings" | "jass";

export async function read(pathToMap: string) {
  const dir = dirname(pathToMap);
  const fileName = basename(pathToMap);
  FS.mkdir("/stormjs");
  FS.mount(FS.filesystems.NODEFS, { root: dir }, `/stormjs/`);
  const results = new Map<"items" | "units" | "strings" | "jass", Uint8Array>();
  // This __should__ work on windows, but need to double check it.
  const mpq = await MPQ.open(`/stormjs/${fileName}`, "r");
  for (const [name, fileName] of Object.entries(files)) {
    const file = mpq.openFile(fileName);
    const data: Uint8Array = file.read();
    // Copy the data, as the library returns the same Uint8Array object
    results.set(name as WC3MapKey, data.slice(0));
    file.close();
  }
  mpq.close();
  FS.unmount("/stormjs");
  FS.rmdir("/stormjs");

  const mpqMapData = new MPQMapData(results);
  return mpqMapData;
}
