export type MapData = Record<string | number, string | number | undefined>;

export class Line<DataType extends unknown> {
  line: string;
  matcher: string;
  data?: DataType;

  constructor(line: string, matcher: string) {
    this.line = line;
    this.matcher = matcher;
  }

  setData(data: DataType) {
    this.data = data;
    return this;
  }

  toJSON() {
    return this.data || {};
  }
}
