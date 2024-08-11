import { useState } from "preact/hooks";
import type { QuestionFilter, SelectedFilters } from "../util/types";

export default function useSelectedFiltersState(
	questions: QuestionFilter[],
	initialFilters?: SelectedFilters | null,
) {
	// TODO: Do something cool with data in the url
	return useState<SelectedFilters>(initialFilters || []);
}
