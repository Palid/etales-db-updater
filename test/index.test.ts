import { expect } from "@oclif/test";
import { stdout } from "stdout-stderr";

import cmd = require("../src");

// Not using @oclif/test, as it doesn't work well with wallabyjs and watch.
// It's not that useful anyways, just abstracts into more declarative tests, but this way I have much more control over my tests.

describe("cli", () => {
  beforeEach(() => {
    stdout.start();
  });
  afterEach(() => {
    stdout.stop();
  });

  it("should throw an error if file is not found", async () => {
    // eslint-disable-next-line no-undef-init
    let shouldHaveError: Error | undefined;
    try {
      await cmd.run(["./mocks/file-not-existing.txt"]);
    } catch (error) {
      shouldHaveError = error;
      expect(error.message).to.equal(
        "Provided path to the map of ./mocks/file-not-existing.txt does not exist."
      );
    }
    expect(shouldHaveError).not.to.be.undefined;
  });
});
