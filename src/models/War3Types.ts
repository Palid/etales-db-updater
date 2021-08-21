type MappingType = Record<
  string,
  {
    name: string;
    mapper: (v: any, strings: Map<number, string>) => any;
  }
>;

function mapStringIdToId(
  triggerId: string,
  strings: Map<number, string>
): string {
  return (
    strings.get(
      parseInt(triggerId.replace("TRIGSTR_", "").replace("TRIGSTR_ID", ""), 10)
    ) || ""
  );
}

export const noopMapper = (value: any) => value;
export const IDS_MAPPING: MappingType = {
  unam: {
    name: "name",
    mapper: mapStringIdToId,
  }, // as TRIGSTR_{ID}, need to get it from the strings
  ides: {
    name: "description",
    mapper: mapStringIdToId,
  }, // as TRIGSTR_{ID}, need to get it from the strings
  utip: {
    name: "tooltip",
    mapper: mapStringIdToId,
  }, // as TRIGSTR_{ID}, need to get it from the strings,
  utub: {
    name: "ubertooltip",
    mapper: mapStringIdToId,
  }, // as TRIGSTR_{ID}, need to get it from the strings,
  iico: {
    name: "icon",
    mapper: noopMapper,
  },
  ilev: {
    name: "level",
    mapper: noopMapper,
  },
  ifil: {
    name: "model",
    mapper: noopMapper,
  },
  igol: {
    name: "price",
    mapper: noopMapper,
  },
  // UNUSED
  // iabi: {
  //   name: "abilities",
  //   mapper: noopMapper,
  // },
};
