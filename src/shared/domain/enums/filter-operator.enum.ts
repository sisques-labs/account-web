/**
 * Mirrors the `FilterOperator` GraphQL enum (`@sisques-labs/nestjs-kit`).
 * Values match the GraphQL wire representation (enum member names, e.g.
 * `"LIKE"`), not the operator's internal string ('like') used server-side.
 */
export enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LIKE = 'LIKE',
  IN = 'IN',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
}
