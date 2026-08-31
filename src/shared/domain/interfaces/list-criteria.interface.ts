import type { Filter } from '@/shared/domain/interfaces/filter.interface';
import type { Sort } from '@/shared/domain/interfaces/sort.interface';

/**
 * Flexible find-by-criteria input for a list query: an array of filters and
 * sorts (each validated server-side against the context's queryable field
 * whitelist) plus pagination. `TField` is the per-context queryable field
 * enum (e.g. `PlantQueryableField`).
 */
export interface ListCriteria<TField extends string = string> {
  filters?: Filter<TField>[];
  sorts?: Sort<TField>[];
  pagination?: { page: number; perPage: number };
}
