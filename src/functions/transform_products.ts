import type { Product, RawDataStructureDefinition } from "../util/types";
import { extractFilters, type ExtractedFilters, TypedSingleTransformedFilter } from "./extract_questions_from_filters";

export function transformProducts(products: Product[], _filters: RawDataStructureDefinition) {
    const filters = extractFilters(_filters)

    return products.map(p => ({
        ...p,
        transformed_params: transformFiltersForProduct(p, filters)
    }))
}

interface ProductTransformedFilters {
    [key: string]: string[]
}


export function transformFiltersForProduct(product: Product, filters: ExtractedFilters) {
    const transformedFilters: ProductTransformedFilters = {}

    for (const key in filters) {
        const filter = filters[key]
        if (filter.type === 'select') {
            const values = transformFiltersOfTypeSelect(product, key, filter)
            transformedFilters[key] = values

        } else if (filter.type === 'checkbox-group') {
            const values = transformFiltersOfTypeCheckBox(product, filter)
            transformedFilters[key] = values
        }
    }

    return transformedFilters
}

function transformFiltersOfTypeSelect(product: Product, key: string, filter: TypedSingleTransformedFilter): string[] {
    if (filter.type !== 'select') {
        throw new Error('filter.type must be "select"')
    }

    const filtersValues = filter.values.map(value => value.key)
    const singleValue = product.params[key].toString()
    const values = [singleValue]
    return values
}

enum CheckboxValue {
    yes = 'S',
    no = 'N',
}

function transformFiltersOfTypeCheckBox(product: Product, filter: TypedSingleTransformedFilter): string[] {
    if (filter.type !== 'checkbox-group') {
        throw new Error('filter.type must be "select"')
    }

    const values: string[] = []
    filter.values.forEach(checkboxItem => {
        const key = checkboxItem.key
        const value = product.params[key]
        if (value === CheckboxValue.yes) {
            values.push(key)
        }
    })

    return values
}