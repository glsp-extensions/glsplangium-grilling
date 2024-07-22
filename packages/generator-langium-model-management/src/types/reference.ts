/**
 * Reference interface which is used to serialize references
 */
export interface CrossReference<T> {
  /** the type of the referenced element */
  type: T;
  /** the document uri of the referenced element */
  __documentUri?: string;
  /** the path to the referenced element in the given document uri */
  __path?: string;
  /** the id of the referenced element */
  [ref: string]: string | T;
}
