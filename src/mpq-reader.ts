// import * as war3map from "war3map";
import { resolve } from "path";

import { TextDecoder } from "util";

const { FS, MPQ } = require("@wowserhq/stormjs");

const stormPath = resolve(__dirname, "../../stormjs");

const files = {
  strings: "war3map.wts",
  jass: "war3map.j",
};

export async function read() {
  FS.mkdir("/stormjs");
  FS.mount(FS.filesystems.NODEFS, { root: stormPath }, "/stormjs");
  const results = new Map<string, string>();
  const decoder = new TextDecoder("utf-8");
  const mpq = await MPQ.open("/stormjs/mapfile/etales1.3.4fix.w3x", "r");
  for (const [name, fileName] of Object.entries(files)) {
    const file = mpq.openFile(fileName);
    const data = file.read();
    results.set(name, decoder.decode(data));
    file.close();
  }
  mpq.close();
  FS.unmount("/stormjs");
  FS.rmdir("/stormjs");

  const ret = {
    strings: results.get("strings") || "",
    jass: results.get("jass") || "",
  };
  return ret;
}
