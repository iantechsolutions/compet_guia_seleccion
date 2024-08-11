import type {
    ArrayElement,
    ExtractedFilters,
    Product,
    RawDataStructureDefinition,
    SingleTransformedFilter
} from '../util/types'

export function extractFilters(
    filters: RawDataStructureDefinition
): ExtractedFilters {
    const transformedFilters: ExtractedFilters = {}

    _extractFilters(filters, transformedFilters)

    return transformedFilters
}

function _extractFilters(
    filters: RawDataStructureDefinition,
    transformedFilters: ExtractedFilters = {}
) {
    filters.forEach((filter) => {
        if (filter.type === 'select') {
            const [key, values] = extractFilterOfTypeSelect(filter)
            transformedFilters[key] = {
                label: filter.label,
                type: 'select',
                values
            }
        } else if (filter.type === 'checkbox-group') {
            const [key, values] = extractFilterOfTypeCheckbox(filter)
            transformedFilters[key] = {
                label: filter.label,
                type: 'checkbox-group',
                values
            }
        } else if (filter.type === 'grouptabsheet') {
            _extractFilters(
                filter.tabsdata.reduce(
                    (acc, value) => [...acc, ...value],
                    [] as RawDataStructureDefinition
                ),
                transformedFilters
            )
        } else if (filter.type === 'row') {
            _extractFilters(
                filter.rowdata.reduce(
                    (acc, value) => [...acc, ...value],
                    [] as RawDataStructureDefinition
                ),
                transformedFilters
            )
        }
    })
}

function extractFilterOfTypeSelect(
    filter: ArrayElement<RawDataStructureDefinition>
): [string, SingleTransformedFilter] {
    if (filter.type !== 'select') {
        throw new Error('filter.type must be "select"')
    }

    const values = filter.values.map((value) => ({
        key: value.value,
        label: value.label
    }))

    const key = filter.name

    return [key, values]
}

function extractFilterOfTypeCheckbox(
    filter: ArrayElement<RawDataStructureDefinition>
): [string, SingleTransformedFilter] {
    if (filter.type !== 'checkbox-group') {
        throw new Error('filter.type must be "select"')
    }

    const key = filter.name
    const values = filter.values.map((checkboxItem) => {
        const key = checkboxItem.value
        const label = checkboxItem.label
        return { key, label }
    })

    return [key, values]
}
