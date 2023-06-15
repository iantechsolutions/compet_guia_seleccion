import type { QuestionFilter, SelectedFilters } from "../util/types";
import { useEffect, useMemo, useState } from "preact/hooks";
import { fragmentToSelectedFilters, selectedFiltersToFragment } from "./filtersEncoding";

function getWindow() {
    return typeof window !== 'undefined' ? window : undefined;
}

export default function useSelectedFiltersState(questions: QuestionFilter[], initialUrl: URL) {
    const window = getWindow()

    const [search, setSearch] = useState(window?.location.search || initialUrl.search)

    useEffect(() => {
        const handleHistoryChange = () => {
            // Handle history change here
            console.log('History changed');
            setSearch(window!.location.search)
        };

        // Add event listener for 'popstate' event
        window!.addEventListener('popstate', handleHistoryChange);

        return () => {
            // Clean up by removing the event listener
            window!.removeEventListener('popstate', handleHistoryChange);
        };
    }, [setSearch]);

    function indexOfQuestion(key: string) {
        return questions.findIndex(question => question.key == key)
    }

    function indexOfValue(questionIndex: number, valueKey: string) {
        return questions[questionIndex].values.findIndex(value => value.key == valueKey)
    }

    function questionFromIndex(index: number) {
        return questions[index]
    }

    function valueFromIndex(questionIndex: number, valueIndex: number) {
        return questions[questionIndex].values[valueIndex]
    }

    function goBack(filters: SelectedFilters) {
        if (!window) return
        let stateIndex = parseInt(window.history.state?.index);
        if (!Number.isInteger(stateIndex)) stateIndex = 0;

        console.log("back", stateIndex)

        if (stateIndex > 0) {
            window.history.back()
        } else {
            setSelectedFilters(filters, true)
        }
    }

    function setSelectedFilters(filters: SelectedFilters, replace = false) {
        if (!window) return

        const searchParams = new URLSearchParams(window.location.search)

        for (const filter of filters) {
            const qi = indexOfQuestion(filter.key)
            searchParams.set(qi.toString(), filter.values.map(v => indexOfValue(qi, v)).join(','))
        }

        const newUrl = new URL(window.location.href, window.location.origin)
        newUrl.search = searchParams.toString()

        let stateIndex = parseInt(window.history.state?.stateIndex);
        if (!Number.isInteger(stateIndex)) stateIndex = 0;

        if (replace) {
            window.history.replaceState({ index: stateIndex }, '', newUrl.toString())
        } else {

            window.history.pushState({ index: stateIndex + 1 }, '', newUrl.toString())
        }

        setSearch(newUrl.search)
    }

    const selectedFilters = useMemo(() => {
        if(!search) return [] as SelectedFilters

        const searchParams = new URLSearchParams(search)

        const filters: SelectedFilters = []

        let index = 0

        for (const question of questions) {
            const values = searchParams.get(indexOfQuestion(question.key).toString())

            if (!values) continue;

            if (values.length > 0) {
                filters.push({
                    key: question.key,
                    values: values?.split(',').map(valueIndex => valueFromIndex(index, parseInt(valueIndex)).key) || [],
                    questionIndex: index++
                })
            }
        }

        return filters

    }, [search, questions])

    return [selectedFilters, setSelectedFilters, goBack] as const

}


// export default function useSelectedFiltersState(questions: QuestionFilter[]) {
//     const window = getWindow()

//     if (!window) {
//         return useState<SelectedFilters>([])
//     }

//     const fragment = (window.location?.hash || '')

//     function setSelectedFilters(filters: SelectedFilters) {
//         if (!window) return
//         window.location.hash = (selectedFiltersToFragment(filters, questions))
//     }

//     if (fragment) {
//         const selectedFilters = useMemo(() => fragmentToSelectedFilters(fragment, questions), [fragment, questions])
//         return [selectedFilters, setSelectedFilters] as const
//     }

//     return [[] as SelectedFilters, setSelectedFilters] as const
// }
