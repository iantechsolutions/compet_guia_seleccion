import type { QuestionFilter, SelectedFilters } from "../util/types";
import { useState } from "preact/hooks";

export default function useSelectedFiltersState(questions: QuestionFilter[], initialFilters?: SelectedFilters | null) {
    // TODO: Do something cool with data in the url
    return useState<SelectedFilters>(initialFilters || [])
}
