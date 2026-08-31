/**
 * Return shape for a mutation whose GraphQL response is a lightweight ack
 * (`{ id, success, message }`) rather than the full entity. Repositories
 * should return this instead of re-fetching the entity via `getById`/
 * `findById` right after the mutation — that extra round trip is wasted
 * work when the caller only needs the id (e.g. to invalidate a query).
 */
export interface CreatedEntity {
  id: string;
}
