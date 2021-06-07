import { Command, flags } from "@oclif/command";
import { resolve } from "path";

import { existsSync } from "fs";
class EtalesDbUpdater extends Command {
  static description = "describe the command here";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    map: flags.string({ char: "m", description: "path to w3c map" }),
    updatedVersion: flags.string({ char: "u", description: "new map version" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "mapPath" }];

  async run() {
    const { args } = this.parse(EtalesDbUpdater);

    const mapPath = resolve(args.mapPath);
    if (!existsSync(mapPath)) {
      this.error(`Provided path to the map of ${args.mapPath} does not exist.`);
    }
  }
}

export = EtalesDbUpdater;
