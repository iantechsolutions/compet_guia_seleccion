import { useEffect, useState } from 'preact/hooks'
import { apiClient } from './client'
import type { FiltersValues, Product } from '../util/types'

export function useDefinitionsAndValues() {
    const [definitionsAndValues, setDefinitionsAndValues] = useState<
        Awaited<ReturnType<typeof apiClient.getFiltersAndValues>> | null
    >(null)

    const error: Error | null = null

    // Use effect, run once when component is mounted
    useEffect(() => {
        apiClient.getFiltersAndValues().then(setDefinitionsAndValues)
    }, [])

    return [definitionsAndValues, error]
}

export function useProducts(filtersValues: FiltersValues) {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        apiClient.getProducts(filtersValues).then(setProducts)
    }, [filtersValues])

    return products
}

export function useFiltersValues() {
    const [filtersValues, setFiltersValues] = useState<FiltersValues>({
        multiple: [], // ex: [{ max_voltage: 8 }, { max_voltage: 15 }] // indexes: 0 = left, 1 = right
        single: {}, // ex: { max_voltage: 8 }
    })

    function setSingleValue(key: string, value: string | number | null | undefined) {
        setFiltersValues((prev) => {
            const r = { ...prev }
            if (value === null || value === undefined || value === '') {
                delete r.single[key]
                return r
            }
            return {
                ...prev,
                single: ({
                    ...prev.single,
                    [key]: value,
                }),
            }
        })
    }

    function setMultipleValue(index: number, key: string, value: string | number | null | undefined) {
        setFiltersValues((prev) => {
            const r = { ...prev }

            for (let i = 0; i <= index; i++) {
                r.multiple[i] = r.multiple[i] || {}
            }

            if (value === null || value === undefined || value === '') {
                delete r.multiple[index][key]
            } else {
                r.multiple[index][key] = value
            }

            return r
        })
    }

    return { filtersValues, setSingleValue, setMultipleValue } as const
}