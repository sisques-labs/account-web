import type { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';

/**
 * A single find-by-criteria filter. `TField` is the per-context queryable
 * field whitelist (e.g. `PlantQueryableField`) — the filter shape itself
 * (field/operator/value) is identical across every context.
 */
export interface Filter<TField extends string = string> {
  field: TField;
  operator: FilterOperator;
  value: unknown;
}
