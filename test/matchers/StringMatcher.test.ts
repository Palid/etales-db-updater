import { expect } from "chai";

import { StringMatcher, WC3String } from "../../src/matchers/StringMatcher";

const tNoComment = `STRING 4
{
Enthashara´s Tales ORPG  v1.3.4
}`;

const t1 = `STRING 574
// Items: I00C (|cffff8c00Emperor´s Chest|r), Ubertip (Tooltip - Extended)
{
You will receive a special gift
}`;
// const t2 = `STRING 575
// // Abilities: A069 (Static Wave), Researchubertip (Tooltip - Learn - Extended)
// {
// Sends a lightning ball to damage enemies.
// }`;
// const t3 = `STRING 576
// // Abilities: A069 (Static Wave), Tip (Tooltip - Normal)
// {
// Static |cffffcc00W|rave - [|cffffcc00Level 10|r]
// }`;
// const t5 = `STRING 577
// // Abilities: A073 (Static Wave), Ubertip (Tooltip - Normal - Extended)
// {
// Sends a lightning ball to deals <A073,DataA1> damage to each enemy unit in a cone.
// }`;
// const t6 = `STRING 578
// // Items: I00D (|cffff8c00Legendary Chest|r), Ubertip (Tooltip - Extended)
// {
// You will receive a special gift
// }`;

describe("StringMatcher", () => {
  it("should match strings correctly for a stringline with comment", () => {
    const match = StringMatcher.match(t1);
    const stringMatcher = new WC3String(match!);
    expect(stringMatcher.text).to.equal("You will receive a special gift");
    expect(stringMatcher.stringId).to.equal(574);
    expect(stringMatcher.object).not.to.equal(undefined);
    expect(stringMatcher.object!.type).to.equal("item");
    expect(stringMatcher.object!.id).to.equal("I00C");
  });

  it("should match strings correctly for a stringline without comment", () => {
    const match = StringMatcher.match(tNoComment);
    const stringMatcher = new WC3String(match!);
    expect(stringMatcher.text).to.equal("Enthashara´s Tales ORPG  v1.3.4");
    expect(stringMatcher.stringId).to.equal(4);
    expect(stringMatcher.object).to.equal(undefined);
  });
});
