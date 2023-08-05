import { SortOption } from "../interfaces/interfaces";
import { sortableWithOption } from "../types/types";
/**
 * the sortable for the boolean values
 * @param options sortable options for byBoolean
 *
 * {@link https://sort-es.netlify.app/by-boolean byBoolean docs}
 * @version 1.3.0
 */
declare const byBoolean: sortableWithOption<boolean, SortOption>;
export default byBoolean;
