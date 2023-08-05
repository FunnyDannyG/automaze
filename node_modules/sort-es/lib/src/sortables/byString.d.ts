import { SortByStringOption } from "../interfaces/interfaces";
import { sortableWithOption } from "../types/types";
/**
 * the sortable to sort the **string primitive**
 * @param options the options to sort the strings correctly
 *
 * {@link https://sort-es.netlify.app/by-string byString docs}
 * @version 1.0.0
 */
declare const byString: sortableWithOption<string, SortByStringOption>;
export default byString;
