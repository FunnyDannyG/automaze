import { sortable } from "../types/types";
import { SortOption } from "../interfaces/interfaces";
declare const byAny: <T extends string | number | Date>(options?: SortOption) => sortable<T>;
export default byAny;
