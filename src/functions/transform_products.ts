import type {
    Product,
    ProductTransformedFilters,
    RawDataStructureDefinition,
    TransformedProduct
} from '../util/types'
import type {
    ExtractedFilters,
    TypedSingleTransformedFilter
} from '../util/types'
import { extractFilters } from './extract_filters'

export function transformProducts(
    products: Product[],
    filters: ExtractedFilters
): TransformedProduct[] {
    return products.map((p) => ({
        ...p,
        extracted_params: transformFiltersForProduct(p, filters)
    }))
}

export function transformFiltersForProduct(
    product: Product,
    filters: ExtractedFilters
) {
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

function transformFiltersOfTypeSelect(
    product: Product,
    key: string,
    filter: TypedSingleTransformedFilter
): string[] {
    if (filter.type !== 'select') {
        throw new Error('filter.type must be "select"')
    }

    const singleValue = product.params[key].toString()
    const values = [singleValue]
    return values
}

enum CheckboxValue {
    yes = 'S',
    no = 'N'
}

function transformFiltersOfTypeCheckBox(
    product: Product,
    filter: TypedSingleTransformedFilter
): string[] {
    if (filter.type !== 'checkbox-group') {
        throw new Error('filter.type must be "select"')
    }

    const values: string[] = []
    filter.values.forEach((checkboxItem) => {
        const key = checkboxItem.key
        const value = product.params[key]
        if (value === CheckboxValue.yes) {
            values.push(key)
        }
    })

    return values
}
