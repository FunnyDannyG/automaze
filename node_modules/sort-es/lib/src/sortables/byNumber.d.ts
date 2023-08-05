import { SortOption } from "../interfaces/interfaces";
import { sortableWithOption } from "../types/types";
/**
 * the sortable to sort the **number primitive**
 * @param options the options to sort the numbers correctly
 *
 * {@link https://sort-es.netlify.app/by-number byNumber docs}
 * @version 1.0.0
 */
declare const byNumber: sortableWithOption<number, SortOption>;
export default byNumber;
