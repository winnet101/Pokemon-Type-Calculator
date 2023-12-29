import styles from "./listItem.module.css";
import useLocalStorage from "../../utils/useLocalStorage";
// import { Remarkable } from 'remarkable';

export default function ListItem({index}) {

   const [text, setText] = useLocalStorage(index, "");

   return(
      <input 
         className={styles.listItem}
         value={text}
         onChange={(e) => {
            setText(e.target.value)
         }}
      />
   )

}  
