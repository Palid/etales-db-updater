import { expect } from "chai";

import {
  ItemMatcher,
  HeroMatcher,
  UnitMatcher,
  gameObjectFactory,
  splitNameFromLevel,
} from "../../src/matchers/jass/GameObjectMatcher";

describe("GameObjectMatchers utils", () => {
  it("splitNameFromLevel should properly translate item string", () => {
    const TEST_STRING = "Stick Bead lvl 5403 )'";
    const [name, level] = splitNameFromLevel(TEST_STRING);
    expect(name).to.equal("Stick Bead");
    expect(level).to.equal(5403);
  });
  it('splitNameFromLevel should properly translate unit string with level writen as "lev"', () => {
    const TEST_STRING = "Servant lev 50";
    const [name, level] = splitNameFromLevel(TEST_STRING);
    expect(name).to.equal("Servant");
    expect(level).to.equal(50);
  });
  it('splitNameFromLevel should properly translate unit string with level written as "lvl"', () => {
    const TEST_STRING = "Centaur Outrunner Lvl 28";
    const [name, level] = splitNameFromLevel(TEST_STRING);
    expect(name).to.equal("Centaur Outrunner");
    expect(level).to.equal(28);
  });
  it('splitNameFromLevel should properly translate unit string with level written as "level"', () => {
    const TEST_STRING = "Returned level 23";
    const [name, level] = splitNameFromLevel(TEST_STRING);
    expect(name).to.equal("Returned");
    expect(level).to.equal(23);
  });

  it("splitNameFromLevel should account BOSS suffix as part of the name", () => {
    const TEST_STRING = "Magnataur Destroyer BOSS lev 58";
    const [name, level] = splitNameFromLevel(TEST_STRING);
    expect(name).to.equal("Magnataur Destroyer BOSS");
    expect(level).to.equal(58);
  });

  it("splitNameFromLevel should account (BOSS) suffix as part of the name", () => {
    const TEST_STRING = "Bansee (BOSS)";
    const [name, level] = splitNameFromLevel(TEST_STRING);
    expect(name).to.equal("Bansee (BOSS)");
    expect(level).to.equal(undefined);
  });
});

describe("GameObjectMatchers factory", () => {
  it("should use the same factory for all GameObjectMatchers", () => {
    expect(ItemMatcher.factory).to.equal(gameObjectFactory);
    expect(HeroMatcher.factory).to.equal(gameObjectFactory);
    expect(UnitMatcher.factory).to.equal(gameObjectFactory);
  });
  it("should get return a data object with keys of [name, id, objectId, level]", () => {
    const TEST_STRING =
      'set udg_itmpool[986]=1227901255 //Stick Bead lvl 5403" )';
    const matches = ItemMatcher.match(TEST_STRING);
    expect(matches).not.to.equal(null);
    const dataObject = gameObjectFactory(matches!);
    expect(dataObject).to.deep.equal({
      id: 986,
      objectId: "1227901255",
      name: "Stick Bead",
      level: 5403,
    });
  });
});

describe("ItemMatcher", () => {
  const TEST_STRING =
    'set udg_itmpool[986]=1227901255 //Stick Bead lvl 5403" )';
  it("properly matches item string", () => {
    const match = ItemMatcher.match(TEST_STRING);
    expect(match).not.to.equal(null);
    const [line, id, objectId, rest] = match!;
    expect(line).to.equal(TEST_STRING);
    expect(id).to.equal("986");
    expect(objectId).to.equal("1227901255");
    expect(rest).to.equal('Stick Bead lvl 5403" )');
  });
});

describe("UnitMatcher", () => {
  it('properly matches teststring with "lvl"', () => {
    const testString = "set udg_CreepType[2]=1848651830 //Tester Lvl 82";
    const match = UnitMatcher.match(testString);
    expect(match).not.to.equal(null);
    const [line, id, objectId, rest] = match!;
    expect(line).to.equal(testString);
    expect(id).to.equal("2");
    expect(objectId).to.equal("1848651830");
    expect(rest).to.equal("Tester Lvl 82");
  });
  it('properly matches teststring with "level"', () => {
    const testString = "set udg_CreepType[102]='n03D' //Returned level 23";
    const match = UnitMatcher.match(testString);
    expect(match).not.to.equal(null);
    const [line, id, objectId, rest] = match!;
    expect(line).to.equal(testString);
    expect(id).to.equal("102");
    expect(objectId).to.equal("n03D");
    expect(rest).to.equal("Returned level 23");
  });
  it('properly matches teststring with "lev"', () => {
    const testString = "set udg_CreepType[110]='n03Q' //Bandit Lord Lev 52";
    const match = UnitMatcher.match(testString);
    expect(match).not.to.equal(null);
    const [line, id, objectId, rest] = match!;
    expect(line).to.equal(testString);
    expect(id).to.equal("110");
    expect(objectId).to.equal("n03Q");
    expect(rest).to.equal("Bandit Lord Lev 52");
  });
});

describe("HeroMatcher", () => {
  it("properly matches hero strings", () => {
    const testString = "set udg_HeroPool[1]='N009' //Dark Ranger";
    const match = HeroMatcher.match(testString);
    expect(match).not.to.equal(null);
    const [line, id, objectId, rest] = match!;
    expect(line).to.equal(testString);
    expect(id).to.equal("1");
    expect(objectId).to.equal("N009");
    expect(rest).to.equal("Dark Ranger");
  });
});
