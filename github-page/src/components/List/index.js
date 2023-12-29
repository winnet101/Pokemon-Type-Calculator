import styles from "./list.module.css";
import ListItem from "../ListItem";

export default function List(index) {
  const itemArray = Array(5).fill(0);

  return (
    <ol>
      {itemArray.map((el, i) =>
        <li>
          <ListItem key={i} index={i} /> 
        </li> 
      )}
    </ol>
  );
  
}