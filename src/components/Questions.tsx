import useSelectedFiltersState from "../client/useSelectedFiltersState";
import { filterProducts, shouldIgnoreQuestion, shouldIgnoreQuestionOption } from "../functions/filter_products";
import { flattenQuestions } from "../util/filters";
import type { QuestionFilter, SelectedFilters, TransformedFilters, TransformedProduct } from "../util/types";
import Button from "./Button";
import Question from "./Question";
import QuestionStatus from "./QuestionStatus";
import { useEffect, useMemo, useState } from "preact/hooks";

export function Questions({ filters, products, initialUrl }: { filters: TransformedFilters, products: TransformedProduct[], initialUrl: URL }) {
    const flatQuestions = useMemo(() => {
        return flattenQuestions(filters)
    }, [filters])

    const [selectedFilters, setSelectedFilters, goBack] = useSelectedFiltersState(flatQuestions, initialUrl)

    const filteredProducts = useMemo(() => {
        return filterProducts(products, selectedFilters)
    }, [selectedFilters])

    function getNextIndex(carry: number = 0) {
        const lastFilter = selectedFilters[selectedFilters.length - 1]

        let nextIndex = (lastFilter ? lastFilter.questionIndex + 1 : 0) + carry

        if (nextIndex >= flatQuestions.length) {
            return nextIndex
        }

        const ignore = shouldIgnoreQuestion(filteredProducts, flatQuestions[nextIndex])

        if (ignore) {
            return getNextIndex(carry + 1)
        }

        return nextIndex
    }

    const isLast = useMemo(() => {
        return getNextIndex() >= flatQuestions.length
    }, [selectedFilters])

    const questionIndex = useMemo(() => {

        const index = getNextIndex()

        if (index >= flatQuestions.length) {
            return index - 1
        }

        return index
    }, [selectedFilters])

    useEffect(() => {
        console.log(selectedFilters, filterProducts.length)
    }, [selectedFilters, filterProducts])

    const question: QuestionFilter = flatQuestions[questionIndex]

    const [nextFilterValue, setNextFilterValue] = useState<{ key: string, values: string[] } | null>(null)

    function canGoForward() {
        return !!nextFilterValue && !isLast
    }

    function forward() {
        if (!canGoForward() || !nextFilterValue) return
        setSelectedFilters([...selectedFilters, { ...nextFilterValue, questionIndex: questionIndex }])
        setNextFilterValue(null)
    }

    function canGoBack() {
        return selectedFilters.length > 0
    }

    function back() {
        if (!canGoBack()) return
        goBack(selectedFilters.slice(0, -1))
        setNextFilterValue(selectedFilters[selectedFilters.length - 1])
    }

    return <div
        className="fixed top-0 left-0 w-full h-full bg-white"
    >
        <div className="absolute bottom-[64px] left-0 right-0 top-0 container overflow-y-auto">
            <h1 className="text-2xl lg:text-4xl mt-10">Guía de selección</h1>

            {!isLast && <>
                <QuestionStatus
                    key={question.key + "-status"}
                    question={question}
                    index={questionIndex}
                    selectedFilters={selectedFilters}
                    filteredProducts={filteredProducts}
                    forward={canGoForward() ? forward : undefined}
                    back={canGoBack() ? back : undefined}
                />

                <Question key={question.key} question={{
                    ...question,
                    values: question.values.filter(value => !shouldIgnoreQuestionOption(filteredProducts, question.key, [value.key]))
                }} onChange={setNextFilterValue} values={nextFilterValue?.values} />
            </>}

            {isLast && <>
                MOSTRAR PRODUCTOS
            </>}

        </div>
        <div className="absolute bottom-0 left-0 right-0 py-[12px] px-[20px] shadow-[2px_0_10px_-3px_rgba(0,0,0,0.3)] flex justify-between">
            <Button onClick={() => back()}>
                Atrás
            </Button>
            <span></span>
            {!isLast && <Button
                disabled={!nextFilterValue}
                onClick={() => {
                    forward()
                }}
            >
                Siguiente
            </Button>}
        </div>
    </div>
}