import { useEffect, useMemo, useState } from "preact/hooks";
import { FlattFilterSubgroupGroup, flattenFilters, flattenSubGroups } from "../util/filters";
import type { ArrayElement, FilterGroup, SelectedFilters, SideToSideFilterGroups, TransformedFilters, TransformedProduct } from "../util/types";
import { filterProducts, shouldIgnoreQuestion } from "../functions/filter_products";

export default function Questions({ filters, products }: { filters: TransformedFilters, products: TransformedProduct[] }) {

    const flatFilters = useMemo(() => {
        return flattenFilters(filters)
    }, [filters])

    const subgroups = useMemo(() => {
        return flattenSubGroups(filters)
    }, [filters])

    const [subgroupIndex, setSubgroupIndex] = useState(0)
    const [skippedIndexes, setSkippedIndexes] = useState<number[]>([])

    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})

    const [isLast, setIsLast] = useState(false)

    const filtered = useMemo(() => {
        return filterProducts(products, selectedFilters, flatFilters)
    }, [products, selectedFilters])


    function shouldHideOptionOfCurrentSubgroup(filterKey: string, filterValue: string) {
        const testFilters = {
            ...selectedFilters,
        }

        for (const filter of subgroups[subgroupIndex].filters) {
            delete testFilters[filter.key]
        }

        testFilters[filterKey] = [filterValue]

        return filterProducts(products, testFilters, flatFilters).length === 0
    }


    function nextQuestion(carry: number = 0) {
        const nextSoubgroup = subgroups[subgroupIndex + 1 + carry]

        if (!nextSoubgroup) {
            setIsLast(true)
            return
        }

        const tryWithAllNextFilters: { key: string, values: string[] }[] = []

        nextSoubgroup.filters.forEach((filter) => {
            if (filter.type == 'select') {
                filter.values.forEach((value) => {
                    tryWithAllNextFilters.push({
                        key: filter.key,
                        values: [value.key]
                    })
                })
            }
            if (filter.type == 'checkbox') {
                filter.values.forEach((value) => {
                    tryWithAllNextFilters.push({
                        key: filter.key,
                        values: [value.key]
                    })
                })
            }
        })

        const ignore = shouldIgnoreQuestion(products, selectedFilters, tryWithAllNextFilters, flatFilters)

        if (ignore) {
            setSkippedIndexes([...skippedIndexes, subgroupIndex + 1 + carry])
            return nextQuestion(carry + 1)
        }

        setSubgroupIndex(subgroupIndex + 1 + carry)
    }

    function prevQuestion(carry: number = 0) {
        const nextIndex = subgroupIndex - carry - 1

        if (nextIndex < 0) return

        if (skippedIndexes.includes(nextIndex)) {
            setSkippedIndexes(skippedIndexes.filter((v) => v !== nextIndex))
            return prevQuestion(carry + 1)
        }

        let keysOfIndex = subgroups[subgroupIndex].filters.map((v) => v.key)

        const copy = {
            ...selectedFilters,
        }

        keysOfIndex.forEach((key) => {
            delete copy[key]
        })

        keysOfIndex = subgroups[nextIndex].filters.map((v) => v.key)

        keysOfIndex.forEach((key) => {
            delete copy[key]
        })

        setSelectedFilters(copy)
        setSubgroupIndex(nextIndex)
    }

    function setFilter(key: string, value: string | null) {
        if (value === null || value === '') {
            const copy = {
                ...selectedFilters,
            }
            delete copy[key]
            return setSelectedFilters(copy)
        }

        setSelectedFilters({
            ...selectedFilters,
            [key]: [value]
        })
    }

    function toggleFilter(key: string, value: string, checked: boolean) {
        if (checked) {
            setSelectedFilters({
                ...selectedFilters,
                [key]: [...(selectedFilters[key] ?? []), value]
            })
        } else {
            setSelectedFilters({
                ...selectedFilters,
                [key]: selectedFilters[key].filter((v) => v !== value)
            })
        }
    }

    return (
        <div className="m-2">
            <h1 className="text-2xl">Filtros</h1>
            {/* <pre>{JSON.stringify(filters, null, 2)}</pre>
            <pre>{JSON.stringify(products, null, 2)}</pre> */}
            {!isLast && <SubGroupRender
                subgroup={subgroups[subgroupIndex]}
                onNext={() => nextQuestion()}
                onBack={() => prevQuestion()}
                setFilter={setFilter}
                toggleFilter={toggleFilter}
                shouldHideOptionOfCurrentSubgroup={shouldHideOptionOfCurrentSubgroup}
                disableNext={subgroupIndex === subgroups.length - 1 || filtered.length === 0}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
            />}
            {isLast &&
                <button type="button" className="px-10 py-2 bg-gray-100 rounded-md shadow-md cursor-pointer font-semibold my-4" onClick={() => setIsLast(false)}>Modificar filtros</button>
            }
            {isLast && <div className="p-4 bg-blue-100 rounded-xl">
                {filtered.length === 0 && <p>No hay productos que cumplan con los filtros seleccionados</p>}
                {filtered.length > 0 && <div>
                    <h2 className="text-2xl font-semibold">Productos filtrados ({filtered.length})</h2>
                    <ul className="border-2 border-gray-400 rounded-xl my-1 px-4 py-2">
                        {filtered.map((product) => {
                            return <li>
                                <p className="text-lg font-semibold">{product.name}</p>
                                <p>{product.description}</p>
                            </li>
                        })}
                    </ul>
                </div>}
            </div>}
            {!isLast && <>
                <pre>Grupo de preguntas: {subgroupIndex + 1}/{subgroups.length}</pre>
                <br />
            </>}
            <pre className="text-xl">Productos filtrados:{filtered.length}</pre>
            <br />
            <pre>{JSON.stringify(selectedFilters, null, 2)}</pre>
            <br />
            <pre>
                {`// Preguntas

// La estructura se divide en grupos y subgrupos
// Todas las preguntas estan en subgrupos. Y todos los subgrupos estan en grupos.
// Las preguntas en un mismo subgrupo se muestran juntas, mientras que cada subgrupo se muestra independientemente.
// Los grupos grandes organizan subgrupos relacionados y tiene un título general.
// Los subgrupos tienen un título opcional

// Grupo general:
//  - Subgrupo 1:
//    1. Nivel de tensión (select)
//  - Subgrupo 2:
//    2. Tipo de accesorio (select)
//  - Subgrupo 3:
//    3. Tipo de tecnología (solo para algunos accesorios) (select)
//  - Subgrupo 4:
//    4. Uso interior o exterior (checkbox)
// Separacion lado a lado:
// (izquierda) Grupo cable principal:
//  - Subgrupo 1:
//    5. Número de fases del cable principal (checkbox)
//  - Subgrupo 2:
//    6. Tipo de Pantalla de la/s fase/s
//  - Subgrupo 3:
//    7. Sección de cable ppal. unipolar (checkbox)
//    8. Cable ppal. bipolar (mm2) (checkbox)
//    9. Cable ppal. tripolar (mm2) (checkbox)
//    10. Cable ppal. tripolar con neutro (mm2) (checkbox)
// (derecha) Grupo cable secundario:
//  - Subgrupo 1:
//    11. Cantidad de fases del cable derivado (checkbox)
// - Subgrupo 2:
//    12. Cable derivado unipolar (mm2) (checkbox)
//    13. Cable derivado bipolar (mm2)
//    14. Cable derivado tripolar (mm2)
//    15. Cable derivado tetrapolar (mm2)
// Grupo final: (debe aplicar a un solo tipo de accesorio pero no se)
//  - Subgrupo 1:
//    16. Interfaz / Corriente nominal de operación (select)
//    17. Tipo de separable (select)
//    18. Sistema de sujeción (select)`}
            </pre>
        </div>
    )
}

interface SubgroupRenderProps {
    subgroup: FlattFilterSubgroupGroup
    onNext?: () => unknown
    onBack?: () => unknown
    setFilter: (key: string, value: string | null) => unknown
    toggleFilter: (key: string, value: string, checked: boolean) => unknown
    shouldHideOptionOfCurrentSubgroup: (filterKey: string, filterValue: string) => boolean
    disableNext: boolean
    setSelectedFilters: (filters: SelectedFilters) => unknown
    selectedFilters: SelectedFilters
}

export function SubGroupRender({ subgroup, onNext, onBack, setFilter, toggleFilter, shouldHideOptionOfCurrentSubgroup, disableNext, setSelectedFilters, selectedFilters }: SubgroupRenderProps) {
    return <div class="p-4 bg-blue-100 rounded-xl max-h-[calc(100vh_-_200px)] overflow-auto">
        {subgroup.parent.label && <h2 className="text-2xl font-semibold">{subgroup.parent.label}</h2>}
        {subgroup.label && <h3 className="text-xl font-semibold">{subgroup.label}</h3>}
        <div>
            {subgroup.filters.map((filter) => {
                if (filter.type === 'select') return <QuestionWrapper key={filter.key}>
                    <SelectRender
                        filter={filter}
                        setFilter={setFilter}
                        shouldHideOptionOfCurrentSubgroup={shouldHideOptionOfCurrentSubgroup}
                        setSelectedFilters={setSelectedFilters}
                    />
                </QuestionWrapper>
                if (filter.type === 'checkbox') return <QuestionWrapper key={filter.key} >
                    <CheckboxRender
                        filter={filter}
                        toggleFilter={toggleFilter}
                        shouldHideOptionOfCurrentSubgroup={shouldHideOptionOfCurrentSubgroup}
                        setSelectedFilters={setSelectedFilters}
                        selectedFilters={selectedFilters}
                    />
                </QuestionWrapper>
            })}
        </div>
        <div class="flex gap-2 flex-row-reverse">
            <button type="button" className="px-4 py-2 bg-blue-500 rounded-md shadow-md cursor-pointer text-white font-semibold disabled:opacity-50" onClick={onNext} disabled={disableNext}>Siguiente</button>
            <button type="button" className="px-4 py-2 bg-gray-100 rounded-md shadow-md cursor-pointer font-semibold" onClick={onBack}>Atras</button>
        </div>

    </div>
}

export function QuestionWrapper({ children }: { children: any }) {
    return <div className="border-l-4 border-indigo-500 my-3 px-3">
        {children}
    </div>
}

export function SelectRender({ filter, setFilter, shouldHideOptionOfCurrentSubgroup }: {
    filter: ArrayElement<ArrayElement<FilterGroup['subgroups']>['filters']>
    setFilter: (key: string, value: string | null) => unknown
    shouldHideOptionOfCurrentSubgroup: (filterKey: string, filterValue: string) => boolean
    setSelectedFilters?: (filters: SelectedFilters) => unknown
}) {
    useEffect(() => {
        if (filter.allowUndefined) return
        setFilter(filter.key, filter.values[0].key)
    }, [])

    return (
        <div>
            <p className="font-semibold my-1">{filter.label}</p>
            <select className="border-2 border-indigo-500"
                onChange={(e) => {
                    const value = (e.target as any).value
                    if (value === '') setFilter(filter.key, null)
                    setFilter(filter.key, value)
                }}
            >
                {filter.allowUndefined && <option value="" key={filter.key + "_null"}>Todos</option>}
                {filter.values.map((value) => {
                    const hidden = shouldHideOptionOfCurrentSubgroup(filter.key, value.key)

                    return <option key={value.key} className={hidden ? "opacity-35" : ""} disabled={hidden}>{value.label}</option>
                })}
            </select>
        </div>
    )
}
export function CheckboxRender({ filter, toggleFilter, shouldHideOptionOfCurrentSubgroup, setSelectedFilters, selectedFilters }: {
    filter: ArrayElement<ArrayElement<FilterGroup['subgroups']>['filters']>
    toggleFilter: (key: string, value: string, checked: boolean) => unknown
    shouldHideOptionOfCurrentSubgroup: (filterKey: string, filterValue: string) => boolean
    setSelectedFilters: (filters: SelectedFilters) => unknown
    selectedFilters: SelectedFilters
}) {
    useEffect(() => {
        // const keys = filter.values.map((value) => value.key)
        setSelectedFilters({
            ...selectedFilters,
            // [filter.key]: keys
            [filter.key]: []
        })
    }, [])

    return (
        <div>
            <p>{filter.label}</p>
            <ul>
                {filter.values.map((value) => {
                    const hidden = shouldHideOptionOfCurrentSubgroup(filter.key, value.key)

                    return !hidden && <li className="ml-4">
                        <input
                            defaultChecked={false}
                            type="checkbox"
                            id={value.key}
                            key={value.key}
                            onChange={e => {
                                const checked = !!(e.target as any).checked
                                toggleFilter(filter.key, value.key, checked)
                            }} />
                        <label htmlFor={value.key}>{value.label}</label>
                    </li>
                })}
            </ul>
        </div>
    )
}
