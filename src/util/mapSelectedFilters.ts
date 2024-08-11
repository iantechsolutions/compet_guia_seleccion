import type { SelectedFilter, SelectedFilters } from "./types";

export function mapSelectedFilters<T>(
	selectedFilters: SelectedFilters,
	filtersLabelsByValueKey: Map<string, string>,
	mapper: (filter: SelectedFilter, label: string, index: number) => T,
) {
	return selectedFilters
		.filter((f) => {
			if (f.values.length === 1 && f.values[0] === "__skip_question")
				return false;
			return true;
		})
		.map((filter, i) => {
			const label = filter.values
				.map((value) => filtersLabelsByValueKey.get(value) || value)
				.join(" - ");
			return mapper(filter, label, i);
		});
}
