import { ApiFilter } from "./interfaces";

function serializeValue(value: () => string) {
  return value();
}

function serializeApiFilter(filter: ApiFilter) {
  if (filter.value) {
    return `${filter.field}${filter.op}${serializeValue(filter.value)}`;
  } else {
    return `${filter.field}`;
  }
}

export function serializeApiFilters(filters: ApiFilter[]) {
  return filters.map(serializeApiFilter).join(",");
}
