type MappingType = Record<
  string,
  {
    name: string;
    mapper: (v: any, strings: Map<number, string>) => any;
  }
>;

function stringsMapper(
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

export const COMMON_IDS_MAPPINGS: MappingType = {
  unam: {
    name: "name",
    mapper: stringsMapper,
  }, // as TRIGSTR_{ID}, need to get it from the strings
  ides: {
    name: "description",
    mapper: stringsMapper,
  }, // as TRIGSTR_{ID}, need to get it from the strings
  utip: {
    name: "tooltip",
    mapper: stringsMapper,
  }, // as TRIGSTR_{ID}, need to get it from the strings,
  utub: {
    name: "ubertooltip",
    mapper: stringsMapper,
  }, // as TRIGSTR_{ID}, need to get it from the strings,
};

export const ITEMS_IDS_MAPPINGS: MappingType = {
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

export const UNITS_IDS_MAPPING: MappingType = {
  // Names
  unsf: {
    name: "editorSuffix",
    mapper: stringsMapper,
  },
  upro: {
    name: "properNames",
    mapper: stringsMapper,
  },
  // Stats
  ulev: {
    name: "level",
    mapper: noopMapper,
  },
  udef: {
    name: "defense",
    mapper: noopMapper,
  },
  udty: {
    name: "armorType",
    mapper: noopMapper,
  },
  utyp: {
    name: "unitType",
    mapper: noopMapper,
  },
  ua1t: {
    name: "attackType",
    mapper: noopMapper,
  },
  uhpm: {
    name: "maxHp",
    mapper: noopMapper,
  },
  umpm: {
    name: "maxMp",
    mapper: noopMapper,
  },
  ustr: {
    name: "strength",
    mapper: noopMapper,
  },
  uagi: {
    name: "agility",
    mapper: noopMapper,
  },
  uint: {
    name: "intelligence",
    mapper: noopMapper,
  },
  umvs: {
    name: "movementSpeed",
    mapper: noopMapper,
  },
  umvt: {
    name: "movementType",
    mapper: noopMapper,
  },
  // Rendering
  usnd: {
    name: "baseModel",
    mapper: noopMapper,
  },
  // Is creeps, unused
  // urac: {
  //   name: 'controlledBy',
  //   mapper: noopMapper,
  // },
  // uabi: {
  //   name: "abilities",
  //   mapper: noopMapper,
  // }
};

export const IDS_MAPPING: MappingType = {
  ...COMMON_IDS_MAPPINGS,
  ...ITEMS_IDS_MAPPINGS,
  ...UNITS_IDS_MAPPING,
};
