import { Matchups, PokeTypes } from "../customTypes"

export default function Results({
  currTypes, 
  pokeMatchups
}: {
  currTypes: PokeTypes[],
  pokeMatchups: Matchups
}) {
  return(
    <> 
    <code>
        <h1 style={{ margin: 0, padding: 0 }}>
          {currTypes[0] ? currTypes : "none"}
        </h1>
        {Object.entries(pokeMatchups).map(([matchup, types], i) => (
          <div key={i}>
            {matchup}: {types.join(", ")}
          </div>
        ))}
      </code>
    </>
  )
}