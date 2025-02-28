const TYPE_LIST = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
] as const;

// type PokeType = typeof pokeTypesList;
// type PokeTypes = PokeType[number] (this works but makes all the intellisense look dumb)
type PokeTypes =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy";

type Matchups = {
  double_weak: PokeTypes[];
  weaknesses: PokeTypes[];
  strengths: PokeTypes[];
  double_strengths: PokeTypes[];
  nulls: PokeTypes[];
};

export { TYPE_LIST };
export type { Matchups, PokeTypes };
