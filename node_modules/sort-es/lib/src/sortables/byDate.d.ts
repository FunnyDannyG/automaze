import { SortByDateOption } from "../interfaces/interfaces";
import { datable, sortableWithOption } from "../types/types";
/**
 * the sortable for the date values
 * @param options sortable options for byDate
 *
 * {@link https://sort-es.netlify.app/by-date byDate docs}
 * @version 1.0.0
 */
declare const byDate: sortableWithOption<datable, SortByDateOption>;
export default byDate;
