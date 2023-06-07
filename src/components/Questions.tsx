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

    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})

    const filtered = useMemo(() => {
        return filterProducts(products, selectedFilters, flatFilters)
    }, [products, selectedFilters])

    function nextQuestion(carry: number = 0) {
        const nextSoubgroup = subgroups[subgroupIndex + 1 + carry]

        if (!nextSoubgroup) return

        // const tryWithAllNextFilters 
        // TODO: Create a list of all posibble selected filters

        const ignore = shouldIgnoreQuestion(products, selectedFilters, [], flatFilters)

        if (ignore) { 
            return nextQuestion(carry + 1)
        }

        setSubgroupIndex(subgroupIndex + 1 + carry)
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
            <SubGroupRender
                subgroup={subgroups[subgroupIndex]}
                onNext={() => nextQuestion()}
                setFilter={setFilter}
                toggleFilter={toggleFilter}
            />
            <pre>Productos filtrados:{filtered.length}</pre>
            <pre>{JSON.stringify(selectedFilters, null, 2)}</pre>
        </div>
    )
}

interface SubgroupRenderProps {
    subgroup: FlattFilterSubgroupGroup
    onNext?: () => unknown
    setFilter: (key: string, value: string | null) => unknown
    toggleFilter: (key: string, value: string, checked: boolean) => unknown
}

export function SubGroupRender({ subgroup, onNext, setFilter, toggleFilter }: SubgroupRenderProps) {
    return <div class="p-4 bg-blue-100 rounded-xl">
        {subgroup.parent.label && <h2 className="text-2xl font-semibold">{subgroup.parent.label}</h2>}
        {subgroup.label && <h3 className="text-xl font-semibold">{subgroup.label}</h3>}
        <div>
            {subgroup.filters.map((filter) => {
                if (filter.type === 'select') return <QuestionWrapper key={filter.key}><SelectRender filter={filter} setFilter={setFilter} /></QuestionWrapper>
                if (filter.type === 'checkbox') return <QuestionWrapper key={filter.key} ><CheckboxRender filter={filter} toggleFilter={toggleFilter} /></QuestionWrapper>
            })}
        </div>
        <button type="button" className="px-4 py-2 bg-blue-500 rounded-md shadow-md cursor-pointer text-white font-semibold" onClick={onNext}>Siguiente</button>
    </div>
}

export function QuestionWrapper({ children }: { children: any }) {
    return <div className="border-l-4 border-indigo-500 my-3 px-3">
        {children}
    </div>
}

export function SelectRender({ filter, setFilter }: {
    filter: ArrayElement<ArrayElement<FilterGroup['subgroups']>['filters']>
    setFilter: (key: string, value: string | null) => unknown
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
                    return <option key={value.key}>{value.label}</option>
                })}
            </select>
        </div>
    )
}
export function CheckboxRender({ filter, toggleFilter }: {
    filter: ArrayElement<ArrayElement<FilterGroup['subgroups']>['filters']>
    toggleFilter: (key: string, value: string, checked: boolean) => unknown
}) {
    return (
        <div>
            <p>{filter.label}</p>
            <ul>
                {filter.values.map((value) => {
                    return <li className="ml-4">
                        <input type="checkbox" id={value.key} key={value.key} onChange={e => {
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
