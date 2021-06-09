import { expect } from "chai";

import {
  matchSingleString,
  matchStringsLines,
  WC3String,
} from "../../src/matchers/StringMatcher";

const tNoComment = `STRING 4
{
Enthashara´s Tales ORPG  v1.3.4
}`;

const t1 = `STRING 574
// Items: I00C (|cffff8c00Emperor´s Chest|r), Ubertip (Tooltip - Extended)
{
You will receive a special gift
}`;
const t3 = `
STRING 402
// Abilities: A06K (Thief Abilities), Ubertip (Tooltip - Normal - Extended)
{
All skills from previous class are available on level 10.
}

STRING 403
// Doodads: D028 (Borderwall), Name (Name)
{
Borderwall
}

STRING 404
// Doodads: D029 (piso), Name (Name)
{
piso
}

STRING 405
// Destructibles: B00G (invi), Name (Name)
{
invi
}

STRING 406
// Units: h009 (Villager citizen), Name (Name)
{
Villager citizen
}

`;

describe("StringMatcher", () => {
  it("should match strings correctly for a stringline with comment", () => {
    const matched = matchSingleString(t1);
    const stringMatcher = new WC3String(matched);
    expect(stringMatcher.text).to.equal("You will receive a special gift");
    expect(stringMatcher.stringId).to.equal(574);
    expect(stringMatcher.object).not.to.equal(undefined);
    expect(stringMatcher.object!.type).to.equal("item");
    expect(stringMatcher.object!.id).to.equal("I00C");
  });

  it("should match strings correctly for a stringline without comment", () => {
    const matched = matchSingleString(tNoComment);
    const stringMatcher = new WC3String(matched);
    expect(stringMatcher.text).to.equal("Enthashara´s Tales ORPG  v1.3.4");
    expect(stringMatcher.stringId).to.equal(4);
    expect(stringMatcher.object).to.equal(undefined);
  });

  it("should properly match unparsed strings as a list", () => {
    const matched = matchStringsLines(t3);
    expect(matched.length).to.equal(6);
  });
});
