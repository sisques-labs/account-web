import type { SortDirection } from '@/shared/domain/enums/sort-direction.enum';

/**
 * A single find-by-criteria sort. `TField` is the per-context queryable
 * field whitelist (e.g. `PlantQueryableField`) — the sort shape itself
 * (field/direction) is identical across every context.
 */
export interface Sort<TField extends string = string> {
  field: TField;
  direction: SortDirection;
}
