import { sortable } from "../types/types";
/**
 * the sortable for the async values
 * @param asyncItems the async items
 * @param sortFn the sortable to apply to the async items
 *
 * {@link https://sort-es.netlify.app/by-async sortAsync docs}
 * @version 1.0.0
 */
declare const sortAsync: <T>(asyncItems: Promise<T>[], sortFn: sortable<T>) => Promise<T[]>;
export declare class AsyncArray<T> extends Array<Promise<T>> {
    constructor(items: Promise<T>[]);
    sortAsync(sortFn: sortable<T>): Promise<T[]>;
}
export default sortAsync;
