import type { Product, RawDataStructureDefinition } from "../util/types";
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

export function transformProducts(products: Product[], filters: RawDataStructureDefinition) {
    return products.map(p => ({
        ...p,
        transformed_params: transformFiltersForProduct(p, filters)
    }))
}

interface TransformedFilters {
    [key: string]: string[]
}

export function transformFiltersForProduct(product: Product, filters: RawDataStructureDefinition) {
    const transformedFilters: TransformedFilters = {}

    _transformFiltersForProduct(product, filters, transformedFilters)

    return transformedFilters
}


function _transformFiltersForProduct(product: Product, filters: RawDataStructureDefinition, transformedFilters: TransformedFilters = {}) {
    filters.forEach(filter => {
        // console.log('filters', filter.label, filter.type)
        if (filter.type === 'select') {
            const [key, values] = transformFiltersOfTypeSelect(product, filter)
            transformedFilters[key] = values

        } else if (filter.type === 'checkbox-group') {
            const [key, values] = transformFiltersOfTypeCheckBox(product, filter)
            transformedFilters[key] = values

        } else if (filter.type === 'grouptabsheet') {
            _transformFiltersForProduct(product, filter.tabsdata.reduce((acc, value) => ([...acc, ...value]), [] as RawDataStructureDefinition), transformedFilters)

        } else if (filter.type === 'row') {
            _transformFiltersForProduct(product, filter.rowdata.reduce((acc, value) => ([...acc, ...value]), [] as RawDataStructureDefinition), transformedFilters)

        }
    })
}

function transformFiltersOfTypeSelect(product: Product, filter: ArrayElement<RawDataStructureDefinition>): [string, string[]] {
    if (filter.type !== 'select') {
        throw new Error('filter.type must be "select"')
    }

    const key = filter.name
    const filtersValues = filter.values.map(value => value.value)
    const singleValue = product.params[key].toString()
    const values = [singleValue]
    return [key, values]
}

enum CheckboxValue {
    yes = 'S',
    no = 'N',
}

function transformFiltersOfTypeCheckBox(product: Product, filter: ArrayElement<RawDataStructureDefinition>): [string, string[]] {
    if (filter.type !== 'checkbox-group') {
        throw new Error('filter.type must be "select"')
    }

    const key = filter.name
    const values: string[] = []
    filter.values.forEach(checkboxItem => {
        const key = checkboxItem.value
        const value = product.params[key]
        if (value === CheckboxValue.yes) {
            values.push(key)
        }
    })

    return [key, values]
}