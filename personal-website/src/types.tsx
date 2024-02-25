const pokeTypesList = [
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

type PokeType = typeof pokeTypesList;
type PokeTypes = PokeType[number];

/** A  simplified implementation of https://github.com/lokshunhung/pokeapi-types/blob/master/src/typedef/types.ts 's PokeAPI types. */
interface Type {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A detail of how effective this type is toward others and vice versa. */
  damage_relations: TypeRelations;
  /** [type simplified] A list of game indices relevant to this item by generation. */
  game_indices: number[];
  /** (Generation) The generation this type was introduced in. */
  generation: NamedAPIResource;
  /** (MoveDamageClass) The class of damage inflicted by this type. */
  move_damage_class: NamedAPIResource;
  /** [type simplified] The name of this resource listed in different languages. */
  names: string[];
  /**  [type simplified] A list of details of Pokémon that have this type. */
  pokemon: string[];
  /** (Move[]) A list of moves that have this type. */
  moves: NamedAPIResource[];
}

interface TypeRelations {
  /** (Type[]) A list of types this type has no effect on. */
  no_damage_to: NamedAPIResource[];
  /** (Type[]) A list of types this type is not very effect against. */
  half_damage_to: NamedAPIResource[];
  /** (Type[]) A list of types this type is very effect against. */
  double_damage_to: NamedAPIResource[];
  /** (Type[]) A list of types that have no effect on this type. */
  no_damage_from: NamedAPIResource[];
  /** (Type[]) A list of types that are not very effective against this type. */
  half_damage_from: NamedAPIResource[];
  /** (Type[]) A list of types that are very effective against this type. */
  double_damage_from: NamedAPIResource[];
}

interface NamedAPIResource {
  name: string,
  url: string
}

export type { PokeTypes, Type, TypeRelations, NamedAPIResource };
export { pokeTypesList };