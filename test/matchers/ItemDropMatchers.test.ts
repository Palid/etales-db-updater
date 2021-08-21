import { expect } from "chai";

import { ItemDropMatcher } from "../../src/matchers/jass/ItemDropMatcher";

describe("ItemDropMatcher", () => {
  const TEST_STRING =
    "call SetUnitDrop(1 , 73 , 1000 , 0 , 928 , 0 , 0 , 0 , 88)";
  const TEST_STRING_2 =
    "call SetUnitDrop(250 , 90 , 0 , 87 , 0 , 353 , 819 , 86 , 88)";
  it("matches drop items", () => {
    const match = ItemDropMatcher.match(TEST_STRING);
    expect(match).not.to.equal(null);
    expect(match![0]).to.equal(TEST_STRING);
    const match2 = ItemDropMatcher.match(TEST_STRING_2);
    expect(match2).not.to.equal(null);
    expect(match2![0]).to.equal(TEST_STRING_2);
  });
});
