import { Line } from "./Line";

export interface Matcher<LineMatch extends unknown, DataType extends unknown> {
  name: string;
  match: (line: string) => LineMatch | null;
  factory: (matches: LineMatch) => DataType;
  cacheKey: string;
  getId: (line: Line<DataType>) => string;
}

export class Matchers<LineMatch extends unknown> {
  private matchers: Matcher<LineMatch, any>[] = [];

  register<DataType extends unknown>(
    matcher: Matcher<LineMatch, DataType>
  ): void {
    this.matchers.push(matcher);
  }

  registerAll(matchers: Matcher<LineMatch, any>[]): void {
    matchers.forEach((x) => this.register(x));
  }

  match(lines: string[]) {
    const matcherResults = new Map<string, Map<string, Line<unknown>>>();
    for (const matcher of this.matchers) {
      const matchedData = new Map<string, Line<unknown>>();
      matcherResults.set(matcher.name, matchedData);
      for (const line of lines) {
        const matched = matcher.match(line);
        if (matched !== null) {
          const item = new Line(line, matcher.name);
          const matcherDataObject = matcher.factory(matched);
          item.setData(matcherDataObject);
          if (item instanceof Line) {
            matchedData.set(matcher.getId(item), item);
          }
        }
      }
    }
    return matcherResults;
  }
}
