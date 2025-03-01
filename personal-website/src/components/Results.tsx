import { Matchups, PokeTypes } from "../types";
import styles from "../styles/Results.module.css";

export default function Results({
  currTypes,
  pokeMatchups,
}: {
  currTypes: PokeTypes[];
  pokeMatchups: Matchups;
}) {
  return (
    <div className={styles.resultsContainer}>
      <div className={styles.selectedTypes}>
        <h1>{currTypes[0] ? currTypes.join(" / ") : "No Type Selected"}</h1>
      </div>
      <div className={styles.matchupsGrid}>
        {Object.entries(pokeMatchups).map(([matchup, types], i) => (
          <div
            key={i}
            className={`${styles.matchupCard} ${styles[matchup.toLowerCase()]}`}
          >
            <h3 className={styles.matchupTitle}>
              {matchup.replaceAll("_", "-")}
            </h3>
            <div className={styles.typesList}>{types.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className={styles.resultsContainer}>
      <div className={styles.selectedTypes}>
        <h1>Loading...</h1>
      </div>
      <div className={styles.matchupsGrid}>
        {[0, 0, 0, 0, 0].map((_el, i) => (
          <div
            key={i}
            className={`${styles.matchupCard}`}
          >
            <h3 className={styles.matchupTitle}>
              Loading...
            </h3>
            <div className={styles.typesList}>Loading...</div>
          </div>
        ))}
      </div>
    </div>
  );
}