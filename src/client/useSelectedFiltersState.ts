import type { QuestionFilter, SelectedFilters } from "../util/types";
import { useEffect, useMemo, useState } from "preact/hooks";

export default function useSelectedFiltersState(questions: QuestionFilter[]) {
    // TODO: Do something cool with data in the url
    return useState<SelectedFilters>([])
}
