import useSelectedFiltersState from "../client/useSelectedFiltersState";
import { filterProducts, shouldIgnoreQuestion, shouldIgnoreQuestionOption } from "../functions/filter_products";
import { flattenQuestions } from "../util/filters";
import type { QuestionFilter, SelectedFilters, TransformedFilters, TransformedProduct } from "../util/types";
import Button from "./Button";
import { ProductsList } from "./ProductsList";
import Question from "./Question";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";

import NavKeysController, { NavKeyEvent, Action as NavKeyEventAction } from 'nav-keys'
import QuestionsViewHeader from "./QuestionsViewHeader";
import IntroductionScreen from "./IntroductionScreen";
import { Entry, addEntry, getCurrentState, getEntries, updateCurrentState } from "../client/saveLocalState";
import { mapSelectedFilters } from "../util/mapSelectedFilters";
import Footer from "./Footer";

const options = {
    allowHashchange: true,
    listenHashchange: false
}
// https://www.npmjs.com/package/nav-keys
const win = typeof window !== 'undefined' ? window : undefined
const controller = win ? new NavKeysController(window.history, options) : null// both params are optional

type QuestionsViewProps = {
    filters: TransformedFilters,
    products: TransformedProduct[],
    initialUrl: URL,
    onShowInitialPage?: () => unknown,
    initialFilters?: SelectedFilters | null
    setStarted?: (started: boolean) => unknown
}

export default function QuestionsViewWrapper(props: QuestionsViewProps) {
    const [started, setStarted] = useState(false)
    const [initialFilters, setInitialFilters] = useState<SelectedFilters | null>(null)

    const { filters } = props

    const flatQuestions = useMemo(() => {
        return flattenQuestions(filters)
    }, [filters])

    const filtersLabelsByValueKey = useMemo(() => {
        const map = new Map<string, string>()
        for (const question of flatQuestions) {
            question.values.forEach(value => {
                map.set(value.key, value.label)
            })
        }
        return map
    }, [flatQuestions])

    function start(entry?: Entry) {
        setStarted(true)
        if (entry) {
            setInitialFilters(entry.filters)
        } else {
            setInitialFilters(null)
        }
    }

    if (!started) {
        return <IntroductionScreen onClickStart={start} filtersLabelsByValueKey={filtersLabelsByValueKey} />
    }

    return <QuestionsView {...props} onShowInitialPage={() => setStarted(false)} initialFilters={initialFilters} setStarted={setStarted} />
}

export function QuestionsView({ filters, products, onShowInitialPage, initialFilters, setStarted }: QuestionsViewProps) {
    const flatQuestions = useMemo(() => {
        return flattenQuestions(filters)
    }, [filters])

    const filtersLabelsByValueKey = useMemo(() => {
        const map = new Map<string, string>()
        for (const question of flatQuestions) {
            question.values.forEach(value => {
                map.set(value.key, value.label)
            })
        }
        return map
    }, [flatQuestions])

    const [selectedFilters, setSelectedFilters] = useSelectedFiltersState(flatQuestions, initialFilters)

    const filteredProducts = useMemo(() => {
        return filterProducts(products, selectedFilters)
    }, [selectedFilters])

    function getNextIndex(carry: number = 0) {
        const lastFilter = selectedFilters[selectedFilters.length - 1]

        let nextIndex = (lastFilter ? lastFilter.questionIndex + 1 : 0) + carry

        if (nextIndex >= flatQuestions.length) {
            return nextIndex
        }

        const ignore = shouldIgnoreQuestion(filteredProducts, selectedFilters, flatQuestions[nextIndex])

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

    const question: QuestionFilter = flatQuestions[questionIndex]

    const [nextFilterValue, setNextFilterValue] = useState<{ key: string, values: string[] } | null>(null)

    function canGoForward() {
        return !!nextFilterValue && !isLast
    }

    function forward() {
        if (!canGoForward() || !nextFilterValue) return
        setSelectedFilters([...selectedFilters, { ...nextFilterValue, questionIndex: questionIndex, question }])
        setNextFilterValue(null)
    }

    function canGoBack() {
        return selectedFilters.length > 0
    }

    function back() {
        if (!canGoBack()) {
            return onShowInitialPage?.()
        }
        setSelectedFilters(selectedFilters.slice(0, -1))
        setNextFilterValue(selectedFilters[selectedFilters.length - 1])
    }

    const backRef = useRef<typeof back>(back)
    const forwardRef = useRef<typeof forward>(forward)

    backRef.current = back
    forwardRef.current = forward

    useEffect(() => {
        return controller?.listen((e: NavKeyEvent) => {
            if (e.action === NavKeyEventAction.back) {
                backRef.current()
            } else if (e.action === NavKeyEventAction.forward) {
                forwardRef.current()
            }
        })
    })

    const canForward = useMemo(() => {
        return canGoForward()
    }, [nextFilterValue])

    const title = `(${filterProducts.length} productos) ` + (mapSelectedFilters(selectedFilters, filtersLabelsByValueKey, (filter, l) => {
        return l
    }).join(", "))

    useEffect(() => {
        updateCurrentState(selectedFilters, title)
    }, [questionIndex, selectedFilters, nextFilterValue])

    useEffect(() => {
        if (isLast) {
            addEntry(selectedFilters, title)
        }
    }, [isLast])

    // useEffect(() => {
    //     if (canForward && !controller?.isForwardButtonEnabled) {
    //         controller?.enableForwardButton()
    //     } else if (!canForward && controller?.isForwardButtonEnabled) {
    //         controller?.disableForwardButton()
    //     }
    // }, [canForward])

    const [showProducts, setShowProducts] = useState(false)

    const SHOW_MAX_PRODUCTS = 100

    return <div>

        <div className="fixed bottom-0 top-0 left-0 w-[0px]" id="height-snitcher" />

        <div className="min-h-[100vh]" id="set-height">
            <QuestionsViewHeader
                question={question}
                isFirst={selectedFilters.length === 0}
                isLast={isLast}
                productsCount={filteredProducts.length}
                selectedFilters={selectedFilters}
                forward={canGoForward() ? forward : undefined}
                back={canGoBack() ? back : undefined}
                filtersLabelsByValueKey={filtersLabelsByValueKey}
                resetToHome={() => {
                    setSelectedFilters([])
                    setStarted?.(false)
                }}
            />

            <Question key={question.key} question={{
                ...question,
                values: question.values.filter(value => !shouldIgnoreQuestionOption(filteredProducts, question, [value.key]))
            }} onChange={setNextFilterValue} values={nextFilterValue?.values} />

            <div className="container">
                {(!isLast && (!showProducts && filteredProducts.length < SHOW_MAX_PRODUCTS)) && <a href="!#" className="text-primary font-semibold" onClick={(e) => {
                    e.preventDefault()
                    setShowProducts(true)
                }}>Mostrar {filteredProducts.length} productos</a>}
                {(!isLast && (showProducts && filteredProducts.length < SHOW_MAX_PRODUCTS)) && <a href="!#" className="text-primary font-semibold" onClick={(e) => {
                    e.preventDefault()
                    setShowProducts(false)
                }}>Ocultar productos</a>}
                {(isLast || (showProducts && filteredProducts.length < SHOW_MAX_PRODUCTS)) && <>
                    <ProductsList products={filteredProducts} searchTitle={title} />
                </>}

            </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 py-[12px] px-[20px] shadow-[2px_0_10px_-3px_rgba(0,0,0,0.3)] flex justify-between">
            <Button onClick={() => back()}>
                Anterior
            </Button>
            <div className="flex items-center">
                <button type="buttom" className="rounded-full border p-1 flex gap-2 items-center pr-2"

                    onClick={() => {
                        window.scrollTo({ top: 100000, behavior: 'smooth' })
                    }}
                >
                    <img src="circle-info-solid.svg" className="min-w-[20px] w-[20px]" alt="Información" />
                    <span className="text-xs uppercase font-medium">Contacto</span>
                </button>
            </div>
            {isLast && <Button
                onClick={() => {
                    setSelectedFilters([])
                    setStarted?.(false)
                }}
            >
                Inicio
            </Button>}
            {!isLast && <Button
                disabled={!nextFilterValue}
                onClick={() => {
                    forward()
                }}
            >
                Siguiente
            </Button>}
        </div>


        <Footer />
    </div>





}